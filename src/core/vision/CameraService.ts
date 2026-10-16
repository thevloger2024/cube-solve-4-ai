import { ColorName } from '../cube/CubeState';
import { classifyColor, RGB } from './ColorClassifier';

export interface GridSampleResult {
  colors: ColorName[];
  confidences: number[];
  rgbSamples: RGB[];
}

export class CameraService {
  private stream: MediaStream | null = null;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D | null;

  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * Starts video stream with rear/environment camera preferred on mobile
   */
  public async startCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera access is not supported in this browser or context.');
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      await videoElement.play();
      return this.stream;
    } catch (err: unknown) {
      // Fallback to basic video constraint if environment facingMode fails
      const basicConstraints: MediaStreamConstraints = { video: true, audio: false };
      this.stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
      videoElement.srcObject = this.stream;
      await videoElement.play();
      return this.stream;
    }
  }

  /**
   * Stops active camera tracks
   */
  public stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Samples the 9 grid patches of the current face from the video feed
   */
  public sampleGridFromVideo(
    video: HTMLVideoElement,
    gridRect: { x: number; y: number; width: number; height: number }
  ): GridSampleResult {
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    this.offscreenCanvas.width = vw;
    this.offscreenCanvas.height = vh;

    if (!this.offscreenCtx) {
      throw new Error('Canvas context unavailable');
    }

    // Draw full current frame
    this.offscreenCtx.drawImage(video, 0, 0, vw, vh);

    const colors: ColorName[] = [];
    const confidences: number[] = [];
    const rgbSamples: RGB[] = [];

    const cellW = gridRect.width / 3;
    const cellH = gridRect.height / 3;

    // Sample each of the 9 stickers (row-major: 0..8)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // Sample the central 40% of the sticker to avoid borders and glares
        const patchW = Math.max(4, Math.floor(cellW * 0.4));
        const patchH = Math.max(4, Math.floor(cellH * 0.4));
        const patchX = Math.floor(gridRect.x + col * cellW + (cellW - patchW) / 2);
        const patchY = Math.floor(gridRect.y + row * cellH + (cellH - patchH) / 2);

        const clampedX = Math.max(0, Math.min(vw - patchW, patchX));
        const clampedY = Math.max(0, Math.min(vh - patchH, patchY));

        const imageData = this.offscreenCtx.getImageData(clampedX, clampedY, patchW, patchH);
        const data = imageData.data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        const pixelCount = patchW * patchH;

        for (let i = 0; i < data.length; i += 4) {
          totalR += data[i];
          totalG += data[i + 1];
          totalB += data[i + 2];
        }

        const avgR = Math.round(totalR / pixelCount);
        const avgG = Math.round(totalG / pixelCount);
        const avgB = Math.round(totalB / pixelCount);

        const rgb: RGB = { r: avgR, g: avgG, b: avgB };
        const classified = classifyColor(rgb);

        colors.push(classified.color);
        confidences.push(classified.confidence);
        rgbSamples.push(rgb);
      }
    }

    return { colors, confidences, rgbSamples };
  }
}

export const cameraService = new CameraService();
