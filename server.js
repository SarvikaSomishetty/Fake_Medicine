const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// OCR endpoint
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Here you would integrate with trOCR
    // For now, we'll return a mock response
    res.json({
      text: "Sample medicine text",
      confidence: 0.95
    });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Image analysis endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Here you would integrate with your image analysis model
    // For now, we'll return a mock response
    res.json({
      quality_score: 0.9,
      text_clarity: 0.85,
      logo_detection: 0.95,
      color_consistency: 0.88,
      print_quality: 0.92,
      security_features: 0.87,
      overall_score: 0.89
    });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Image Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 