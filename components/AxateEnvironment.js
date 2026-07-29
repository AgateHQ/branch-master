import { useCallback, useSyncExternalStore } from "react";

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
