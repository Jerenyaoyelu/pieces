import dynamic from "next/dynamic";

const Home = dynamic(() => import('@/routes/Home'), { ssr: false })

export default Home;
