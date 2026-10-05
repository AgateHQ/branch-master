import { useAxateWallet, useAxateEnvironment } from "./AxateEnvironment";

const options = [
  { value: "staging", label: "Staging" },
  { value: "live", label: "Live" },
];

export default function SelectEnvironment() {
  const { environment, selectEnvironment } = useAxateEnvironment();

  const { manifest, version, selectVersion } = useAxateWallet();

  return (
    <>
      <label>
        <span className="visually-hidden">Axate environment</span>
        <select
          aria-label="Axate environment"
          value={environment}
          onChange={(event) => selectEnvironment(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {environment === "staging" && (
        <label>
          <span className="visually-hidden">Axate staging version</span>
          <select
            aria-label="Axate staging version"
            value={version}
            onChange={(event) => selectVersion(event.target.value)}
          >
            <option value="latest">
              Latest{manifest ? ` (${manifest.recommendedVersion})` : ""}
            </option>
            {version !== "latest" &&
              !manifest?.releases.some(
                (release) => release.version === version,
              ) && <option value={version}>{version} (unavailable)</option>}
            {manifest?.releases
              .slice()
              .reverse()
              .map((release) => (
                <option key={release.version} value={release.version}>
                  {release.version}
                </option>
              ))}
          </select>
        </label>
      )}
    </>
  );
}
