import Head from "next/head";
import styles from "../styles/Home.module.css";
import SelectEnvironment from "../components/SelectEnvironment";
import HeroArticle from "../components/HeroArticle";
import ArticleCard from "../components/ArticleCard";
import {
  GRID_ARTICLES,
  HERO_ARTICLE,
  INTEGRATION_CARD,
} from "../data/articles";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Branch Master News</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <header className={styles.header}>
        <div className={`${styles.headerRow} ${styles.shell}`}>
          <div className={styles.brand}>
            <p className={styles.kicker}>Stories for curious minds</p>
            <h1 className={styles.title}>Branch Master News</h1>
            <p className={styles.tagline}>
              A new chapter in digital storytelling.
            </p>
          </div>
          <div className={styles.environment}>
            <span className={styles.environmentLabel}>Wallet environment</span>
            <SelectEnvironment />
          </div>
        </div>
      </header>

      <main className={`${styles.main} ${styles.shell}`}>
        <section aria-label="Lead story">
          <HeroArticle article={HERO_ARTICLE} />
        </section>

        <div className={styles.ads}>
          <span className={styles.adLabel}>Advertisement</span>
          <p>
            &quot;In the garden of commerce, bright banners bloom—whispers of
            want in the marketplace of dreams.&quot;
          </p>
        </div>

        <section className={styles.latest} aria-labelledby="latest-heading">
          <div className={styles.sectionHeading}>
            <h2 id="latest-heading">Latest stories</h2>
            <span>More from Branch Master</span>
          </div>
          <div className={styles.grid}>
            <ArticleCard article={INTEGRATION_CARD} />
            {GRID_ARTICLES.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.version}>
            Current Version: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}
          </p>
        </footer>
      </main>
    </div>
  );
}
