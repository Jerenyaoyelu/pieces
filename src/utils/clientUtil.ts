export function fileToBinary(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function convertImageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString();
      if (base64String) {
        resolve(base64String);
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
