import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "selectedEnvironment";
const LEGACY_STORAGE_KEY = "selectedEnviroment";
const DEFAULT_ENVIRONMENT = "staging";
const VALID_ENVIRONMENTS = new Set(["staging", "live"]);

function readStoredEnvironment() {
  const storedEnvironment =
    window.localStorage.getItem(STORAGE_KEY) ||
    window.localStorage.getItem(LEGACY_STORAGE_KEY);

  return VALID_ENVIRONMENTS.has(storedEnvironment)
    ? storedEnvironment
    : DEFAULT_ENVIRONMENT;
}

function subscribeToStorage(callback) {
  const legacyEnvironment = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (VALID_ENVIRONMENTS.has(legacyEnvironment)) {
    window.localStorage.setItem(STORAGE_KEY, legacyEnvironment);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }

  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useAxateEnvironment() {
  const environment = useSyncExternalStore(
    subscribeToStorage,
    readStoredEnvironment,
    () => DEFAULT_ENVIRONMENT,
  );

  const selectEnvironment = useCallback(
    (nextEnvironment) => {
      if (!VALID_ENVIRONMENTS.has(nextEnvironment)) {
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, nextEnvironment);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);

      if (nextEnvironment !== environment) {
        window.location.reload();
      }
    },
    [environment],
  );

  return { environment, selectEnvironment };
}

const WalletContext = createContext(null);
const VERSION_KEY = "selectedStagingVersion";

export function AxateWalletProvider({ children }) {
  const { environment } = useAxateEnvironment();
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState(false);
  const version = useSyncExternalStore(
    subscribeToStorage,
    () => window.localStorage.getItem(VERSION_KEY) || "latest",
    () => "latest",
  );
  const hydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false,
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/axate-versions", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Manifest unavailable");
        return response.json();
      })
      .then(setManifest)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);

  const release = manifest?.releases.find(
    (release) =>
      release.version ===
      (version === "latest" ? manifest.recommendedVersion : version),
  );
  const unavailable = error || (manifest && !release);
  const script =
    hydrated &&
    (environment === "live"
      ? { url: "https://wallet.axate.io/bundle.js" }
      : release);

  function selectVersion(nextVersion) {
    if (
      nextVersion !== "latest" &&
      !manifest?.releases.some((release) => release.version === nextVersion)
    )
      return;
    window.localStorage.setItem(VERSION_KEY, nextVersion);
    window.location.reload();
  }

  return (
    <WalletContext.Provider
      value={{
        manifest,
        version,
        selectVersion,
        script,
        unavailable: environment === "staging" && unavailable,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useAxateWallet() {
  return useContext(WalletContext);
}
