import requests
import os
import time

def test_detection():
    url = 'http://localhost:8000/detect'
    image_path = 'test_image.jpg'
    
    # Create a dummy image if it doesn't exist
    if not os.path.exists(image_path):
        import numpy as np
        import cv2
        dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
        cv2.imwrite(image_path, dummy_img)
    
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'crop_type': 'apple'}
        try:
            response = requests.post(url, files=files, data=data)
            print("Response:", response.status_code)
            print(response.json())
        except Exception as e:
            print("Error:", e)

if __name__ == '__main__':
    # You need to start the app first: python yolo-service/app.py
    print("Please make sure the YOLO service is running.")
    test_detection()
