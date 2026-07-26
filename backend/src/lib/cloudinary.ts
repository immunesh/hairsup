import { v2 as cloudinary } from "cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

// .env.example ships placeholder values, so a half-filled env is common. Treat
// a placeholder exactly like an empty value rather than letting it through and
// failing later at upload time.
const PLACEHOLDERS = new Set([
  "your_cloud_name",
  "your_api_key",
  "your_api_secret",
]);

const isSet = (value?: string): boolean =>
  !!value && !PLACEHOLDERS.has(value);

export const isCloudinaryConfigured =
  isSet(CLOUDINARY_CLOUD_NAME) &&
  isSet(CLOUDINARY_API_KEY) &&
  isSet(CLOUDINARY_API_SECRET);

// Refuse to boot in production without it. Both Render and Vercel give the app
// an ephemeral filesystem, so falling back to local disk there would accept
// uploads, write image URLs into the database, and then lose the files on the
// next restart — leaving broken images with no obvious cause.
if (process.env.NODE_ENV === "production" && !isCloudinaryConfigured) {
  throw new Error(
    "Cloudinary is not configured, but uploads in production must not go to " +
      "local disk — the filesystem is ephemeral and files would be lost on the " +
      "next restart. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and " +
      "CLOUDINARY_API_SECRET."
  );
}

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads an in-memory image buffer and resolves to its permanent HTTPS URL.
 */
export function uploadImageBuffer(
  buffer: Buffer,
  folder = "hairsup"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export default cloudinary;
