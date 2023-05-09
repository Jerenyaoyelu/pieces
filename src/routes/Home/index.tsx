import { generateImageEmbeddings, getDetails, getOssCredentials } from '@/request';
import { ChangeEvent, SetStateAction, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';
import { example, isProduction } from '@/components/constant';
import { CloudUploadOutlined } from '@ant-design/icons';
import { toast } from '@/components/Toast';
import Image from 'next/image';
import { Loading } from '@/components/Loading';
import { convertImageFileToBase64 } from '@/utils/clientUtil';

const Home = () => {
  const [embedding, setEmbedding] = useState<string>(example.embedding);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(example.url);

  const learnImg = () => {
    if (loading) return;
    if (url === example.url) {
      toast({
        content: '请先上传本地图片！',
        type: 'error'
      })
      return;
    }
    const fileName = uuidv4();
    setLoading(true);
    generateImageEmbeddings({ url: url.split(',')[1], fileName }).then(({ data }: any) => {
      setEmbedding(data.url);
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
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
        <button
          className='btn btn-primary relative mr-4'
          onClick={() => {
            if (isProduction) {
              toast({
                content: "sorry, netlify doesn't support python script, so upload is only available locally",
              })
            }
          }}
        >
          <CloudUploadOutlined className='mr-2 text-lg' />
          上传图片
          <input
            multiple={false}
            type="file"
            accept='image/*'
            onChange={handleUpload}
            className={`w-full opacity-0 absolute block h-full z-0 cursor-pointer ${isProduction ? 'pointer-events-none' : ''}`}
          />
        </button>
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