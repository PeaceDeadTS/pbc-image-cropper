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
}

export const ImageCropper = ({
  imageSrc,
  aspectRatio,
  rotation,
  outputSize,
  onCropResultChange,
  originalImageHeight,
}: ImageCropperProps) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const cropperRef = useRef<HTMLImageElement | null>(null);

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
    } else if (originalImageHeight && originalImageHeight > 0) {
      const data = cropper.getData();
      const cropAspect =
        data && data.height !== 0 ? data.width / data.height : aspectRatio || 1;

      targetHeight = originalImageHeight;
      targetWidth = Math.round(targetHeight * cropAspect);
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

    const url = canvas.toDataURL('image/jpeg', 0.95);

    onCropResultChange({
      url,
      width: canvas.width,
      height: canvas.height,
    });
  }, [onCropResultChange, outputSize, originalImageHeight, aspectRatio]);

  const handleCrop = useCallback(() => {
    if (!isReady) return;
    updateCroppedImage();
  }, [updateCroppedImage, isReady]);

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

    cropper.zoomTo(zoom);
  }, [zoom, isReady]);

  useEffect(() => {
    if (!isReady) return;
    updateCroppedImage();
  }, [updateCroppedImage, isReady]);

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
              setZoom(initialZoom);
            }

            setIsReady(true);
          }}
          crop={handleCrop}
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
