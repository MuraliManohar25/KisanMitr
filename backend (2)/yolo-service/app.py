import os
os.environ['TORCH_ALLOW_UNSAFE_LOAD'] = '1'

from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.detector import YOLODetector
import sys

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app)

# Initialize detector
detector = YOLODetector('yolov8n.pt')

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    crop_type = request.form.get('crop_type', 'apple')
    
    if image_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save temp file (use temp directory based on OS)
    import tempfile
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, image_file.filename)
    image_file.save(temp_path)
    
    # Track the preprocessed path for cleanup
    preprocessed_path = temp_path.replace('.jpg', '_prep.jpg')
    
    try:
        # Run detection
        results = detector.detect(temp_path, crop_type)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup original temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        # Cleanup preprocessed file if it exists
        if os.path.exists(preprocessed_path):
            os.remove(preprocessed_path)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'YOLOv8n-detection'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

