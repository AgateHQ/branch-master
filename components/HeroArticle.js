import Link from "next/link";
import CoverImage from "./CoverImage";
import styles from "../styles/Home.module.css";

/** The compact pinned article at the top of the index. */
export default function HeroArticle({ article }) {
  return (
    <Link href={article.href} className={styles.heroArticle}>
      <CoverImage
        src={article.image}
        alt=""
        className={styles.heroImage}
        sizes="(max-width: 639px) 88px, 240px"
        preload
      />
      <div className={styles.heroCopy}>
        <span className={styles.heroEyebrow}>Lead story</span>
        <h2 className={styles.heroTitle}>{article.title}</h2>
        <p className={styles.heroBlurb}>{article.blurb}</p>
        <span className={styles.readStory}>Read story</span>
      </div>
    </Link>
  );
}
