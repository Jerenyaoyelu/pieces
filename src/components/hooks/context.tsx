// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useState } from "react";
import { modelInputProps } from "../helpers/Interfaces";
import ImgContext from "./createContext";

const ImgContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [clicks, setClicks] = useState<Array<modelInputProps> | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);

  return (
    <ImgContext.Provider
      value={{
        clicks: [clicks, setClicks],
        image: [image, setImage],
        maskImg: [maskImg, setMaskImg],
      }}
    >
      {props.children}
    </ImgContext.Provider>
  );
};

export default ImgContextProvider;
