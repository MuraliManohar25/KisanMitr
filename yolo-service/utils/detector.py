# yolo-service/utils/detector.py

from ultralytics import YOLO
import cv2
import numpy as np
import os
import torch
import torch.nn as nn

# Fix for PyTorch 2.6+ weight loading - patch torch.load to allow YOLO models
_original_torch_load = torch.load
def patched_torch_load(*args, **kwargs):
    if 'weights_only' not in kwargs:
        kwargs['weights_only'] = False
    return _original_torch_load(*args, **kwargs)
torch.load = patched_torch_load

class YOLODetector:
    def __init__(self, model_path='yolov8n.pt'):
        """Initialize with detection model (not segmentation)"""
        self.model = YOLO(model_path)
        print(f"✅ Loaded YOLO model: {model_path}")
    
    def detect(self, image_path, crop_type):
        """Main detection method with all fixes"""
        
        # 1. Preprocess image
        preprocessed_path = self.preprocess_image(image_path)
        
        # 2. Run YOLO detection
        results = self.model.predict(
            source=preprocessed_path,
            conf=0.25,           # Confidence threshold
            iou=0.40,            # IoU for NMS
            imgsz=640,           # Image size
            max_det=300,         # Max detections
            agnostic_nms=True,   # Class-agnostic NMS
            verbose=False
        )
        
        # 3. Process results
        detections = self.process_results(results, image_path, crop_type)
        
        # 4. Filter overlapping boxes
        detections = self.filter_overlapping(detections)
        
        # 5. Filter by size (remove too small/large)
        detections = self.filter_by_size(detections)
        
        print(f"✅ Final count: {len(detections)} {crop_type}(s)")
        
        return {
            'totalCount': len(detections),
            'items': detections
        }
    
    def preprocess_image(self, image_path):
        """Enhance image for better detection"""
        img = cv2.imread(image_path)
        
        if img is None:
            print(f"❌ Failed to read image: {image_path}")
            return image_path
        
        # Increase contrast
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        enhanced = cv2.merge((cl, a, b))
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        # Make white background pure white
        hsv = cv2.cvtColor(enhanced, cv2.COLOR_BGR2HSV)
        lower_white = np.array([0, 0, 200])
        upper_white = np.array([180, 30, 255])
        mask = cv2.inRange(hsv, lower_white, upper_white)
        enhanced[mask > 0] = [255, 255, 255]
        
        preprocessed_path = image_path.replace('.jpg', '_prep.jpg')
        cv2.imwrite(preprocessed_path, enhanced)
        return preprocessed_path
    
    def process_results(self, results, image_path, crop_type):
        """Extract detections from YOLO results"""
        image = cv2.imread(image_path)
        detections = []
        
        if not results or len(results) == 0:
            print("⚠️ No results from YOLO")
            return []
        
        boxes = results[0].boxes
        if boxes is None or len(boxes) == 0:
            print("⚠️ No boxes detected")
            return []
        
        print(f"🔍 Raw detections: {len(boxes)}")
        
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
            confidence = float(box.conf[0])
            
            # Skip low confidence
            if confidence < 0.25:
                continue
            
            # Calculate dimensions
            width = x2 - x1
            height = y2 - y1
            diameter_px = (width + height) / 2
            diameter_mm = self.pixels_to_mm(diameter_px, image.shape[1])
            
            # Extract color
            roi = image[max(0, y1):min(image.shape[0], y2), 
                       max(0, x1):min(image.shape[1], x2)]
            color_profile = self.extract_color(roi)
            
            detections.append({
                'id': i + 1,
                'bbox': [x1, y1, width, height],
                'diameter': round(diameter_mm, 1),
                'confidence': round(confidence, 2),
                'colorProfile': color_profile
            })
        
        return detections
    
    def filter_overlapping(self, detections, iou_threshold=0.3):
        """Remove overlapping detections (Non-Max Suppression)"""
        if len(detections) <= 1:
            return detections
        
        boxes = np.array([d['bbox'] for d in detections])
        scores = np.array([d['confidence'] for d in detections])
        
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 0] + boxes[:, 2]
        y2 = boxes[:, 1] + boxes[:, 3]
        
        areas = boxes[:, 2] * boxes[:, 3]
        order = scores.argsort()[::-1]
        
        keep = []
        while order.size > 0:
            i = order[0]
            keep.append(i)
            
            xx1 = np.maximum(x1[i], x1[order[1:]])
            yy1 = np.maximum(y1[i], y1[order[1:]])
            xx2 = np.minimum(x2[i], x2[order[1:]])
            yy2 = np.minimum(y2[i], y2[order[1:]])
            
            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            
            intersection = w * h
            iou = intersection / (areas[i] + areas[order[1:]] - intersection + 1e-6)
            
            inds = np.where(iou <= iou_threshold)[0]
            order = order[inds + 1]
        
        filtered = [detections[i] for i in keep]
        print(f"📊 After overlap removal: {len(detections)} → {len(filtered)}")
        return filtered
    
    def filter_by_size(self, detections, min_diameter=20, max_diameter=200):
        """Remove unrealistic sizes"""
        filtered = [d for d in detections 
                   if min_diameter <= d['diameter'] <= max_diameter]
        
        if len(filtered) != len(detections):
            print(f"📏 After size filter: {len(detections)} → {len(filtered)}")
        return filtered
    
    def pixels_to_mm(self, pixels, image_width, reference_width_mm=210):
        """Convert pixels to mm (A4 sheet = 210mm)"""
        return (pixels / image_width) * reference_width_mm
    
    def extract_color(self, roi):
        """Extract color from region"""
        if roi.size == 0 or roi.shape[0] == 0 or roi.shape[1] == 0:
            return {'avgRGB': [0, 0, 0], 'dominantHue': 0}
        
        # Average BGR → RGB
        avg_bgr = roi.mean(axis=(0, 1))
        avg_rgb = [int(avg_bgr[2]), int(avg_bgr[1]), int(avg_bgr[0])]
        
        # Dominant hue
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        hue_values = hsv[:, :, 0][hsv[:, :, 1] > 30]  # Ignore low saturation
        
        if len(hue_values) > 0:
            dominant_hue = int(np.median(hue_values) * 2)  # 0-360 range
        else:
            dominant_hue = 0
        
        return {
            'avgRGB': avg_rgb,
            'dominantHue': dominant_hue
        }