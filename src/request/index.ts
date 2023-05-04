import axios, { AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';

const base = location.origin;

const request = axios.create({
  baseURL: base,
  timeout: 60000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

export const generateImageEmbeddings: APIParam<{
  url: string;
  fileName: string;
}> = ({ url, fileName }) => {
  return request.post('api/embedding', {
    img: url,
    fileName,
  });
};

export const getOssCredentials: APIParam<any> = () => {
  const secretKey = process.env.NEXT_PUBLIC_AES_KEY;
  return request.get('api/getOssKeys').then((res) => {
    const decrypted = CryptoJS.AES.decrypt(
      res.data,
      secretKey as string
    ).toString(CryptoJS.enc.Utf8);
    res.data = JSON.parse(decrypted);
    return res;
  });
};

type APIParam<T> = (p: T) => Promise<AxiosResponse>;
