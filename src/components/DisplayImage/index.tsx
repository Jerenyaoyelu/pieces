import { InferenceSession, Tensor } from "onnxruntime-web";
import React, { useContext, useEffect, useState } from "react";
import { handleImageScale } from "../helpers/scaleHelper";
import { modelScaleProps } from "../helpers/Interfaces";
import { onnxMaskToImage } from "../helpers/maskUtils";
import { modelData } from "../helpers/onnxModelAPI";
import Stage from "../Stage";
import ImgContext from "../hooks/createContext";
const ort = require("onnxruntime-web");
/* @ts-ignore */
import npyjs from "npyjs";
import { MODEL_DIR } from "../constant";

interface ImgProp {
  embedding: string;
  image: string;
}

const DisplayImg: React.FC<ImgProp> = ({ embedding, image }) => {
  const {
    clicks: [clicks],
    image: [, setImage],
    maskImg: [, setMaskImg],
  } = useContext(ImgContext)!;
  const [model, setModel] = useState<InferenceSession | null>(null); // ONNX model
  const [tensor, setTensor] = useState<Tensor | null>(null); // Image embedding tensor

  // The ONNX model expects the input to be rescaled to 1024. 
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);
  const [imagePath, setImagePath] = useState<string>('');


  // Initialize the ONNX model. load the image, and load the SAM
  // pre-computed image embedding
  useEffect(() => {
    const initModel = async () => {
      try {
        if (MODEL_DIR === undefined) return;
        const model = await InferenceSession.create(MODEL_DIR);
        setModel(model);
      } catch (e) {
        console.log(e);
      }
    };
    // Initialize the ONNX model
    initModel();
  }, []);

  useEffect(() => {
    console.log(embedding);

    if (!model) return;
    // Load the image
    const url = new URL(image);
    console.log(url);
    loadImage(url);

    // Load the Segment Anything pre-computed embedding
    Promise.resolve(loadNpyTensor(embedding, "float32")).then(
      (embedding) => setTensor(embedding)
    );
  }, [embedding, image, model])

  const loadImage = async (url: URL) => {
    try {
      const img = new Image();
      img.src = url.href;
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        setModelScale({
          height: height,  // original image height
          width: width,  // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        img.width = width;
        img.height = height;
        setImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Decode a Numpy file into a tensor. 
  const loadNpyTensor = async (tensorFile: string, dType: string) => {
    console.log('pp', tensorFile);

    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    runONNX();
  }, [clicks]);

  const runONNX = async () => {
    try {
      if (
        model === null ||
        clicks === null ||
        tensor === null ||
        modelScale === null
      )
        return;
      else {
        // Preapre the model input in the correct format for SAM. 
        // The modelData function is from onnxModelAPI.tsx.
        const feeds = modelData({
          clicks,
          tensor,
          modelScale,
        });
        if (feeds === undefined) return;
        // Run the SAM ONNX model with the feeds returned from modelData()
        const results = await model.run(feeds);
        const output = results[model.outputNames[0]];
        // The predicted mask returned from the ONNX model is an array which is 
        // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
        setMaskImg(onnxMaskToImage(output.data, output.dims[2], output.dims[3]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return <Stage />;
};

export default DisplayImg;