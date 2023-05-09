export const drawBorder = (src: string) => {
  const img = document.createElement('img');
  img.crossOrigin = 'anonymous';
  img.src = src;
  return new Promise((resolve: (res: string) => void, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(src);
        return;
      }
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixelData = imageData.data;
      const edgePixelData = new Uint8ClampedArray(pixelData.length);
      for (let i = 0; i < pixelData.length; i += 4) {
        const alpha = pixelData[i + 3];
        if (alpha !== 0) {
          const x = (i / 4) % width;
          const y = Math.floor(i / 4 / width);
          // const isEdge =
          //   getAlpha(pixelData, x - 1, y - 1) === 0 ||
          //   getAlpha(pixelData, x - 1, y) === 0 ||
          //   getAlpha(pixelData, x - 1, y + 1) === 0 ||
          //   getAlpha(pixelData, x, y - 1) === 0 ||
          //   getAlpha(pixelData, x, y + 1) === 0 ||
          //   getAlpha(pixelData, x + 1, y - 1) === 0 ||
          //   getAlpha(pixelData, x + 1, y) === 0 ||
          //   getAlpha(pixelData, x + 1, y + 1) === 0;
          const isEdge =
            getAlpha(pixelData, x - 2, y - 2) === 0 ||
            getAlpha(pixelData, x - 2, y - 1) === 0 ||
            getAlpha(pixelData, x - 2, y) === 0 ||
            getAlpha(pixelData, x - 2, y + 1) === 0 ||
            getAlpha(pixelData, x - 2, y + 2) === 0 ||
            getAlpha(pixelData, x - 1, y - 2) === 0 ||
            getAlpha(pixelData, x - 1, y + 2) === 0 ||
            getAlpha(pixelData, x, y - 2) === 0 ||
            getAlpha(pixelData, x, y + 2) === 0 ||
            getAlpha(pixelData, x + 1, y - 2) === 0 ||
            getAlpha(pixelData, x + 1, y + 2) === 0 ||
            getAlpha(pixelData, x + 2, y - 2) === 0 ||
            getAlpha(pixelData, x + 2, y - 1) === 0 ||
            getAlpha(pixelData, x + 2, y) === 0 ||
            getAlpha(pixelData, x + 2, y + 1) === 0 ||
            getAlpha(pixelData, x + 2, y + 2) === 0;
          if (isEdge) {
            edgePixelData[i] = 255;
            edgePixelData[i + 1] = 0;
            edgePixelData[i + 2] = 0;
            edgePixelData[i + 3] = 255;
          }
        }
      }
      function getAlpha(pixelData: Uint8ClampedArray, x: number, y: number) {
        if (x < 0 || x >= width || y < 0 || y >= height) {
          return 0;
        }
        const i = (y * width + x) * 4;
        return pixelData[i + 3];
      }
      const edgeImageData = new ImageData(edgePixelData, width, height);
      ctx.putImageData(edgeImageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    img.onerror = reject;
  });
};
