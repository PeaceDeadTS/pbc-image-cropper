import { Area } from 'react-easy-crop';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export const getRadianAngle = (degreeValue: number): number => {
  return (degreeValue * Math.PI) / 180;
};

export const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  outputSize?: { width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('No 2d context');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  if (outputSize) {
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');

    if (!finalCtx) {
      throw new Error('No 2d context');
    }

    finalCanvas.width = outputSize.width;
    finalCanvas.height = outputSize.height;

    finalCtx.drawImage(
      croppedCanvas,
      0,
      0,
      croppedCanvas.width,
      croppedCanvas.height,
      0,
      0,
      outputSize.width,
      outputSize.height
    );

    return finalCanvas.toDataURL('image/jpeg', 0.95);
  }

  return croppedCanvas.toDataURL('image/jpeg', 0.95);
}
