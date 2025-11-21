import { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface CropResult {
  url: string;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio?: number;
  rotation: number;
  outputSize: string;
  onCropResultChange: (result: CropResult | null) => void;
  originalImageHeight?: number | null;
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export const ImageCropper = ({
  imageSrc,
  aspectRatio,
  rotation,
  outputSize,
  onCropResultChange,
  originalImageHeight,
  outputFormat,
}: ImageCropperProps) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [baseZoom, setBaseZoom] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const cropperRef = useRef<HTMLImageElement | null>(null);
  const cropDebounceRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const updateCroppedImage = useCallback(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper) {
      onCropResultChange(null);
      return;
    }

    let targetWidth: number | undefined;
    let targetHeight: number | undefined;

    if (outputSize !== 'original') {
      const [widthStr, heightStr] = outputSize.split('x');
      const parsedWidth = Number(widthStr);
      const parsedHeight = Number(heightStr);

      if (!Number.isNaN(parsedWidth) && !Number.isNaN(parsedHeight)) {
        targetWidth = parsedWidth;
        targetHeight = parsedHeight;
      }
    }

    const canvasOptions =
      targetWidth && targetHeight
        ? { width: targetWidth, height: targetHeight }
        : undefined;

    const canvas = cropper.getCroppedCanvas(canvasOptions);

    if (!canvas) {
      onCropResultChange(null);
      return;
    }

    let outputCanvas: HTMLCanvasElement = canvas;

    if (
      targetWidth != null &&
      targetHeight != null &&
      (canvas.width !== targetWidth || canvas.height !== targetHeight)
    ) {
      const fixedCanvas = document.createElement('canvas');
      fixedCanvas.width = targetWidth;
      fixedCanvas.height = targetHeight;

      const ctx = fixedCanvas.getContext('2d');

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
        outputCanvas = fixedCanvas;
      }
    }

    const mimeType = outputFormat || 'image/jpeg';
    const quality = mimeType === 'image/png' ? undefined : 0.95;
    const url =
      quality != null
        ? outputCanvas.toDataURL(mimeType, quality)
        : outputCanvas.toDataURL(mimeType);

    onCropResultChange({
      url,
      width: outputCanvas.width,
      height: outputCanvas.height,
    });
  }, [onCropResultChange, outputSize, originalImageHeight, aspectRatio, outputFormat]);

  const handleCrop = useCallback(() => {
    if (cropDebounceRef.current) {
      return;
    }

    cropDebounceRef.current = window.setTimeout(() => {
      cropDebounceRef.current = null;
      updateCroppedImage();
    }, 80);
  }, [updateCroppedImage]);

  const handleCropEnd = useCallback(() => {
    if (cropDebounceRef.current) {
      window.clearTimeout(cropDebounceRef.current);
      cropDebounceRef.current = null;
    }

    updateCroppedImage();
  }, [updateCroppedImage]);

  useEffect(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper || !isReady) return;

    cropper.rotateTo(rotation);
  }, [rotation, isReady]);

  useEffect(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper || !isReady) return;

    if (aspectRatio && aspectRatio > 0) {
      cropper.setAspectRatio(aspectRatio);
    } else {
      // Free Form: разблокируем соотношение сторон
      cropper.setAspectRatio(NaN);
    }

    updateCroppedImage();
  }, [aspectRatio, isReady, updateCroppedImage]);

  useEffect(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper || !isReady) return;

    cropper.zoomTo(baseZoom * zoom);
  }, [zoom, isReady, baseZoom]);

  useEffect(() => {
    if (!isReady) return;

    updateCroppedImage();
  }, [outputSize, isReady, updateCroppedImage]);

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 bg-black/20 rounded-lg overflow-hidden">
        <Cropper
          src={imageSrc}
          ref={cropperRef}
          style={{ height: '100%', width: '100%' }}
          aspectRatio={aspectRatio}
          viewMode={1}
          guides
          background={false}
          responsive
          autoCropArea={1}
          checkOrientation={false}
          dragMode="move"
          zoomOnWheel
          ready={() => {
            const imageElement: any = cropperRef.current;
            const cropper = imageElement?.cropper;

            if (cropper) {
              const containerData = cropper.getContainerData();
              const imageData = cropper.getImageData();

              let initialZoom = 1;

              if (imageData.naturalHeight > 0) {
                initialZoom = containerData.height / imageData.naturalHeight;
              }

              cropper.zoomTo(initialZoom);
              setBaseZoom(initialZoom);
              setZoom(1);
            }

            setIsReady(true);
          }}
          crop={handleCrop}
          cropend={handleCropEnd}
        />
      </div>
      <div className="mt-4 space-y-4 bg-card p-4 rounded-lg">
        <div className="space-y-2">
          <Label className="text-sm">{t('cropper.zoom')}</Label>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
