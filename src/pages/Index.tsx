import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, RotateCcw } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageCropper } from '@/components/ImageCropper';
import { CropperControls } from '@/components/CropperControls';
import { PreviewPanel } from '@/components/PreviewPanel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Index = () => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [rotation, setRotation] = useState(0);
  const [outputSize, setOutputSize] = useState('original');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filename, setFilename] = useState('Cropped');
  const [originalImageSize, setOriginalImageSize] = useState<
    { width: number; height: number } | null
  >(null);
  const [cropResolution, setCropResolution] = useState<
    { width: number; height: number } | null
  >(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const src = reader.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setOriginalImageSize({ width: img.width, height: img.height });
      };
      img.src = src;
    });
    reader.readAsDataURL(file);
  }, []);

  const handleCropResultChange = useCallback(
    (result: { url: string; width: number; height: number } | null) => {
      if (!result) {
        setCroppedImageUrl(null);
        setCropResolution(null);
        return;
      }

      setCroppedImageUrl(result.url);
      setCropResolution({ width: result.width, height: result.height });
    },
    []
  );

  const handleSave = useCallback(
    (customFilename?: string) => {
      if (!croppedImageUrl) {
        toast.error(t('messages.selectImage'));
        return;
      }

      const link = document.createElement('a');
      link.download = `${customFilename || filename}.jpg`;
      link.href = croppedImageUrl;
      link.click();
      toast.success(t('messages.saveSuccess'));
      setShowSaveDialog(false);
    },
    [croppedImageUrl, filename, t]
  );

  const handleQuickSave = useCallback(() => {
    handleSave(t('actions.defaultName'));
  }, [handleSave, t]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setCroppedImageUrl(null);
    setAspectRatio(2 / 3);
    setRotation(0);
    setOutputSize('original');
    setFilename('Cropped');
    setOriginalImageSize(null);
    setCropResolution(null);
  }, []);

  useEffect(() => {
    if (aspectRatio === 0 && outputSize !== 'original') {
      setOutputSize('original');
    }
  }, [aspectRatio, outputSize]);

  const finalResolution = cropResolution;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{t('app.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('app.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {imageSrc && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title={t('actions.reset')}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full bg-panel border-panel-border">
              <CardHeader>
                <CardTitle>{t('cropper.original')}</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                {!imageSrc ? (
                  <ImageUploader onImageUpload={handleImageUpload} />
                ) : (
                  <ImageCropper
                    imageSrc={imageSrc}
                    aspectRatio={aspectRatio === 0 ? undefined : aspectRatio}
                    rotation={rotation}
                    outputSize={outputSize}
                    onCropResultChange={handleCropResultChange}
                    originalImageHeight={originalImageSize?.height ?? null}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <PreviewPanel
              croppedImageUrl={croppedImageUrl}
              resolution={finalResolution}
            />
            {imageSrc && (
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={handleQuickSave}>
                  {t('actions.quickSave')}
                </Button>
                <Button onClick={() => setShowSaveDialog(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('actions.save')}
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CropperControls
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              rotation={rotation}
              onRotationChange={setRotation}
              outputSize={outputSize}
              onOutputSizeChange={setOutputSize}
              isFreeForm={aspectRatio === 0}
              originalImageHeight={originalImageSize?.height ?? null}
            />
          </div>
        </div>
      </main>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.save')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filename">{t('actions.filename')}</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={t('actions.defaultName')}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                {t('actions.cancel')}
              </Button>
              <Button onClick={() => handleSave(filename)}>
                {t('actions.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
