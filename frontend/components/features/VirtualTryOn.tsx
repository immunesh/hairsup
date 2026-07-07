'use client';
import {
  getFaceLandmarker,
  getImageFaceLandmarker,
} from "@/lib/faceMesh";
import { drawWig } from '@/lib/wigRenderer';
 
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, CameraOff, RefreshCw, Download, Zap, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { FaceLandmarker } from "@mediapipe/tasks-vision";
interface VirtualTryOnProps {
  products?: Product[];
  selectedProduct?: Product;
  selectedProductId?: string;
}
function getNearestAngle(
  headAngle: number
) {
  const angles = [
    0,
    45,
    90,
    135,
    180,
    225,
    270,
    315,
  ];

  let nearest = angles[0];

  let minDiff = Infinity;

  angles.forEach((a) => {
    const diff = Math.abs(
      headAngle - a
    );

    if (diff < minDiff) {
      minDiff = diff;
      nearest = a;
    }
  });

  return nearest;
}
 
export default function VirtualTryOn({
  products = [],
  selectedProduct,
  selectedProductId,
}: VirtualTryOnProps)
 {
  const router = useRouter();
  const [showNoProductModal, setShowNoProductModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadCanvasRef =
  useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

const [imageSrc, setImageSrc] = useState("");
const faceLandmarkerRef =
  useRef<FaceLandmarker | null>(null);
const wigImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
 
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
 const faceDetectedRef =
  useRef(false);

const [faceDetected, setFaceDetected] =
  useState(false);
 
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] =
  useState(false);

const [cropImage, setCropImage] =
  useState<string | null>(null);

const [crop, setCrop] =
  useState({ x: 0, y: 0 });

const [zoom, setZoom] =
  useState(1);

const [croppedAreaPixels,
  setCroppedAreaPixels] =
  useState<any>(null);

  const displayProducts = products.length > 0 ? products : [];
  const activeProduct = selectedProduct || displayProducts[selectedProductIdx];

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        
faceLandmarkerRef.current =
  await getFaceLandmarker();

setCameraActive(true);

startRendering();
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else {
        setCameraError('Could not start camera. Please try again.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setCameraActive(false);
    faceDetectedRef.current = false;
setFaceDetected(false);
  }, []);

  const startRendering = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    

     const render = async () => {
  if (
    !videoRef.current ||
    videoRef.current.readyState < 2
  ) {
    animFrameRef.current =
      requestAnimationFrame(render);

    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.save();

  ctx.translate(canvas.width, 0);

  ctx.scale(-1, 1);

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.restore();
const detector =
  await getFaceLandmarker();

const result =
  detector.detectForVideo(
    video,
    performance.now()
  );

  if (
    result.faceLandmarks &&
    result.faceLandmarks.length > 0
  ) {
   if (!faceDetectedRef.current) {
  faceDetectedRef.current = true;
  setFaceDetected(true);
}

    const landmarks =
      result.faceLandmarks[0];

    const forehead = landmarks[151];

    const leftTemple = landmarks[234];

    const rightTemple = landmarks[454];
 

    

      const chin = landmarks[152];

const faceWidth =
  Math.abs(rightTemple.x - leftTemple.x) *
  canvas.width;

const faceHeight =
  Math.abs(chin.y - forehead.y) *
  canvas.height;

const foreheadX =
  forehead.x * canvas.width;

const foreheadY =
  forehead.y * canvas.height;
 
    const angle = Math.atan2(
      rightTemple.y -
        leftTemple.y,
      rightTemple.x -
        leftTemple.x
    );

 const degrees =
  Math.round(
    (angle * 180) / Math.PI
  );

const nearestAngle =
  getNearestAngle(
    Math.abs(degrees)
  );

const wigImage =
  wigImagesRef.current[
    String(nearestAngle)
  ];
  console.log({
  degrees,
  nearestAngle,
});


      if (wigImage && wigImage.complete) {
ctx.beginPath();
ctx.arc(
  foreheadX,
  foreheadY,
  6,
  0,
  Math.PI * 2
);
 
        drawWig(
  ctx,
  wigImage,
  foreheadX,
  foreheadY,
  faceWidth,
  faceHeight,
  angle
);
}
  } else {
    if (faceDetectedRef.current) {
  faceDetectedRef.current = false;
  setFaceDetected(false);
}
  }

  animFrameRef.current =
    requestAnimationFrame(render);
};

    animFrameRef.current = requestAnimationFrame(render);
}, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
  if (!uploadedImage) return;

  const processImage = async () => {
    const canvas =
      uploadCanvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const img =
      new window.Image();

    img.src = uploadedImage;

    img.onload = async () => {
    const maxWidth = 900;
const maxHeight = 600;

let width = img.width;
let height = img.height;

if (width > maxWidth) {
  height = (height * maxWidth) / width;
  width = maxWidth;
}

if (height > maxHeight) {
  width = (width * maxHeight) / height;
  height = maxHeight;
}

canvas.width = width;
canvas.height = height;

   ctx.clearRect(
  0,
  0,
  canvas.width,
  canvas.height
);

ctx.drawImage(
  img,
  0,
  0,
  width,
  height
);

   
const detector =
  await getImageFaceLandmarker();

const result =
  detector.detect(img);


      if (
        !result.faceLandmarks ||
        result.faceLandmarks.length === 0
      ) {
        return;
      }

      const landmarks =
        result.faceLandmarks[0];

      const forehead =
        landmarks[151];

      const leftTemple =
        landmarks[234];

      const rightTemple =
        landmarks[454];
const chin = landmarks[152];

const faceWidth =
  Math.abs(rightTemple.x - leftTemple.x) *
  canvas.width;

const faceHeight =
  Math.abs(chin.y - forehead.y) *
  canvas.height;

const foreheadX =
  forehead.x * canvas.width;

const foreheadY =
  forehead.y * canvas.height;
      const angle =
        Math.atan2(
          rightTemple.y -
            leftTemple.y,
          rightTemple.x -
            leftTemple.x
        );

      const degrees =
        Math.round(
          (angle * 180) /
            Math.PI
        );

      const nearestAngle =
        getNearestAngle(
          Math.abs(degrees)
        );

  const wigImage =
  wigImagesRef.current[
    String(nearestAngle)
  ];
      if (
        wigImage &&
        wigImage.complete
      ) {
drawWig(
  ctx,
  wigImage,
  foreheadX,
  foreheadY,
  faceWidth,
  faceHeight,
  angle
);
      }
    };
  };

  processImage();
}, [uploadedImage]);

  useEffect(() => {
  if (!selectedProductId) return;

  const loadProductImages = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${selectedProductId}`
      );

      const data = await res.json();

      console.log("PRODUCT DATA", data);

      const images = data.data.images || [];

      setProductImages(
        images.map((img: any) => img.url)
      );

      const loadedImages: Record<
        string,
        HTMLImageElement
      > = {};

images.forEach(
  (img: any, index: number) => {
    const image = new window.Image();

    image.src = img.url;

 loadedImages[
  String(img.angle)
] = image;
  }
);
console.log(wigImagesRef.current);
      wigImagesRef.current =
        loadedImages;

      console.log(
        "Loaded Images",
        loadedImages
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadProductImages();
}, [selectedProductId]);
  


  const capturePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const downloadCapture = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `hairsup-tryon-${Date.now()}.jpg`;
    a.click();
  };

 const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    setCropImage(
      ev.target?.result as string
    );

    setShowCropper(true);
  };

  reader.readAsDataURL(file);
};

  const [productImages, setProductImages] = useState<string[]>([]);

  
const onCropComplete = (
  croppedArea: any,
  croppedAreaPixelsValue: any
) => {
  setCroppedAreaPixels(
    croppedAreaPixelsValue
  );
};
const applyCrop = async () => {
  if (
    !cropImage ||
    !croppedAreaPixels
  )
    return;

  const cropped =
    await getCroppedImg(
      cropImage,
      croppedAreaPixels
    );

  if (!cropped) return;

  setUploadedImage(cropped);

  setShowCropper(false);

  setMode("upload");
};

  return (
    <>
    {/* No-product modal (triggered by Start Camera / Choose Photo) */}
    {showNoProductModal && (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Zap className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
            Please choose a product to try on
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Browse our collection and tap &quot;Try On&quot; on any product to see how it looks on you.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="btn-primary w-full"
          >
            Shop Now
          </button>
        </div>
      </div>
    )}
    {
showCropper &&
(
<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">

  <div className="bg-white rounded-xl p-4 w-[600px]">

    <div className="relative h-[400px]">

      <Cropper
        image={cropImage || ""}
        crop={crop}
        zoom={zoom}
      aspect={4 / 5}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />

    </div>

    <div className="mt-4 flex justify-end gap-2">

      <button
        onClick={() =>
          setShowCropper(false)
        }
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>

      <button
        onClick={applyCrop}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Apply
      </button>

    </div>

  </div>

</div>
)
}
        <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera / Preview panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setMode('camera'); setCapturedImage(null); }}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                mode === 'camera' ? 'bg-white shadow text-brand-600' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Live Camera
            </button>
            <button
              onClick={() => { setMode('upload'); stopCamera(); }}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                mode === 'upload' ? 'bg-white shadow text-brand-600' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Upload Photo
            </button>
          </div>

          {/* Main view */}
          <div className="relative bg-gray-950 rounded-2xl overflow-hidden aspect-video">
            {/* Hidden video element */}
            <video ref={videoRef} className="hidden" playsInline muted autoPlay />

            {mode === 'camera' && !capturedImage && (
              <>
                <canvas
                  ref={canvasRef}
                  className={cn('w-full h-full object-cover', !cameraActive && 'hidden')}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-6">
                    <div className="w-20 h-20 bg-brand-600/20 rounded-full flex items-center justify-center border-2 border-brand-500/30">
                      <Camera className="w-10 h-10 text-brand-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Virtual Try-On</h3>
                      <p className="text-gray-400 text-sm max-w-xs">
                        See how any HairsUp wig looks on you — in real time using your camera.
                      </p>
                    </div>
                    {cameraError && (
                      <div className="flex items-start gap-2 bg-red-900/50 border border-red-500/30 rounded-xl p-3 max-w-xs text-left">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300">{cameraError}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (!selectedProductId) { setShowNoProductModal(true); return; }
                        startCamera();
                      }}
                      className="btn-primary flex items-center gap-2 py-3 px-8"
                    >
                      <Camera className="w-5 h-5" /> Start Camera
                    </button>
                  </div>
                )}
              </> 
            )}

            {mode === 'upload' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {uploadedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
  <img
    src={uploadedImage}
    alt="Uploaded"
    className="hidden"
    id="upload-preview"
  />

<canvas
  ref={uploadCanvasRef}
  className="w-full h-full object-contain"
/>

  <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
    Wig applied ✓
  </div>

</div>
                ) : !selectedProductId ? (
                    <div
                      className="flex flex-col items-center gap-4 cursor-pointer text-white"
                      onClick={() => setShowNoProductModal(true)}
                    >
                      <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-brand-500/50">
                        <Camera className="w-8 h-8 text-brand-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold mb-1">Upload your photo</p>
                        <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                      </div>
                      <span className="btn-primary py-2.5 px-6">Choose Photo</span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-4 cursor-pointer text-white">
                      <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center border-2 border-dashed border-brand-500/50">
                        <Camera className="w-8 h-8 text-brand-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold mb-1">Upload your photo</p>
                        <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      <span className="btn-primary py-2.5 px-6">Choose Photo</span>
                    </label>
                  )}
              </div>
            )}

            {capturedImage && (
              <div className="absolute inset-0">
                <Image src={capturedImage} alt="Captured" fill className="object-cover" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={downloadCapture}
                    className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl transition-colors shadow"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl transition-colors shadow"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Face detection indicator */}
            {cameraActive && faceDetected && !capturedImage && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Tracking
              </div>
            )}
          </div>

          {/* Camera controls */}
          {mode === 'camera' && cameraActive && !capturedImage && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={capturePhoto}
                className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-glow transition-all flex items-center justify-center"
              >
                <Camera className="w-6 h-6" />
              </button>
              <button
                onClick={stopCamera}
                className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all flex items-center justify-center"
              >
                <CameraOff className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Controls panel */}
        <div className="space-y-5">
          {/* Wig style selector */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" /> Style & Color
            </h3>
            <div className="space-y-2">
               {selectedProduct && (
  <div className="border rounded-xl p-3">
    <img
      src={selectedProduct.images?.[0]?.url}
      alt={selectedProduct.name}
      className="w-full h-40 object-cover rounded-lg"
    />

    <h4 className="mt-3 font-semibold">
      {selectedProduct.name}
    </h4>

    <p className="text-sm text-gray-500">
      ₹{selectedProduct.salePrice || selectedProduct.basePrice}
    </p>
  </div>
)}
            </div>
          </div>

          {/* Product selection */}
          {displayProducts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Try These Wigs</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProductIdx(Math.max(0, selectedProductIdx - 1))}
                  disabled={selectedProductIdx === 0}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  {activeProduct && (
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {activeProduct.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedProductIdx + 1} of {displayProducts.length}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProductIdx(Math.min(displayProducts.length - 1, selectedProductIdx + 1))}
                  disabled={selectedProductIdx === displayProducts.length - 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
  <h4
    className="font-semibold text-brand-800 mb-3"
    style={{ fontSize: "18px" }}
  >
    Tips for best results
  </h4>

  <ul
    className="space-y-2 text-brand-700"
    style={{ fontSize: "16px", lineHeight: "1.6" }}
  >
    <li className="flex items-start gap-2">
      <span>•</span>
      Find good, even lighting
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      Look directly at the camera
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      Keep your hair pulled back
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      Stay within 1–2 feet of camera
    </li>
  </ul>
</div>

          {/* Actions */}
          {capturedImage && (
            <button onClick={downloadCapture} className="btn-primary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Photo
            </button>
          )}
          {(uploadedImage || capturedImage) && (
            <button
              onClick={() => { setUploadedImage(null); setCapturedImage(null); }}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Another
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
