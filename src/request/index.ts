import axios from 'axios';
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

export const generateImageEmbeddings = (url: string) => {
  const fileName = new Date().getTime() + '.npy';
  return request.post('api/embedding', {
    img: url,
    fileName,
  });
};
