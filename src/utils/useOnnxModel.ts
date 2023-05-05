import { useMyStore } from '@/store';
import { MODEL_DIR } from '@/components/constant';
import { InferenceSession } from 'onnxruntime-web';
import { useEffect, useRef } from 'react';

export const useOnnxModel = () => {
  const setOnnxModel = useMyStore((state) => state.setOnnxModel);
  const onnxModel = useMyStore((state) => state.onnxModel);
  const isRquested = useRef<boolean>(false);

  // Initialize the ONNX model. load the image, and load the SAM
  // pre-computed image embedding
  useEffect(() => {
    if (!isRquested.current && !onnxModel) {
      // 避免重复请求
      isRquested.current = true;
      const initModel = async () => {
        try {
          if (MODEL_DIR === undefined) return;
          const model = await InferenceSession.create(MODEL_DIR);
          setOnnxModel(model);
        } catch (e) {
          console.log(e);
        }
      };
      // Initialize the ONNX model
      initModel();
    }
  }, []);

  return [onnxModel];
};
