import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import SelectEnviroment from "./components/SelectEnviroment";

export default function Home() {
  // Gradient palette used for article images
  const gradients = [
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
    "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #faaca8 0%, #ddd6f3 100%)",
    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
    "linear-gradient(135deg, #ef32d9 0%, #89fffd 100%)",
    "linear-gradient(135deg, #b224ef 0%, #7579ff 100%)",
    "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
    "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
    "linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)",
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Branch Master News</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <header
        className={styles.header}
        style={{
          background: "#fff",
          padding: "2rem 0 1.5rem 0",
          borderBottom: "1px solid #e5e5e5",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 700,
                fontSize: "3rem",
                letterSpacing: "1px",
                margin: 0,
                color: "#222",
              }}
            >
              Branch Master News
            </h1>
            <hr
              style={{
                width: "60px",
                border: "none",
                borderTop: "2px solid #222",
                margin: "1rem 0 0.5rem 0",
              }}
            />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.15rem",
                color: "#555",
                margin: 0,
                letterSpacing: "0.5px",
                fontStyle: "italic",
              }}
            >
              A new chapter in digital storytelling.
            </p>
          </div>
          <div>
            <SelectEnviroment />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Link href="/articles/1" className={styles.heroArticle}>
          <div
            className={styles.heroImage}
            style={{ background: gradients[0] }}
          />
          <h2>Article #1</h2>
          <p>Find in-depth here...</p>
        </Link>

        <div className={styles.ads}>Ads Ads Ads</div>

        <div className={styles.grid}>
          {Array.from({ length: 29 }, (_, index) => {
            // Cycle through gradients deterministically to maintain
            // consistent colors across renders. Index 0 is used by the hero
            // article, so start cycling from the second gradient.
            const gradientNum = (index % (gradients.length - 1)) + 1;
            const articleNum = index + 2;
            return (
              <Link
                href={`/articles/${articleNum}`}
                className={styles.card}
                key={articleNum}
              >
                <div
                  className={styles.cardImage}
                  style={{
                    width: "100%",
                    height: "160px",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    background: gradients[gradientNum],
                  }}
                />
                <h3>Article #{articleNum}</h3>
                <p>Find in-depth here...</p>
              </Link>
            );
          })}
        </div>

        <p className={styles.version}>
          Current Version: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}
        </p>
      </main>
    </div>
  );
}
