import Script from "next/script";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    /** Put your mantine theme override here */
  });

  const [enviroment, setEnviroment] = useState("");
  const [localStorageReady, setLocalStorageReady] = useState(false);

  let axateScriptStaging = "https://wallet-staging.axate.io/bundle.js";
  let axateScriptLive = "https://wallet.axate.io/bundle.js";
  let axateScriptLocal = "http://localhost:3000/bundle.js";

  useEffect(() => {
    const storedValue = localStorage.getItem("selectedEnviroment");
    if (storedValue) {
      setEnviroment(storedValue);
    }
    setLocalStorageReady(true);
  }, []);

  console.log(enviroment);

  if (!localStorageReady) {
    return <div>Loading Branch Master...</div>;
  }

  return (
    <>
      <MantineProvider theme={theme}>
        <div className="light-wrapper">
          <Script
            src={enviroment === "live" ? axateScriptLive : axateScriptStaging}
          />
          <Component {...pageProps} />
        </div>
      </MantineProvider>
    </>
  );
}
