import multer, { diskStorage } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";

// Configure storage for uploaded files
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path.dirname(__dirname)}/public/images`); // Set the upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save file with a unique name
  },
});

// Configure file filter to accept only JPEG and PNG files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG and PNG files are allowed!")); // Reject the file
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

// Middleware to handle image upload
const imageUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ message: err.message });
    }

    // Log file info (useful for debugging)
    if (req.file) {
      req.body.image = req.file.filename;
    }

    next(); // Pass control to the next middleware or route handler
  });
};

export default imageUploadMiddleware;
