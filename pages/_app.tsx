import 'nextra-theme-blog/style.css'
import type { AppProps } from 'next/app'
import { Layout } from 'nextra-theme-blog'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

