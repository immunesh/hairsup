import { Request, Response } from "express";

// This URL is written into the database alongside the product, so it must be
// the public address of this server, not localhost.
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    res.status(200).json({
      success: true,
      filename: req.file.filename,
      url: `${BACKEND_URL}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};