import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ImgContextProvider from "../components/hooks/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ImgContextProvider>
      <Component {...pageProps} />
    </ImgContextProvider>
  )
}
