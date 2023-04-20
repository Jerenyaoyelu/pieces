import axios from 'axios';

export function convertImageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String.split(',')[1]);
      } else {
        reject(new Error('Failed to convert image to base64 string'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
  });
}

export async function imageUrlToBase64Client(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result?.toString().split(',')[1] || '';
      resolve(base64Data as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getBase64FromUrlServer(url: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  return base64;
}
