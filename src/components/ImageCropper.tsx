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
}

export const ImageCropper = ({
  imageSrc,
  aspectRatio,
  rotation,
  outputSize,
  onCropResultChange,
}: ImageCropperProps) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
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
  }, [onCropResultChange, outputSize]);

  const handleCrop = useCallback(() => {
    updateCroppedImage();
  }, [updateCroppedImage]);

  useEffect(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper) return;

    cropper.rotateTo(rotation);
  }, [rotation]);

  useEffect(() => {
    const imageElement: any = cropperRef.current;
    const cropper = imageElement?.cropper;

    if (!cropper) return;

    cropper.zoomTo(zoom);
  }, [zoom]);

  useEffect(() => {
    updateCroppedImage();
  }, [updateCroppedImage]);

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
