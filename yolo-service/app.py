import os
import io
import tempfile
import math
import logging
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8n.pt")

MAX_FILE_SIZE_MB = 10
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "bmp"}
ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}


# ── Helpers ───────────────────────────────────────────────────────────────────

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def validate_image(file) -> tuple[bool, str]:
    if file.mimetype not in ALLOWED_MIMETYPES:
        return False, f"Unsupported file type '{file.mimetype}'"
    contents = file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        return False, f"File too large ({size_mb:.1f} MB). Max: {MAX_FILE_SIZE_MB} MB"
    file.seek(0)  # reset after read
    return True, ""


def compute_grade(count: int, avg_confidence: float) -> dict:
    if count == 0:
        return {"grade": "Reject", "score": 0.0, "reason": "No objects detected"}

    conf_score = avg_confidence * 40
    count_score = min(60, math.log1p(count) / math.log1p(20) * 60)
    total = round(conf_score + count_score, 2)

    if total >= 80:
        grade = "A"
    elif total >= 60:
        grade = "B"
    elif total >= 40:
        grade = "C"
    elif total >= 20:
        grade = "D"
    else:
        grade = "Reject"

    return {
        "grade": grade,
        "score": total,
        "reason": f"{count} object(s) detected with avg confidence {avg_confidence:.1%}"
    }


def parse_detections(results, conf_threshold: float = 0.25) -> list:
    detections = []
    if not results.boxes:
        return detections

    for box in results.boxes:
        conf = float(box.conf[0])
        if conf < conf_threshold:
            continue
        cls_id = int(box.cls[0])
        label = results.names.get(cls_id, f"class_{cls_id}")
        x1, y1, x2, y2 = [round(float(v), 2) for v in box.xyxy[0]]
        detections.append({
            "label": label,
            "confidence": round(conf, 4),
            "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
        })

    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "YOLO API is running", "model": "yolov8n"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "yolov8n"})


@app.route("/classes", methods=["GET"])
def classes():
    return jsonify({"classes": model.names})


@app.route("/detect", methods=["POST"])
def detect():
    # ── Validate file presence ────────────────────────────────────────────────
    if "image" not in request.files:
        return jsonify({"error": "No image provided. Send file under key 'image'"}), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(image_file.filename):
        return jsonify({"error": f"Invalid extension. Allowed: {ALLOWED_EXTENSIONS}"}), 415

    valid, err_msg = validate_image(image_file)
    if not valid:
        return jsonify({"error": err_msg}), 415

    # ── Optional query params ─────────────────────────────────────────────────
    try:
        conf_threshold = float(request.args.get("conf", 0.25))
        conf_threshold = max(0.0, min(1.0, conf_threshold))
    except ValueError:
        conf_threshold = 0.25

    try:
        top_k = int(request.args.get("top_k", 0))
    except ValueError:
        top_k = 0

    # ── Read image via PIL (no temp file needed) ──────────────────────────────
    try:
        image = Image.open(io.BytesIO(image_file.read())).convert("RGB")
    except Exception:
        return jsonify({"error": "Could not decode image"}), 422

    # ── Run inference ─────────────────────────────────────────────────────────
    start = time.perf_counter()
    try:
        results = model(image, verbose=False)[0]
    except Exception as e:
        logger.error("Inference failed: %s", e)
        return jsonify({"error": "Model inference error"}), 500
    elapsed = round(time.perf_counter() - start, 3)

    # ── Process results ───────────────────────────────────────────────────────
    detections = parse_detections(results, conf_threshold)

    if top_k > 0:
        detections = detections[:top_k]

    avg_conf = (
        sum(d["confidence"] for d in detections) / len(detections)
        if detections else 0.0
    )

    grading = compute_grade(len(detections), avg_conf)

    label_summary = {}
    for d in detections:
        label_summary[d["label"]] = label_summary.get(d["label"], 0) + 1

    logger.info("File='%s' detections=%d grade=%s time=%.3fs",
                image_file.filename, len(detections), grading["grade"], elapsed)

    return jsonify({
        "filename": image_file.filename,
        "count": len(detections),
        "label_summary": label_summary,
        "avg_confidence": round(avg_conf, 4),
        "grade": grading["grade"],
        "score": grading["score"],
        "reason": grading["reason"],
        "detections": detections,
        "inference_time_sec": elapsed
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
```

**Key improvements over original:**

| Area | Before | After |
|---|---|---|
| **Temp file** | Saves to disk, manual cleanup | PIL reads directly from memory — no temp file |
| **Validation** | Only checks key presence | Checks mimetype, extension, file size |
| **Grading** | Count-only thresholds | Count + confidence scored 0–100 |
| **Detections** | Just count | Label, confidence, bbox per object |
| **Query params** | None | `?conf=0.3&top_k=5` supported |
| **Label summary** | None | `{"person": 2, "car": 1}` |
| **Timing** | None | `inference_time_sec` in response |
| **New endpoints** | `/health` only | `/classes` added |

**`requirements.txt`:**
```
flask
flask-cors
ultralytics
pillow
opencv-python-headless
