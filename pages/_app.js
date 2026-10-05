import Script from "next/script";
import { useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  AxateWalletProvider,
  useAxateWallet,
  useAxateEnvironment,
} from "../components/AxateEnvironment";
import "../styles/globals.css";

const theme = createTheme({});

function AppContent({ Component, pageProps }) {
  const { environment } = useAxateEnvironment();
  const { script, unavailable } = useAxateWallet();
  const [walletStatus, setWalletStatus] = useState("loading");

  return (
    <div className="app-container">
      {script && (
        <Script
          id={`axate-wallet-${environment}`}
          src={script.url}
          integrity={script.integrity}
          crossOrigin={environment === "staging" ? "anonymous" : undefined}
          strategy="afterInteractive"
          onLoad={() => setWalletStatus("ready")}
          onError={() => setWalletStatus("unavailable")}
        />
      )}
      <p className="wallet-status" role="status" aria-live="polite">
        Axate wallet:{" "}
        {unavailable
          ? "staging version unavailable — reload to retry or select Latest"
          : walletStatus}
      </p>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Component {...pageProps} />
    </div>
  );
}

export default function MyApp(props) {
  return (
    <MantineProvider theme={theme}>
      <AxateWalletProvider>
        <AppContent {...props} />
      </AxateWalletProvider>
    </MantineProvider>
  );
}
