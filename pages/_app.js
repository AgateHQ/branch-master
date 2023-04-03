import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://wallet-staging.axate.io/bundle.js" />
      <Component {...pageProps} />
    </>
  )
}