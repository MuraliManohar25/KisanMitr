# Demo Certificate Guide

## 🎫 Create Temporary Demo Certificate

To create a demo certificate for demonstration purposes:

```powershell
cd backend
npm run create-demo-cert
```

This will create a certificate with:
- **Crop Type:** Apple
- **Overall Grade:** A
- **Total Items:** 45
- **Grade Distribution:** A: 30, B: 12, C: 3
- **Farmer:** Demo Farmer

## 📋 View Certificate

After creating, you'll get a URL like:
```
http://localhost:3000/certificate/FTC-2026-DEMO-XXXXX
```

Open this URL in your browser to view the certificate.

## 📝 List All Certificates

To see all certificates:

```powershell
cd backend
npm run list-certs
```

## 🗑️ Delete Demo Certificate

To delete a specific certificate:

```powershell
cd backend
node scripts/deleteDemoCertificate.js <analysisId>
```

Example:
```powershell
node scripts/deleteDemoCertificate.js FTC-2026-DEMO-ABC123
```

## 🔄 Quick Demo Workflow

1. **Create certificate:**
   ```powershell
   cd backend
   npm run create-demo-cert
   ```

2. **Copy the Analysis ID from output**

3. **Open in browser:**
   ```
   http://localhost:3000/certificate/<analysisId>
   ```

4. **After demonstration, delete it:**
   ```powershell
   node scripts/deleteDemoCertificate.js <analysisId>
   ```

## 📸 Certificate Features

The demo certificate includes:
- Professional layout
- QR code for verification
- Grade breakdown
- Certificate hash
- Download as PDF option
- All visual elements

## ⚠️ Note

- Demo certificates are stored in MongoDB
- They will persist until deleted
- You can create multiple demo certificates
- Each has a unique Analysis ID

