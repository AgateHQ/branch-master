import Script from "next/script";
import { useState } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useAxateEnvironment } from "../components/AxateEnvironment";
import "../styles/globals.css";

const theme = createTheme({});

const AXATE_SCRIPTS = {
  staging: "https://wallet-staging.axate.io/1.0.17/bundle.js",
  live: "https://wallet.axate.io/bundle.js",
};

const AXATE_STAGING_INTEGRITY =
  "sha384-z2efofXY+Hbf60NzUF6AZDlrBEcRLYQLSjcmXJyP4k7YxS0BHEewI7aUypXJ9nSe";

function AppContent({ Component, pageProps }) {
  const { environment } = useAxateEnvironment();
  const [walletStatus, setWalletStatus] = useState("loading");

  return (
    <div className="app-container">
      <Script
        id={`axate-wallet-${environment}`}
        src={AXATE_SCRIPTS[environment]}
        integrity={
          environment === "staging" ? AXATE_STAGING_INTEGRITY : undefined
        }
        crossOrigin={environment === "staging" ? "anonymous" : undefined}
        strategy="afterInteractive"
        onLoad={() => setWalletStatus("ready")}
        onError={() => setWalletStatus("unavailable")}
      />
      <p className="wallet-status" role="status" aria-live="polite">
        Axate wallet: {walletStatus}
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
      <AppContent {...props} />
    </MantineProvider>
  );
}
