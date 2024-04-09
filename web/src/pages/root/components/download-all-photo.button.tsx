import { Button } from 'konsta/react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import themes from '../../../themes';
import canvasToWebp from '../../../core/canvas-to-webp';
import downloadManyFile from '../../../core/download-many-file';
import draw from '../../../themes/draw';

const DownloadAllPhotoButton = () => {
  const { t } = useTranslation();
  const {
    selectedThemeName,
    quality,
    photos,
    fixImageWidth,
    imageWidth,
    fixWatermark,
    watermark,
    showCameraMaker,
    showCameraModel,
    showLensModel,
    overrideCameraMaker,
    overrideCameraModel,
    overrideLensModel,
    setLoading,
  } = useStore();

  const selectedTheme = themes.find((theme) => theme.name === selectedThemeName)!;

  return (
    <>
      <Button
        clear
        onClick={async () => {
          if (photos.length === 0) return;
          setLoading(true);
          const files: { name: string; buffer: ArrayBuffer }[] = [];
          await Promise.all(
            photos.map(async (photo) => {
              const canvas = await draw(selectedTheme.func, photo, {
                watermark: fixWatermark ? watermark : undefined,
                imageWidth: fixImageWidth ? imageWidth : undefined,
                showCameraMaker,
                showCameraModel,
                showLensModel,
                overrideCameraMaker,
                overrideCameraModel,
                overrideLensModel,
              });
              files.push({ name: photo.file.name, buffer: await canvasToWebp(canvas, quality) });
            })
          );
          await downloadManyFile(files);
          setLoading(false);
        }}
      >
        {t('root.download-all')}
      </Button>
    </>
  );
};

export default DownloadAllPhotoButton;
