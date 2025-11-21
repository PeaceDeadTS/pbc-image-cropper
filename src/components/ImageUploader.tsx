import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
        toast.success(t('messages.uploadSuccess'));
      }
    },
    [onImageUpload, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
        toast.success(t('messages.uploadSuccess'));
      }
    },
    [onImageUpload, t]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-border rounded-lg p-8 transition-colors hover:border-primary"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{t('upload.title')}</h3>
      <p className="text-muted-foreground mb-4 text-center">
        {t('upload.dragDrop')}
      </p>
      <p className="text-sm text-muted-foreground mb-4">{t('upload.or')}</p>
      <label htmlFor="file-upload">
        <Button variant="default" className="cursor-pointer" asChild>
          <span>{t('upload.browse')}</span>
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <p className="text-xs text-muted-foreground mt-4">{t('upload.supported')}</p>
    </div>
  );
};
