import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewPanelProps {
  croppedImageUrl: string | null;
}

export const PreviewPanel = ({ croppedImageUrl }: PreviewPanelProps) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full bg-panel border-panel-border">
      <CardHeader>
        <CardTitle>{t('cropper.preview')}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[calc(100%-80px)]">
        {croppedImageUrl ? (
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={croppedImageUrl}
              alt="Cropped preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>{t('messages.selectImage')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
