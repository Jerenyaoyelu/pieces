This is A implementation of Meta SAM in web browser.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## what have done

- [x] generating embeddings with python scripts when consuming a next api endpoint (currently locally)
- [x] hosting onnx model file in cloud
- [x] uploading generated embedding npy files to netlify server

## what to do

- [] tackle the cors issue of uploaded npy files
- [] tackle the host issue of sam_vit_h_4b8939.pth file
- [] put all pieces together and make the app run
