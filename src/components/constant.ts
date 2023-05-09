export const MODEL_DIR =
  'https://s.newscdn.cn/statics/file/sam_onnx_quantized_example.onnx';

// 'https://jerenlu.oss-cn-beijing.aliyuncs.com/sam/sam_onnx_quantized_example.onnx';

export const siteBase = 'https://pieces-sam.netlify.app';

export const example = {
  url: 'https://s.newscdn.cn/file/2023/04/f216f82d-4d11-407e-9bfd-2ee479323429.jpeg',
  embedding: '/static/npy/default.npy',
  // 'https://jerenlu.oss-cn-beijing.aliyuncs.com/sam/npy/461e2320-67c4-4f66-8e3e-f030543179a4.npy',
};

export const isProduction = process.env.NODE_ENV !== 'development';
