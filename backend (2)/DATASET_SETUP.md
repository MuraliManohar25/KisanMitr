# Dataset Setup & Image Comparison Guide

## 📦 Dataset Structure

Your dataset should be organized like this:

```
dataset/
├── apple/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── tomato/
│   ├── image1.jpg
│   └── ...
├── orange/
│   └── ...
└── mango/
    └── ...
```

## 🚀 Setup Steps

### 1. Configure MongoDB Atlas

First, set up your MongoDB Atlas connection:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fair-trade-scanner?retryWrites=true&w=majority
   ```

### 2. Import Your Dataset

Place your dataset folder in the project root, or specify the path:

```powershell
cd backend
npm run import-dataset
```

Or specify custom path:
```powershell
node scripts/importDataset.js "C:\path\to\your\dataset"
```

### 3. Verify Import

Check imported images:
```powershell
# Connect to MongoDB and check
mongosh "YOUR_CONNECTION_STRING"
use fair-trade-scanner
db.trainingimages.countDocuments()
db.trainingimages.aggregate([{$group: {_id: "$cropType", count: {$sum: 1}}}])
```

## 🔍 How Image Comparison Works

### Current Implementation

1. **When you upload an image:**
   - Image is analyzed by YOLO
   - System finds similar images from your training dataset
   - Returns reference images for comparison

2. **Comparison Features:**
   - Finds images of the same crop type
   - Returns sample images from training set
   - Can be extended with:
     - Feature extraction (SIFT, ORB)
     - Deep learning embeddings
     - Color histogram comparison
     - Size/shape analysis

### Future Enhancements

You can enhance comparison by:
- Adding feature extraction algorithms
- Using pre-trained models for similarity
- Implementing histogram comparison
- Adding shape/size matching

## 📊 Dataset Statistics

After import, you can check:
- Total images per crop type
- Image metadata
- Labels and annotations

## 🔧 Troubleshooting

### Dataset Not Found
- Check the path is correct
- Ensure folder structure matches: `dataset/crop-type/image.jpg`
- Verify image formats (jpg, png, etc.)

### Import Errors
- Check MongoDB connection
- Verify image files are readable
- Check file permissions

### No Similar Images Found
- Ensure dataset was imported successfully
- Check crop type matches
- Verify training images exist in database

## 💡 Usage Example

1. Import dataset:
   ```powershell
   cd backend
   npm run import-dataset "C:\Users\YourName\Downloads\crop-dataset"
   ```

2. Upload image via frontend

3. System will:
   - Analyze image with YOLO
   - Find similar images from dataset
   - Show comparison results

## 📝 Notes

- Images are stored as base64 in MongoDB (for small datasets)
- For large datasets, consider storing images in cloud storage (S3, etc.)
- Training images can be annotated with labels for better matching
- Comparison algorithm can be customized in `backend/services/imageComparison.js`

