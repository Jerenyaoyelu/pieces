import { generateImageEmbeddings, getOssCredentials } from '@/request';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';
import { example } from '@/components/constant';
import { CloudUploadOutlined } from '@ant-design/icons';
import { toast } from '@/components/Toast';
const OSS = require('ali-oss');

const Home = () => {
  const [embedding, setEmbedding] = useState<string>(example.embedding);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(example.url);
  const [uploading, setUploading] = useState<boolean>(false);

  const learnImg = () => {
    if (loading) return;
    if (url === example.url) {
      toast({
        content: '请先输入图片地址或者上传本地图片！',
        type: 'error'
      })
      return;
    }
    const fileName = uuidv4();
    setLoading(true);
    generateImageEmbeddings({ url, fileName }).then(({ data }: any) => {
      setEmbedding(data.url);
    }).finally(() => {
      setLoading(false);
    })
  }
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <div>
        {loading ? (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute' }}>AI学习图片中...</div>
          </div>
        ) : (
          embedding === example.embedding && url !== example.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" />
          ) : (
            <DisplayImg embedding={embedding} image={url} />
          )
        )}
      </div>
      <div className='mt-8 text-center'>
        <div className='flex items-center mb-6'>
          <input type="text" className='input input-bordered input-primary w-full max-w-xs' placeholder='Input the image link' />
          <button
            className='btn btn-primary relative ml-4'
          >
            <CloudUploadOutlined className='mr-2 text-lg' />
            上传图片
            <input
              multiple={false}
              type="file"
              accept='image/*'
              onChange={async (e) => {
                const file = e.target?.files?.[0];
                const id = uuidv4();
                if (file) {
                  const [_, ext] = file.type.split('/');
                  setUploading(true);
                  const res: any = await getOssCredentials({})
                  const { accessKeyId,
                    accessKeySecret,
                    bucketName,
                    endpoint } = res.data;
                  const client = new OSS({
                    accessKeyId,
                    accessKeySecret,
                    bucket: bucketName,
                    endpoint
                  })
                  client.put('sam/assets/images/' + id + '.' + ext, file).then((result: any) => {
                    setUrl(result.url)
                  }).finally(() => {
                    setUploading(false);
                  })
                }
              }} className="w-full opacity-0 absolute block h-full z-0 cursor-pointer" />
          </button></div>
        <button
          type="button"
          className={`text-sm font-semibold text-gray-800`}
          onClick={learnImg}
        >
          开始AI解图<span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  )
}

export default Home