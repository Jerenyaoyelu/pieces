import { generateImageEmbeddings } from '@/request';
import { useEffect } from 'react';
const url = 'https://s.newscdn.cn/file/2023/04/f216f82d-4d11-407e-9bfd-2ee479323429.jpeg';

const Home = () => {

  useEffect(() => {
    generateImageEmbeddings(url).then((res) => {
      console.log(res);

    })
  }, [])
  return (
    <div>
      main
    </div>
  )
}

export default Home