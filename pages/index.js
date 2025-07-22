import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import SelectEnviroment from "./components/SelectEnviroment";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Branch Master News</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Branch Master News</h1>
        <p className={styles.tagline}>A modern publishing demo</p>
      </header>

      <main className={styles.main}>
        <SelectEnviroment />

        <div className={styles.grid}>
          {Array.from({ length: 10 }, (_, index) => (
            <Link
              href={`/articles/${index + 1}`}
              className={styles.card}
              key={index}
            >
              <img src="/bg.jpg" alt="" className={styles.cardImage} />
              <h3>Article #{index + 1}</h3>
              <p>Find in-depth here...</p>
            </Link>
          ))}
        </div>

        <p className={styles.version}>
          Current Version: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}
        </p>
      </main>
    </div>
  );
}
