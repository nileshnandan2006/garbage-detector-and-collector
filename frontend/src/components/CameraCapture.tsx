import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, X, Check, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  selectedPreview?: string | null;
  onClear?: () => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageSelected,
  selectedPreview,
  onClear,
  disabled = false,
  disabledMessage
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    if (disabled) {
      setCameraError(disabledMessage || 'Please sign in to access the camera.');
      return;
    }
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access not granted or unavailable. You can upload an image file directly.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(blob);
      stopCamera();
      onImageSelected(file, preview);
    }, 'image/jpeg', 0.92);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      setCameraError(disabledMessage || 'Please sign in to upload photos.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onImageSelected(file, preview);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [facingMode]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* 1. Image Already Selected Preview */}
      {selectedPreview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md group">
          <img
            src={selectedPreview}
            alt="Selected waste snapshot"
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => {
                if (onClear) onClear();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors backdrop-blur-xs shadow-md"
              title="Remove and retake"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-400" /> Photo ready for AI verification
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-emerald-300 hover:text-white underline font-semibold"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : isCameraActive ? (
        /* 2. Live Camera Active */
        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 sm:h-80 object-cover"
          />

          {/* AI Scanning reticle overlay */}
          <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/50 m-6 rounded-xl flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0"></div>
            <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0"></div>
            <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0"></div>
            <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0"></div>
            <span className="text-[11px] bg-slate-950/80 text-emerald-400 px-2.5 py-1 rounded-full font-mono">
              AIM AT GARBAGE PILE
            </span>
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-10 px-4">
            <button
              onClick={toggleFacingMode}
              className="p-3 bg-slate-900/80 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg"
              title="Flip camera"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>

            <button
              onClick={captureFrame}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-950/50 flex items-center gap-2 transform active:scale-95 transition-all text-sm"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>

            <button
              onClick={stopCamera}
              className="p-3 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* 3. Initial Choice: Live Camera or Upload File */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Snap with Camera */}
          <div
            onClick={startCamera}
            className="group cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Use Live Camera</h4>
            <p className="text-xs text-slate-500">Capture direct photo of the garbage site</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              Open Camera
            </span>
          </div>

          {/* Upload File */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex items-center justify-center mb-3 transition-colors">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Upload Photo</h4>
            <p className="text-xs text-slate-500">Select JPEG, PNG, or WebP (max 15MB)</p>
            <span className="mt-3 inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-200/80 px-2.5 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
              Browse Files
            </span>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          {cameraError}
        </div>
      )}
    </div>
  );
};
