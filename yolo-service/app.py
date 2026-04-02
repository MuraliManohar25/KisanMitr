import os
import math
import logging
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

HF_SPACE_URL = os.environ.get(
    "HF_SPACE_URL",
    "https://muralimanohar25-kisanmitr.hf.space"
)
HF_SPACE_DETECT_ENDPOINT = f"{HF_SPACE_URL}/detect"

MAX_FILE_SIZE_MB = 10
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "bmp"}
ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}

# Timeout for calls to the HF Space (seconds): 30s connect, 120s read
HF_TIMEOUT = (30, 120)


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


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "YOLO API is running", "backend": "huggingface-space"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "backend": "huggingface-space"})


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

    # ── Forward image to HF Space ─────────────────────────────────────────────
    start = time.perf_counter()
    try:
        hf_response = requests.post(
            HF_SPACE_DETECT_ENDPOINT,
            files={"image": (image_file.filename, image_file.read(), image_file.mimetype)},
            params={"conf": conf_threshold, "top_k": top_k},
            timeout=HF_TIMEOUT,
        )
        hf_response.raise_for_status()
    except requests.exceptions.Timeout:
        logger.error("HF Space request timed out")
        return jsonify({"error": "Detection service timed out"}), 504
    except requests.exceptions.RequestException as e:
        logger.error("HF Space request failed: %s", e)
        return jsonify({"error": "Detection service unavailable"}), 502
    elapsed = round(time.perf_counter() - start, 3)

    # ── Parse HF Space response ───────────────────────────────────────────────
    try:
        hf_data = hf_response.json()
    except Exception:
        logger.error("HF Space returned non-JSON response")
        return jsonify({"error": "Invalid response from detection service"}), 502

    # If the HF Space already returns the full structured payload, pass it
    # through directly (adding elapsed time). If it returns a raw detections
    # list we normalise it into the same envelope the backend expects.
    if "detections" in hf_data:
        detections = hf_data["detections"]

        if top_k > 0:
            detections = detections[:top_k]

        avg_conf = (
            sum(d.get("confidence", 0) for d in detections) / len(detections)
            if detections else 0.0
        )

        grading = compute_grade(len(detections), avg_conf)

        label_summary = {}
        for d in detections:
            lbl = d.get("label", "unknown")
            label_summary[lbl] = label_summary.get(lbl, 0) + 1

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
            "inference_time_sec": elapsed,
        })

    # HF Space returned an unexpected shape — forward it as-is so the caller
    # can inspect it, but still attach our timing field.
    hf_data.setdefault("filename", image_file.filename)
    hf_data["inference_time_sec"] = elapsed
    return jsonify(hf_data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
