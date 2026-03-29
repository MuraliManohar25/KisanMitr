import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const YOLO_SERVICE_URL = process.env.YOLO_SERVICE_URL || 'http://localhost:8000';

export default {
  async detectObjects(imagePath, cropType) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      formData.append('crop_type', cropType);

      const response = await axios.post(`${YOLO_SERVICE_URL}/detect`, formData, {
        headers: formData.getHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('YOLO service error:', error.message);
      // Return mock data for development if YOLO service is unavailable
      return {
        totalCount: 10,
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          bbox: [100 + i * 50, 100 + i * 30, 50, 50],
          diameter: 65 + Math.random() * 20,
          colorProfile: {
            avgRGB: [200 + Math.random() * 55, 50 + Math.random() * 50, 50 + Math.random() * 50],
            dominantHue: 15 + Math.random() * 15
          }
        }))
      };
    }
  }
};

