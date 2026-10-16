import Head from "next/head";
import ArticleCard from "../components/ArticleCard";
import SelectEnvironment from "../components/SelectEnvironment";
import { CHRISTMAS_EDITION_ARTICLES, INTEGRATION_CARD } from "../data/articles";
import styles from "../styles/Home.module.css";

/**
 * Render the dedicated Christmas edition article listing.
 *
 * @returns {JSX.Element} The Christmas edition page.
 */
export default function ChristmasEdition() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Christmas 2026 edition | Branch Master News</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <header className={styles.header}>
        <div className={`${styles.headerRow} ${styles.shell}`}>
          <nav className={styles.navigation} aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/#latest-heading">Latest stories</a>
            <a href="/christmas" aria-current="page">
              Christmas edition
            </a>
            <a href={INTEGRATION_CARD.href}>Install Axate</a>
            <a href="/staticrypt">Encrypt HTML</a>
          </nav>
          <div className={styles.environment}>
            <span className={styles.environmentLabel}>Wallet</span>
            <SelectEnvironment />
          </div>
        </div>
        <div className={`${styles.brand} ${styles.shell}`}>
          <h1 className={styles.title}>Christmas 2026 edition</h1>
          <p className={styles.tagline}>
            Every story from this year&apos;s festive collection.
          </p>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className={`${styles.main} ${styles.shell}`}
      >
        <section className={styles.latest} aria-labelledby="edition-heading">
          <div className={styles.sectionHeading}>
            <h2 id="edition-heading">Christmas edition stories</h2>
            <span>{CHRISTMAS_EDITION_ARTICLES.length} articles</span>
          </div>
          <div className={styles.grid}>
            {CHRISTMAS_EDITION_ARTICLES.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <a href="/">Branch Master News</a>
        </footer>
      </main>
    </div>
  );
}
