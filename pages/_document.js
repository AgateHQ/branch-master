import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />

      <body>
        <div
          id="axate-wallet"
          data-selector-premium-content=".premium"
          data-selector-in-page-notice=".axate-notice"
        ></div>
        <div>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
