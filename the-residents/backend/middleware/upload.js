import multer from 'multer';
import { mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// Directory to store KYC uploads
const uploadDir = resolve('uploads/kyc');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${unique}.${ext}`);
  },
});

export const kycUpload = multer({ storage });
