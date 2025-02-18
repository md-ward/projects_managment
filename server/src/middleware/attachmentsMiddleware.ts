import multer, { diskStorage } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

// Configure storage for uploaded files
const storage = diskStorage({
  destination: (req, file, cb) => {
    // Extract file extension without the dot (e.g., 'txt' from '.txt')
    const fileExtension = path.extname(file.originalname).slice(1) || "unknown";

    // Define the folder path
    const uploadPath = path.join(__dirname, `../public/${fileExtension}`);

    // Ensure the directory exists, create it if not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Set the upload destination folder dynamically
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with a unique name
  },
});

// Configure file filter to allow all file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  cb(null, true); // Accept all file types
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

// Middleware to handle attachments
const attachmentUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.any()(req, res, (err) => {
    console.log("test", req.body);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Construct URLs for uploaded files
    if (req.files && Array.isArray(req.files)) {
      const protocol = req.protocol;
      const host = req.get("host");

      req.body.filesURLs = req.files.map((file) => {
        const fileExtension =
          path.extname(file.originalname).slice(1) || "unknown";
        return new URL(
          `${protocol}://${host}/public/${fileExtension}/${file.filename}`
        ).href;
      });
    }

    next();
  });
};

export default attachmentUploadMiddleware;
