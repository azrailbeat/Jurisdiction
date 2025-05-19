import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadService } from '../services/uploadService';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure file filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept PDF, DOCX, HTML, and XML files
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html',
    'application/xml',
    'text/xml'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, HTML, and XML files are allowed.'));
  }
};

// Create multer upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  }
});

export function registerDocumentUploadRoutes(router: Router) {
  router.post('/documents/upload', upload.single('file'), async (req, res) => {
    try {
      // Ensure a file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded'
        });
      }
      
      // For now, using a hardcoded user ID until authentication is implemented
      const userId = 1; // In a real system, this would come from the authenticated user
      
      // Process the document
      const document = await uploadService.processDocument(req.file, userId);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Document uploaded and processed successfully',
        document: document
      });
    } catch (error: any) {
      console.error('Document upload error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while processing the document'
      });
    }
  });
}