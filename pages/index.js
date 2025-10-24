import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import SelectEnviroment from "./components/SelectEnviroment";

export default function Home() {
  // Vivid poetic lines inspired by John Keats
  const keatsLines = [
    "A thing of beauty is a joy forever, its loveliness increases; it will never pass into nothingness.",
    "Bright star, would I were steadfast as thou art—still, still to hear her tender-taken breath.",
    "Heard melodies are sweet, but those unheard are sweeter, drifting on the air of dreams.",
    "Season of mists and mellow fruitfulness, close bosom-friend of the maturing sun.",
    "O for a draught of vintage! that hath been cooled a long age in the deep-delved earth.",
    "The poetry of earth is ceasing never, in the hush of night or the song of summer.",
    "My heart aches, and a drowsy numbness pains my sense, as though of hemlock I had drunk.",
    "There is a budding morrow in midnight, and a silver silence in the dawn.",
    "Softly the evening came with the sunset, trailing her garments of light.",
    "Beauty is truth, truth beauty,—that is all ye know on earth, and all ye need to know.",
    "The silver moon, fair queen of the night, glides in beauty through the sky.",
    "Upon the shore of the wide world I stand alone, and think till love and fame to nothingness do sink.",
    "Ode to a nightingale, sing on in ecstasy, beyond the shadows of the world.",
    "Tender is the night, and haply the dawn, with dewy freshness on the lawn.",
    "The murmurous haunt of flies on summer eves, where poppies nod in drowsy dreams.",
    "Where youth grows pale, and spectre-thin, and dies, where but to think is to be full of sorrow.",
    "The voice I hear this passing night was heard in ancient days by emperor and clown.",
    "Magic casements, opening on the foam of perilous seas, in faery lands forlorn.",
    "The sedge has withered from the lake, and no birds sing, save the melancholy owl.",
    "Thou foster-child of silence and slow time, sylvan historian, who canst thus express a flowery tale.",
    "With beaded bubbles winking at the brim, and purple-stained mouth.",
    "The sun, the moon, the stars, the seas, the hills and the plains, are all the poetry of earth.",
    "A flowery tale more sweetly than our rhyme, told in soft whispers of the wind.",
    "The grass, the thicket, and the fruit-tree wild, white hawthorn and the pastoral eglantine.",
    "The coming musk-rose, full of dewy wine, the murmurous haunt of flies on summer eves.",
    "The blissful cloud of summer-indolence floats on the blue sky’s deep expanse.",
    "The music yearning like a God in pain, sweet as the nightingale’s refrain.",
    "The world is full of troubles, and anxious in its sleep, yet beauty weaves a golden thread.",
    "The moonlight sleeps upon this bank, and the wind stirs the dreaming leaves.",
    "A drowsy numbness pains my sense, as though of hemlock I had drunk, or emptied some dull opiate to the drains.",
  ];
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
        {/* Hero Article with vivid Keatsian line */}
        {(() => {
          const heroLine =
            keatsLines[Math.floor(Math.random() * keatsLines.length)];
          return (
            <Link href="/articles/1" className={styles.heroArticle}>
              {(() => {
                const heroImgNum = Math.floor(Math.random() * 10);
                const heroImgSrc = `/${heroImgNum}.png`;
                return (
                  <div
                    className={styles.heroImage}
                    style={{ background: `url(${heroImgSrc}) center/cover no-repeat` }}
                  />
                );
              })()}
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "2.1rem",
                  color: "#3a2c1a",
                  margin: "0.5rem 0 0.25rem 0",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(255,255,255,0.15)",
                  padding: "0 1rem",
                }}
              >
                Article #1
              </h2>
              <p style={{ fontStyle: "italic", color: "#444" }}>{heroLine}</p>
            </Link>
          );
        })()}

        <div
          className={styles.ads}
          style={{
            fontStyle: "italic",
            color: "#7a5c2e",
            textAlign: "center",
            fontFamily: "Georgia, serif",
            fontSize: "1.1rem",
          }}
        >
          "In the garden of commerce, bright banners bloom—whispers of want in
          the marketplace of dreams."
        </div>

        <div className={styles.grid}>
          <Link href="/articles/axate-integration" className={styles.card}>
            <div
              className={styles.cardImage}
              style={{ background: 'url(/ai.png) center/cover no-repeat' }}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Axate Wallet Integration</h3>
              <p className={styles.cardDescription}>
                Learn how to embed the Axate wallet.
              </p>
            </div>
          </Link>
          {Array.from({ length: 29 }, (_, index) => {
            // Cycle through gradients deterministically to maintain
            // consistent colors across renders. Index 0 is used by the hero
            // article, so start cycling from the second gradient.
            const gradientNum = (index % (gradients.length - 1)) + 1;
            const articleNum = index + 2;
            const isLarge = index % 7 === 0;
            // Pick a vivid poetic line for each card
            const poeticLine =
              keatsLines[Math.floor(Math.random() * keatsLines.length)];
            return (
              <Link
                href={`/articles/${articleNum}`}
                className={`${styles.card} ${isLarge ? styles.cardLarge : ""}`}
                key={articleNum}
              >
                {(() => {
                  // Use the last digit of the article number for the image
                  const lastDigit = articleNum % 10;
                  const imgSrc = `/${lastDigit}.png`;
                  return (
                    <div
                      className={`${styles.cardImage} ${isLarge ? styles.cardLargeImage : ""}`}
                      style={{
                        background: `url(${imgSrc}) center/cover no-repeat`,
                      }}
                    />
                  );
                })()}
                <div style={{ textAlign: "center" }}>
                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: isLarge ? "2.1rem" : "1.35rem",
                      color: "#3a2c1a",
                      margin: "0.5rem 0 0.25rem 0",
                      letterSpacing: "0.5px",
                      textShadow: "0 1px 2px rgba(255,255,255,0.15)",
                      padding: "0 1rem 0 1rem",
                    }}
                  >
                    Article #{articleNum}
                  </h3>
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#444",
                      padding: "0.5rem 1rem 1rem 1rem",
                      margin: 0,
                    }}
                  >
                    {poeticLine}
                  </p>
                </div>
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
