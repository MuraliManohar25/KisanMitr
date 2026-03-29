import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  isAnalyzing: boolean;
}

export default function CameraCapture({ onCapture, onClose, isAnalyzing }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setCapturedImage(imageSrc);
  };

  const retake = () => setCapturedImage(null);

  const confirm = () => {
    if (!capturedImage) return;
    fetch(capturedImage)
      .then((res) => res.blob())
      .then(onCapture);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-forest text-white px-6 py-4 flex items-center justify-between">
            <h3 className="font-heading text-xl font-semibold">Capture Harvest</h3>
            <button onClick={onClose} className="p-2 hover:bg-leaf rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Camera/Preview */}
          <div className="relative bg-black aspect-[4/3]">
            {isAnalyzing ? (
              <LoadingSpinner message="Analyzing your harvest..." />
            ) : capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Controls */}
          {!isAnalyzing && (
            <div className="p-6 flex items-center justify-center gap-4">
              {capturedImage ? (
                <>
                  <button
                    onClick={retake}
                    className="px-6 py-3 bg-light-gray text-charcoal rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    Retake
                  </button>
                  <button
                    onClick={confirm}
                    className="px-8 py-3 bg-forest text-white rounded-xl font-semibold hover:bg-leaf transition"
                  >
                    Analyze
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                    className="p-4 bg-light-gray rounded-full hover:bg-gray-300 transition"
                  >
                    <RotateCw className="w-6 h-6 text-charcoal" />
                  </button>
                  <button
                    onClick={capture}
                    className="w-20 h-20 bg-harvest rounded-full flex items-center justify-center hover:bg-yellow-400 transition shadow-lg"
                  >
                    <Camera className="w-10 h-10 text-charcoal" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

