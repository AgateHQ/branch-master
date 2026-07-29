import Script from "next/script";
import { useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useAxateEnvironment } from "../components/AxateEnvironment";
import "../styles/globals.css";

const theme = createTheme({});

const AXATE_SCRIPTS = {
  staging: "https://wallet-staging.axate.io/bundle.js",
  live: "https://wallet.axate.io/bundle.js",
};

function AppContent({ Component, pageProps }) {
  const { environment } = useAxateEnvironment();
  const [walletStatus, setWalletStatus] = useState("loading");

  return (
    <div className="app-container">
      <Script
        id={`axate-wallet-${environment}`}
        src={AXATE_SCRIPTS[environment]}
        strategy="afterInteractive"
        onLoad={() => setWalletStatus("ready")}
        onError={() => setWalletStatus("unavailable")}
      />
      <p className="wallet-status" role="status" aria-live="polite">
        Axate wallet: {walletStatus}
      </p>
      <Component {...pageProps} />
    </div>
  );
}

export default function MyApp(props) {
  return (
    <MantineProvider theme={theme}>
      <AppContent {...props} />
    </MantineProvider>
  );
}
