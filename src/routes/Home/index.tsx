import { generateImageEmbeddings } from '@/request';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';
import { example } from '@/components/constant';
import {
  ArrowUpOnSquareIcon,
} from '@heroicons/react/20/solid'

const Home = () => {
  const [embedding, setEmbedding] = useState<string>(example.embedding);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(example.url);

  const learnImg = () => {
    if (url === example.url || loading) return;
    const filename = uuidv4();
    setLoading(true);
    generateImageEmbeddings(url, filename).then(({ data }: any) => {
      setEmbedding(data.url);
    }).finally(() => {
      setLoading(false);
    })
  }
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      {loading ? (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute' }}>AI学习图片中...</div>
        </div>
      ) : (
        <DisplayImg embedding={embedding} image={url} />
      )}
      <div className='mt-8'>
        <button
          type="button"
          className="w-auto mr-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span onClick={() => {
            alert('sorry, this feature is coming soon')
          }} className='flex items-center'>
            <ArrowUpOnSquareIcon className='w-4 h-4 mr-1' />
            上传图片
          </span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
        </button>
        <button
          type="button"
          className={`text-sm font-semibold text-gray-800 ${url === example.url ? 'cursor-not-allowed' : ''}`}
          onClick={learnImg}
        >
          开始AI解图<span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  )
}

export default Home