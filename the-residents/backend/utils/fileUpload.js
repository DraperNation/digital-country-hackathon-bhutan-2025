const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and Word documents are allowed.'), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Max 5 files
  },
});

// Middleware to handle file uploads
const uploadFiles = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Error uploading file(s)' 
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Error uploading file(s)' 
        });
      }
      
      // Files were uploaded successfully
      next();
    });
  };
};

// Middleware to handle single file upload
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Error uploading file' 
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Error uploading file' 
        });
      }
      
      // File was uploaded successfully
      next();
    });
  };
};

// Function to delete a file
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', filePath);
    
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

// Function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    name: file.originalname,
    url: `/uploads/${file.filename}`,
    type: file.mimetype,
    size: file.size,
    path: file.path,
  };
};

module.exports = {
  upload,
  uploadFiles,
  uploadSingleFile,
  deleteFile,
  getFileInfo,
};
