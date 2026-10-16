import React, { useRef, useState, useEffect } from 'react';
import { CubeState, FaceName, ColorName, COLOR_HEX, FACES, cloneCube } from '../../core/cube/CubeState';
import { cameraService, GridSampleResult } from '../../core/vision/CameraService';
import { validateCubeState } from '../../core/cube/CubeValidation';
import { sounds } from '../../core/audio/SoundEffects';
import {
  Camera,
  VideoOff,
  Check,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CameraScannerProps {
  onScanComplete: (scannedCube: CubeState) => void;
  onCancel: () => void;
}

const SCAN_SEQUENCE: { face: FaceName; name: string; centerColor: ColorName; guideText: string }[] = [
  { face: 'U', name: 'Up Face', centerColor: 'white', guideText: 'Hold the cube with the WHITE center sticker in the middle.' },
  { face: 'R', name: 'Right Face', centerColor: 'red', guideText: 'Turn the cube to show the RED center sticker in the middle.' },
  { face: 'F', name: 'Front Face', centerColor: 'green', guideText: 'Turn the cube to show the GREEN center sticker in the middle.' },
  { face: 'D', name: 'Down Face', centerColor: 'yellow', guideText: 'Turn the cube to show the YELLOW center sticker in the middle.' },
  { face: 'L', name: 'Left Face', centerColor: 'orange', guideText: 'Turn the cube to show the ORANGE center sticker in the middle.' },
  { face: 'B', name: 'Back Face', centerColor: 'blue', guideText: 'Turn the cube to show the BLUE center sticker in the middle.' },
];

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScanComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedFaces, setScannedFaces] = useState<Partial<Record<FaceName, ColorName[]>>>({});
  const [currentFaceColors, setCurrentFaceColors] = useState<ColorName[]>([]);
  const [confidences, setConfidences] = useState<number[]>([]);
  const [isCaptured, setIsCaptured] = useState(false);

  const currentStep = SCAN_SEQUENCE[currentStepIndex];

  // Start camera on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!videoRef.current) return;
      try {
        setErrorMsg(null);
        await cameraService.startCamera(videoRef.current);
        if (mounted) {
          setCameraActive(true);
        }
      } catch (err) {
        if (mounted) {
          setErrorMsg(
            'Unable to access camera. Please allow camera permissions in your browser or switch to Manual Color Entry.'
          );
        }
      }
    }

    init();

    return () => {
      mounted = false;
      cameraService.stopCamera();
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;

    try {
      const vw = videoRef.current.videoWidth || 640;
      const vh = videoRef.current.videoHeight || 480;

      // Define central square region of the video
      const size = Math.min(vw, vh) * 0.65;
      const x = (vw - size) / 2;
      const y = (vh - size) / 2;

      const sample: GridSampleResult = cameraService.sampleGridFromVideo(videoRef.current, {
        x,
        y,
        width: size,
        height: size,
      });

      // Fix center sticker to required face center color
      const correctedColors = [...sample.colors];
      correctedColors[4] = currentStep.centerColor;

      setCurrentFaceColors(correctedColors);
      setConfidences(sample.confidences);
      setIsCaptured(true);
      sounds.playTurn();
    } catch (e) {
      setErrorMsg('Failed to process image frame.');
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setCurrentFaceColors([]);
    setConfidences([]);
  };

  const cycleStickerColor = (index: number) => {
    if (index === 4) return; // Fixed center
    const colorOrder: ColorName[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];
    const current = currentFaceColors[index];
    const nextIdx = (colorOrder.indexOf(current) + 1) % colorOrder.length;
    const next = [...currentFaceColors];
    next[index] = colorOrder[nextIdx];
    setCurrentFaceColors(next);
    sounds.playTurn();
  };

  const handleConfirmFace = () => {
    const updated = {
      ...scannedFaces,
      [currentStep.face]: currentFaceColors,
    };
    setScannedFaces(updated);

    if (currentStepIndex < SCAN_SEQUENCE.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsCaptured(false);
      setCurrentFaceColors([]);
      setConfidences([]);
      sounds.playTurn();
    } else {
      // All 6 faces scanned! Assembled cube:
      const fullCube: CubeState = {
        U: updated.U || Array(9).fill('white'),
        R: updated.R || Array(9).fill('red'),
        F: updated.F || Array(9).fill('green'),
        D: updated.D || Array(9).fill('yellow'),
        L: updated.L || Array(9).fill('orange'),
        B: updated.B || Array(9).fill('blue'),
      };

      sounds.playVictory();
      onScanComplete(fullCube);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
      {/* Header & Steps Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              Face {currentStepIndex + 1} of 6
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Scan {currentStep.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {currentStep.guideText}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {SCAN_SEQUENCE.map((s, idx) => {
            const isDone = scannedFaces[s.face] !== undefined;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={s.face}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.face}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Viewport with 3x3 Overlay */}
      <div className="relative my-6 aspect-[4/3] max-h-[420px] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-gray-800">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Semi-transparent 3x3 Guide Box */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-56 h-56 sm:w-64 sm:h-64 grid grid-cols-3 gap-2 border-2 border-white/80 rounded-2xl p-2 bg-black/10 backdrop-blur-[1px] shadow-2xl">
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-dashed border-white/60 flex items-center justify-center bg-white/5"
                >
                  {i === 4 && (
                    <div
                      style={{ backgroundColor: COLOR_HEX[currentStep.centerColor] }}
                      className="w-4 h-4 rounded-full border border-white shadow-md animate-pulse"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Error overlay */}
        {errorMsg && (
          <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <VideoOff className="w-12 h-12 text-red-500 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Camera Inaccessible</h4>
            <p className="text-xs text-gray-300 max-w-md mb-4">{errorMsg}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Use Manual Color Entry
            </button>
          </div>
        )}
      </div>

      {/* Scanned Face Confirmation & Sticker Correction */}
      {isCaptured && currentFaceColors.length === 9 && (
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Detected Face Colors
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click any sticker to cycle colors if detected incorrectly.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 p-2 bg-gray-900 rounded-xl shadow-inner">
              {currentFaceColors.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => cycleStickerColor(idx)}
                  style={{ backgroundColor: COLOR_HEX[color] }}
                  className="w-12 h-12 rounded-lg border border-black/30 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                >
                  {idx === 4 && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black/40" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel Scan
        </button>

        {!isCaptured ? (
          <button
            type="button"
            onClick={handleCapture}
            disabled={!cameraActive}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Capture This Face</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmFace}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>
              {currentStepIndex === SCAN_SEQUENCE.length - 1 ? 'Finish Scan & Solve' : 'Confirm & Next Face'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
