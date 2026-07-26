import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  isCloudinaryConfigured,
  uploadImageBuffer,
} from "../lib/cloudinary";

const router = Router();

// Only used by the local-disk fallback below. The URL is written into the
// database alongside the product, so it must be the public address of this
// server rather than localhost.
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

const uploadDir = "uploads";

// With Cloudinary the file never touches this disk, so keep it in memory.
// Without it (local dev only — production refuses to start unconfigured)
// fall back to the previous on-disk behaviour.
const storage = isCloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },

      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed"));
  },
});

router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!isCloudinaryConfigured) {
      return res.json({
        success: true,
        url: `${BACKEND_URL}/uploads/${req.file.filename}`,
      });
    }

    try {
      const url = await uploadImageBuffer(req.file.buffer);

      return res.json({ success: true, url });
    } catch (error) {
      console.error("Cloudinary upload failed:", error);

      return res.status(502).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

// multer signals an oversized file or a rejected type by throwing, which would
// otherwise reach the global handler and be reported as a 500. These are the
// caller's mistake, not the server's.
router.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Image must be 10MB or smaller"
            : err.message,
      });
    }

    if (
      err instanceof Error &&
      err.message === "Only image uploads are allowed"
    ) {
      return res.status(400).json({ success: false, message: err.message });
    }

    return next(err);
  }
);

export default router;
