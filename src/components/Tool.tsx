/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from "react";
import ImgContext from "./hooks/createContext";
import { ToolProps } from "./helpers/Interfaces";
import * as _ from "underscore";
import { drawBorder } from "./drawBorder";

const Tool = ({ handleMouseMove }: ToolProps) => {
  const {
    image: [image],
    maskImg: [maskImg, setMaskImg],
  } = useContext(ImgContext)!;
  const [maskImgUrl, setMaskImgUrl] = useState<string>('');

  // Determine if we should shrink or grow the images to match the
  // width or the height of the page and setup a ResizeObserver to
  // monitor changes in the size of the page
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);

  useEffect(() => {
    if (maskImg?.src) {
      drawBorder(maskImg.src).then((res: string) => {
        setMaskImgUrl(res);
      })
    }
  }, [maskImg])

  const imageClasses = "";
  const maskImageClasses = `absolute`;

  const handleDown = () => {

  }

  // Render the image and the predicted mask image on top
  return (
    <>
      {image && (
        <img
          onPointerDown={handleDown}
          onMouseMove={handleMouseMove}
          onMouseOut={() => _.defer(() => setMaskImg(null))}
          onTouchEnd={handleMouseMove}
          src={image.src}
          className={`${shouldFitToWidth ? "w-full" : "h-full"
            } ${imageClasses}`}
        ></img>
      )}
      {maskImg && (
        <img
          draggable
          onDragStart={(e) => {
            console.log('dragggg');
            e.dataTransfer.setData('text/plain', maskImg.src);
          }}
          onMouseMove={handleMouseMove}
          src={maskImgUrl}
          className={`${shouldFitToWidth ? "w-full" : "h-full"
            } ${maskImageClasses}`}
        ></img>
      )}
    </>
  );
};

export default Tool;
