import Script from "next/script";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const axateScript = router.query.live
    ? "https://wallet.axate.io/bundle.js"
    : "https://wallet-staging.axate.io/bundle.js";

  return (
    <>
      <Script src={axateScript} />
      <Component {...pageProps} />
    </>
  );
}
