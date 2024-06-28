import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          href="https://wallet-staging.axate.io/bundle.js"
          as="script"
        />
      </Head>
      <body>
        <div
          id="axate-wallet"
          data-selector-premium-content=".premium"
          data-selector-in-page-notice=".axate-notice"
          data-selector-disable-hide="true"
        ></div>
        <div>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
