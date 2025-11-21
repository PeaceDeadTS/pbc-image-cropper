import { useTranslation } from 'react-i18next';
import { RotateCw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CropperControlsProps {
  aspectRatio: number;
  onAspectRatioChange: (ratio: number) => void;
  rotation: number;
  onRotationChange: (rotation: number) => void;
  outputSize: string;
  onOutputSizeChange: (size: string) => void;
}

export const CropperControls = ({
  aspectRatio,
  onAspectRatioChange,
  rotation,
  onRotationChange,
  outputSize,
  onOutputSizeChange,
}: CropperControlsProps) => {
  const { t } = useTranslation();

  const aspectRatios = [
    { value: 2 / 3, label: t('cropper.pbcStandard') },
    { value: 0, label: t('cropper.freeform') },
    { value: 16 / 9, label: t('cropper.preset16-9') },
    { value: 4 / 3, label: t('cropper.preset4-3') },
    { value: 1, label: t('cropper.preset1-1') },
  ];

  const outputSizes = [
    { value: 'original', label: t('size.original') },
    { value: '1000x1500', label: t('size.1000x1500') },
    { value: '800x1200', label: t('size.800x1200') },
    { value: '667x1000', label: t('size.667x1000') },
    { value: '600x900', label: t('size.600x900') },
    { value: '533x800', label: t('size.533x800') },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          {t('settings.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('cropper.aspectRatio')}</Label>
          <Select
            value={aspectRatio.toString()}
            onValueChange={(value) => onAspectRatioChange(parseFloat(value))}
          >
            <SelectTrigger className="bg-control hover:bg-control-hover">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value.toString()}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('size.title')}</Label>
          <Select value={outputSize} onValueChange={onOutputSizeChange}>
            <SelectTrigger className="bg-control hover:bg-control-hover">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {outputSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('cropper.rotate')}</Label>
          <Button
            variant="secondary"
            className="w-full bg-control hover:bg-control-hover"
            onClick={() => onRotationChange((rotation + 90) % 360)}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            {rotation}°
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
