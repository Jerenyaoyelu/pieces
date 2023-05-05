import { siteBase } from '@/components/constant';
import axios from 'axios';
import ossClient from './ossClient';
const fs = require('fs');

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

export const uploadFileToNetlify = (
  file_path: Buffer | string,
  fileName: string
) => {
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

export const uploadFileToOss = (
  file_path: string | Buffer | File | Blob,
  fileName: string
) => {
  // 上传文件
  return new Promise((resolve, reject) => {
    ossClient
      .put(fileName, file_path)
      .then(function (result: any) {
        console.log(`File "${fileName}" uploaded successfully to OSS.`);
        resolve({
          url: result.url,
          fileName,
          statusCode: result.statusCode,
          statusMessage: result.statusMessage,
        });
      })
      .catch(function (err: any) {
        console.error(err);
        reject(err);
      });
  });
};
