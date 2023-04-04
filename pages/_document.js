import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />

      <body className="bg-white">
        <div
          id="axate-wallet"
          data-selector-premium-content=".premium"
          data-selector-in-page-notice=".axate-notice"
        ></div>

        <div className="container mx-auto">
          <Main />
          <NextScript />
        </div>
      </body>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </Html>
  );
}
