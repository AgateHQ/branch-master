import Link from "next/link";
import CoverImage from "./CoverImage";
import styles from "../styles/ArticleCard.module.css";

const NORMAL_CARD_SIZES = "(max-width: 600px) 100vw, 304px";
const FEATURED_CARD_SIZES = "(max-width: 600px) 100vw, 632px";

/**
 * One card in the index grid.
 *
 * Accepts anything shaped like an entry from `data/articles.js`, so the regular
 * article cards and the Axate integration card share this component.
 */
export default function ArticleCard({ article, preload = false }) {
  const className = [styles.card, article.isFeatured ? styles.featured : ""]
    .filter(Boolean)
    .join(" ");

  const imageClassName = [
    styles.image,
    article.isFeatured ? styles.imageFeatured : "",
  ]
    .filter(Boolean)
    .join(" ");
  const titleClassName = [
    styles.title,
    article.isFeatured ? styles.titleFeatured : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={article.href} className={className}>
      <CoverImage
        src={article.image}
        alt=""
        className={imageClassName}
        sizes={article.isFeatured ? FEATURED_CARD_SIZES : NORMAL_CARD_SIZES}
        preload={preload}
      />
      <div className={styles.body}>
        <h3 className={titleClassName}>{article.title}</h3>
        <p className={styles.blurb}>{article.blurb}</p>
      </div>
    </Link>
  );
}
