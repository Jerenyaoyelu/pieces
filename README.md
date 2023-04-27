🔥 A web utility Segmenting images using Meta AI's SAM.

> Under construction, more features are coming...

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

- [x] generate embeddings with python scripts when consuming a next api endpoint (currently locally)
- [x] host onnx model file in cloud with Aliyun OSS
- [x] host generated embedding npy files in cloud with Aliyun OSS
- [x] tackle the cors issue of uploaded npy files
- [x] tackle the host issue of sam_vit_h_4b8939.pth file
- [x] put all pieces together and make the app run

## what to do

- [ ] support uploading image
- [ ] support extracting specific piece of image
- [ ] cooler interaction with each piece
