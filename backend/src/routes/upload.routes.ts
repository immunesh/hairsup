import { Router } from "express";
console.log("UPLOAD ROUTES LOADED");
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// This URL is written into the database alongside the product, so it must be
// the public address of this server, not localhost.
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

router.post(
  "/image",
  upload.single("image"),
  (req, res) => {

    console.log("FILE RECEIVED =>", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.json({
      success: true,
      url: `${BACKEND_URL}/uploads/${req.file.filename}`,
    });
  }
);

export default router;