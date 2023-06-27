import Script from "next/script";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function MyApp({ Component, pageProps }) {

  const [enviroment, setEnviroment] = useState('');
  const [localStorageReady, setLocalStorageReady] = useState(false);


  let axateScriptStaging = "https://wallet-staging.axate.io/bundle.js";
  let axateScriptLive = "https://wallet.axate.io/bundle.js";

  useEffect(() => {
    const storedValue = localStorage.getItem('selectedEnviroment');
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
          <Script src={enviroment === 'live' ? axateScriptLive : axateScriptStaging}/>
          <Component {...pageProps} />
    </>

  );
}
