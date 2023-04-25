import { generateImageEmbeddings } from '@/request';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DisplayImg from '@/components/DisplayImage';

const url = 'https://s.newscdn.cn/file/2023/04/f216f82d-4d11-407e-9bfd-2ee479323429.jpeg';

const Home = () => {
  const [embedding, setEmbedding] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const filename = uuidv4();
    setLoading(true);
    generateImageEmbeddings(url, filename).then((res) => {
      setEmbedding('/scripts/npy/' + filename + '.npy')
    }).finally(() => {
      setLoading(false);
    })
  }, [])
  return (
    <div>
      {loading ? (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute' }}>AI学习图片中...</div>
          <img src={url} alt="" />
        </div>
      ) : (
        <DisplayImg embedding={embedding} image={url} />
      )}
    </div>
  )
}

export default Home