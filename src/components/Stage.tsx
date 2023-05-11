import React, { useContext, useRef } from "react";
import * as _ from "underscore";
import Tool from "./Tool";
import { modelInputProps } from "./helpers/Interfaces";
import ImgContext from "./hooks/createContext";

const Stage = () => {
  const {
    clicks: [, setClicks],
    image: [image],
  } = useContext(ImgContext)!;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getClick = (x: number, y: number): modelInputProps => {
    const clickType = 1;
    return { x, y, clickType };
  };

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;
    const click = getClick(x, y);
    if (click) setClicks([click]);
  }, 15);

  const handleDrop = (e: React.DragEvent) => {
    const data = e.dataTransfer.getData('text/plain');
    const { x, y } = e.currentTarget.getBoundingClientRect();
    const top = e.clientY - y;
    const left = e.clientX - x;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const img = document.createElement('img');
    img.src = data;
    console.log(img);

    img.onload = () => {
      console.log('runnnnn');
      ctx.drawImage(img, top, left, 500, 400);
    }
    img.onerror = (err) => {
      console.log('图片碎片放置失败', err);
    }
  }

  const flexCenterClasses = "flex items-center justify-center";
  return (
    <div className="flex items-stretch w-full h-full">
      <div
        className={`${flexCenterClasses} w-7/12 h-full`}
      >
        <div className={`${flexCenterClasses} relative w-[90%] h-[90%]`}>
          <Tool handleMouseMove={handleMouseMove} />
        </div>
      </div>
      <div
        className="w-5/12 border-2 border-black"
      >
        <canvas
          draggable
          className="w-full h-full"
          ref={canvasRef}
          onDragOver={(e) => {
            // 必须，否则drop事件不会触发
            e.preventDefault()
          }}
          onDrop={handleDrop}
        ></canvas>
      </div>
    </div>
  );
};

export default Stage;
