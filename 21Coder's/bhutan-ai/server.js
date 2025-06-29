import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create recordings directory if it doesn't exist
    const recordingsDir = path.join(__dirname, 'recordings');
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }
    cb(null, recordingsDir);
  },
  filename: function (req, file, cb) {
    // Generate timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `recording_${timestamp}.webm`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Serve static files from recordings directory
app.use('/recordings', express.static(path.join(__dirname, 'recordings')));

// Endpoint to save recording locally
app.post('/api/save-recording', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      url: `/recordings/${req.file.filename}`,
      timestamp: new Date().toISOString()
    };

    console.log('Recording saved:', fileInfo);
    
    res.json({
      success: true,
      message: 'Recording saved successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Error saving recording:', error);
    res.status(500).json({ error: 'Failed to save recording' });
  }
});

// Endpoint to get all recordings
app.get('/api/recordings', (req, res) => {
  try {
    const recordingsDir = path.join(__dirname, 'recordings');
    if (!fs.existsSync(recordingsDir)) {
      return res.json({ recordings: [] });
    }

    const files = fs.readdirSync(recordingsDir);
    const recordings = files
      .filter(file => file.endsWith('.webm'))
      .map(file => {
        const filePath = path.join(recordingsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          url: `/recordings/${file}`,
          timestamp: stats.mtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ recordings });
  } catch (error) {
    console.error('Error getting recordings:', error);
    res.status(500).json({ error: 'Failed to get recordings' });
  }
});

// Endpoint to delete a recording
app.delete('/api/recordings/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'recordings', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Recording deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (error) {
    console.error('Error deleting recording:', error);
    res.status(500).json({ error: 'Failed to delete recording' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Recordings directory: ${path.join(__dirname, 'recordings')}`);
}); 