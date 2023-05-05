import { InferenceSession } from 'onnxruntime-web';
import { create } from 'zustand';

type State = {
  onnxModel: InferenceSession | null;
};

type Actions = {
  setOnnxModel: (model: InferenceSession) => void;
};

export const useMyStore = create<State & Actions>((set) => ({
  onnxModel: null,
  setOnnxModel: (model: InferenceSession) =>
    set(() => ({
      onnxModel: model,
    })),
}));
