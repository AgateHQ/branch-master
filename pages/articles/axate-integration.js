import Link from "next/link";
import styles from "../../styles/Article.module.css";

export default function AxateIntegration() {
  const snippet =
    `<!-- Preload and load Axate bundle -->\n` +
    `<link rel="preload" href="https://wallet-staging.axate.io/bundle.js" as="script">\n` +
    `<script src="https://wallet.axate.io/bundle.js"></script>\n\n` +
    `<!-- Axate config -->\n` +
    `<!-- Change .premium below if your CMS uses a different class for premium content -->\n` +
    `<!-- Change .axate-notice if you want to move the in-page notice elsewhere -->\n` +
    `<div id="axate-wallet" data-selector-premium-content=".premium" data-selector-in-page-notice=".axate-notice">\n</div>\n\n` +
    `<!-- Example free content -->\n` +
    `<h1>Example Article Title</h1>\n` +
    `<p class="non-premium">\n  This content is visible to everyone.\n</p>\n\n` +
    `<!-- Premium content section -->\n` +
    `<!-- Only the first 140px will be shown before fading out. Adjust data-premium-height as needed. -->\n` +
    `<!-- Change class name if desired, but remember to update data-selector-premium-content above -->\n` +
    `<div class="article-content premium" data-premium-height="140">\n\n` +
    `  <p>This part is premium and will be faded out after 140px unless the user is entitled.</p>\n` +
    `  <p>More hidden content here...</p>\n` +
    `  <p>Even more hidden content...</p>\n` +
    `  <p>Even more hidden content...</p>\n` +
    `  <p>Even more hidden content...</p>\n` +
    `  <p>Even more hidden content...</p>\n` +
    `</div>\n` +
    `<div class="axate-notice"></div>\n` +
    `<!-- This is where the Axate widget will render the notice (e.g. paywall message) -->\n` +
    `<!-- You can move this anywhere below the script tag, including inside the article if needed -->\n` +
    `<!-- If you change the class, also update data-selector-in-page-notice above -->\n\n` +
    `<p class="non-premium">\n  This content is visible to everyone again\n</p>`;

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backButton}>
        \u2190 Back
      </Link>
      <div className={styles.article}>
        <h1 className={styles.title}>Integrating the Axate Wallet</h1>
        <p style={{ marginBottom: "1rem" }}>
          Use the following snippet to add the Axate wallet to your site:
        </p>
        <pre
          style={{
            overflowX: "auto",
            background: "#f7f7f7",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
          <code>{snippet}</code>
        </pre>
      </div>
    </main>
  );
}
