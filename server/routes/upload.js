const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const os = require('os');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup multer for temporary local storage before uploading to Cloudinary
const tempDir = path.join(os.tmpdir(), 'primepets_uploads');
if (!fs.existsSync(tempDir)){
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit to handle videos
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Determine resource type automatically (image or video)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto', 
      folder: 'primepets_media'
    });

    // Cleanup local temp file
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url, type: result.resource_type });
  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
  }
});

module.exports = router;
