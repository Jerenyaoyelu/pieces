import { generateImageEmbeddings, getDetails, getOssCredentials } from '@/request';
import { ChangeEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';
import { example } from '@/components/constant';
import { CloudUploadOutlined } from '@ant-design/icons';
import { toast } from '@/components/Toast';
import Image from 'next/image';
import { Loading } from '@/components/Loading';
import { convertImageFileToBase64 } from '@/utils/clientUtil';

const Home = () => {
  const [embedding, setEmbedding] = useState<string>(example.embedding);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(example.url);
  const type = useRef<ImageSourceType>('link');

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
    generateImageEmbeddings({ url: type.current === 'local' ? url.split(',')[1] : url, fileName, type: type.current }).then(({ data }: any) => {
      setEmbedding(data.url);
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      type.current = 'local';
      convertImageFileToBase64(file).then((base64) => {
        setUrl(base64);
      })
    }
  }

  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <div className='relative'>
        {loading && (
          <Loading text='AI学习图片中...' />
        )}
        {
          embedding === example.embedding && url !== example.url ? (
            <Image src={url} alt="" width={860} height={500} />
          ) : (
            <DisplayImg embedding={embedding} image={url} />
          )
        }
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
              onChange={handleUpload}
              className="w-full opacity-0 absolute block h-full z-0 cursor-pointer"
            />
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