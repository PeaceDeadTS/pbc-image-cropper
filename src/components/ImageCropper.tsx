import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  rotation: number;
}

export const ImageCropper = ({
  imageSrc,
  aspectRatio,
  onCropComplete,
  rotation,
}: ImageCropperProps) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedArea, croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 bg-black/20 rounded-lg overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              backgroundColor: 'transparent',
            },
          }}
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
