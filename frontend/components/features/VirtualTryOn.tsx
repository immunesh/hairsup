'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Camera, CameraOff, RefreshCw, Download, Zap, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface VirtualTryOnProps {
  products?: Product[];
  selectedProduct?: Product;
}

const WIG_OVERLAYS = [
  { id: '1', name: 'Straight Black', color: '#1a1a1a', style: 'straight' },
  { id: '2', name: 'Wavy Brown', color: '#4a2c0a', style: 'wavy' },
  { id: '3', name: 'Curly Auburn', color: '#8B2500', style: 'curly' },
  { id: '4', name: 'Blonde Straight', color: '#c8a96e', style: 'straight' },
  { id: '5', name: 'Dark Ombre', color: '#2d1b0e', style: 'wavy' },
];

export default function VirtualTryOn({ products = [], selectedProduct }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState(0);
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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
    setFaceDetected(false);
  }, []);

  const startRendering = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      frameCount++;
      if (frameCount % 30 === 0) setFaceDetected(Math.random() > 0.3);

      if (faceDetected) {
        const cw = canvas.width;
        const ch = canvas.height;

        // Simulate wig overlay in center of frame
        const wigColor = WIG_OVERLAYS[selectedOverlay].color;
        const wigStyle = WIG_OVERLAYS[selectedOverlay].style;

        ctx.save();
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = wigColor;

        // Head top arc
        ctx.beginPath();
        if (wigStyle === 'straight') {
          ctx.ellipse(cw / 2, ch * 0.22, cw * 0.18, ch * 0.18, 0, Math.PI, 0);
          ctx.fillRect(cw * 0.32, ch * 0.22, cw * 0.36, ch * 0.25);
        } else if (wigStyle === 'wavy') {
          ctx.ellipse(cw / 2, ch * 0.2, cw * 0.2, ch * 0.2, 0, Math.PI, 0);
          // Wavy sides
          for (let y = ch * 0.22; y < ch * 0.55; y += 12) {
            ctx.beginPath();
            ctx.arc(cw * 0.32 - Math.sin(y * 0.1) * 8, y, cw * 0.04, 0, Math.PI * 2);
            ctx.arc(cw * 0.68 + Math.sin(y * 0.1) * 8, y, cw * 0.04, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Curly
          ctx.ellipse(cw / 2, ch * 0.18, cw * 0.22, ch * 0.22, 0, Math.PI, 0);
          for (let y = ch * 0.2; y < ch * 0.6; y += 8) {
            for (let x = cw * 0.28; x < cw * 0.72; x += 12) {
              ctx.beginPath();
              ctx.arc(x + Math.sin(y) * 4, y, 6, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.fill();
        ctx.restore();

        // Detected badge
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.roundRect(12, 12, 120, 28, 8);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Face Detected ✓', 20, 30);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
  }, [faceDetected, selectedOverlay]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setMode('upload');
  };

  return (
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
                    <button onClick={startCamera} className="btn-primary flex items-center gap-2 py-3 px-8">
                      <Camera className="w-5 h-5" /> Start Camera
                    </button>
                  </div>
                )}
              </>
            )}

            {mode === 'upload' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {uploadedImage ? (
                  <div className="relative w-full h-full">
                    <Image src={uploadedImage} alt="Uploaded photo" fill className="object-cover" />
                    {/* Simulated wig overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-32 h-40 rounded-t-full opacity-70"
                        style={{ background: WIG_OVERLAYS[selectedOverlay].color }}
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Wig applied ✓
                    </div>
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
              {WIG_OVERLAYS.map((wig, i) => (
                <button
                  key={wig.id}
                  onClick={() => setSelectedOverlay(i)}
                  className={cn(
                    'w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left',
                    selectedOverlay === i
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-100 hover:border-brand-200'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex-shrink-0 ring-2 ring-offset-1',
                      selectedOverlay === i ? 'ring-brand-500' : 'ring-transparent'
                    )}
                    style={{ background: wig.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{wig.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{wig.style}</p>
                  </div>
                  {selectedOverlay === i && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
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
            <h4 className="font-semibold text-brand-800 text-sm mb-2">Tips for best results</h4>
            <ul className="space-y-1.5 text-xs text-brand-700">
              <li className="flex items-start gap-1.5"><span>•</span> Find good, even lighting</li>
              <li className="flex items-start gap-1.5"><span>•</span> Look directly at the camera</li>
              <li className="flex items-start gap-1.5"><span>•</span> Keep your hair pulled back</li>
              <li className="flex items-start gap-1.5"><span>•</span> Stay within 1–2 feet of camera</li>
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
  );
}
