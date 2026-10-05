export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  try {
    const response = await fetch(
      "https://wallet-staging.axate.io/versions.json",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) throw new Error("Manifest unavailable");
    const manifest = await response.json();
    if (
      manifest.schemaVersion !== 1 ||
      !Array.isArray(manifest.releases) ||
      !manifest.releases.length ||
      !manifest.releases.every(
        (release) =>
          /^\d+\.\d+\.\d+$/.test(release.version) &&
          release.url ===
            `https://wallet-staging.axate.io/${release.version}/bundle.js` &&
          /^sha384-[A-Za-z0-9+/]{64}$/.test(release.integrity),
      ) ||
      !manifest.releases.some(
        (release) => release.version === manifest.recommendedVersion,
      )
    ) {
      throw new Error("Invalid manifest");
    }
    return res.status(200).json(manifest);
  } catch {
    return res
      .status(502)
      .json({ error: "Staging wallet versions unavailable" });
  }
}
