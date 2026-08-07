'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw, X, Check, Loader2 } from 'lucide-react';

interface SelfieCaptureProps {
  title: string;
  confirmLabel: string;
  busy?: boolean;
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export default function SelfieCapture({ title, confirmLabel, busy, onCapture, onClose }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Couldn't access your camera. Please allow camera access and try again."));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg', 0.85));
  };

  const retake = () => setPhoto(null);

  const confirm = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => blob && onCapture(blob), 'image/jpeg', 0.85);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl bg-gray-950">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs font-semibold text-white/70">{error}</div>
          )}
          {/* The video element stays mounted the whole time (just hidden
              behind the captured photo) — unmounting/remounting it on
              retake would lose the live srcObject binding and show a blank
              frame instead of the camera feed. */}
          <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full scale-x-[-1] object-cover ${photo || error ? 'hidden' : ''}`} />
          {photo && <img src={photo} alt="Captured selfie" className="absolute inset-0 h-full w-full object-cover" />}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-4 flex justify-end gap-2">
          {photo ? (
            <>
              <button onClick={retake} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600"><RotateCcw size={14} /> Retake</button>
              <button onClick={confirm} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {confirmLabel}
              </button>
            </>
          ) : (
            <button onClick={capture} disabled={!!error} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
              <Camera size={14} /> Capture selfie
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
