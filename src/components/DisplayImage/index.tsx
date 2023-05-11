import { Tensor } from "onnxruntime-web";
import React, { useContext, useEffect, useRef, useState } from "react";
import { handleImageScale } from "../helpers/scaleHelper";
import { modelScaleProps } from "../helpers/Interfaces";
import { onnxMaskToImage } from "../helpers/maskUtils";
import { modelData } from "../helpers/onnxModelAPI";
import Stage from "../Stage";
import ImgContext from "../hooks/createContext";
const ort = require("onnxruntime-web");
/* @ts-ignore */
import npyjs from "npyjs";
import { useOnnxModel } from "@/utils/useOnnxModel";
import { Loading } from "../Loading";

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
  const [tensor, setTensor] = useState<Tensor | null>(null); // Image embedding tensor
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);
  const [onnxModel] = useOnnxModel();
  const [loadingNpy, setLoadingNpy] = useState<boolean>(false);

  useEffect(() => {
    if (!onnxModel || !embedding || !image) return;
    // Load the image
    const url = new URL(image);
    loadImage(url);
    // Load the Segment Anything pre-computed embedding
    setLoadingNpy(true);
    Promise.resolve(loadNpyTensor(embedding, "float32")).then(
      (embedding) => setTensor(embedding)
    ).finally(() => {
      setLoadingNpy(false);
    });
  }, [embedding, image, onnxModel])

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
        onnxModel === null ||
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
        const results = await onnxModel.run(feeds);
        const output = results[onnxModel.outputNames[0]];
        // The predicted mask returned from the ONNX model is an array which is 
        // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
        const maskImg = onnxMaskToImage(output.data, output.dims[2], output.dims[3]);
        setMaskImg(maskImg);
      }
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <>
      {loadingNpy && (
        <Loading text='AI解图中...' />
      )}
      <Stage />
    </>
  )
};

export default DisplayImg;