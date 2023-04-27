import { generateImageEmbeddings } from '@/request';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';
import { example } from '@/components/constant';

const Home = () => {
  const [embedding, setEmbedding] = useState<string>(example.embedding);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(example.url);

  const learnImg = () => {
    const filename = uuidv4();
    setLoading(true);
    generateImageEmbeddings(url, filename).then(({ data }: any) => {
      setEmbedding(data.url);
    }).finally(() => {
      setLoading(false);
    })
  }
  return (
    <div>
      <button className='bg-gray-400' onClick={learnImg}>开始AI学习图片</button>
      {loading ? (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute' }}>AI学习图片中...</div>
        </div>
      ) : (
        <DisplayImg embedding={embedding} image={url} />
      )}
    </div>
  )
}

export default Home