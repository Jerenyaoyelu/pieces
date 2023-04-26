import { siteBase } from '@/components/constant';
import axios from 'axios';
const fs = require('fs');

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

/**
 * 客户端转arrayBuffer
 * @param base64
 * @returns
 */
export function base64ToArrayBuffer(base64: string) {
  const str = atob(base64);
  const encoder = new TextEncoder();
  const arr = encoder.encode(str);
  return arr.buffer;
}

export const uploadFile = (file_path: Buffer | string, fileName: string) => {
  const key = process.env.NETLIFY_KEY;
  const siteId = process.env.NETLIFY_SITE_ID;
  console.log(key, siteId);
  // 读取文件内容，将其转化为 FormData 格式
  const file = fs.readFileSync(file_path);
  const blob = new Blob([file]);
  const formData = new FormData();
  formData.append('file', blob, fileName);
  // 使用 axios 发送 POST 请求，上传文件
  return axios
    .post(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${key}`,
      },
    })
    .then(() => {
      return {
        filePath: siteBase + '/' + fileName,
      };
    });
};
