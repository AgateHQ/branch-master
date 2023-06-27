import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from 'react';
import SelectEnviroment from "./components/SelectEnviroment";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Branch Master - Axate Testing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to Branch Master</h1>

        <SelectEnviroment/>

        <p>
          Current Version: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}
        </p>
        <div className="premium">
          <div className={styles.grid}>
            {Array.from({ length: 10 }, (_, index) => (
              <a href={`/articles/${index + 1}`} className={styles.card}>
                <h3>Article {index + 1} &rarr;</h3>
                <p>Find in-depth here...</p>
              </a>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          color: #0070f3;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>
    </div>
  );
}
