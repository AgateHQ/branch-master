import CoverImage from "./CoverImage";
import styles from "../styles/ArticleCard.module.css";

const NORMAL_CARD_SIZES =
  "(max-width: 639px) calc(100vw - 32px), (max-width: 959px) calc((100vw - 94px) / 2), (max-width: 1263px) calc((100vw - 124px) / 3), 380px";
const FEATURED_CARD_SIZES =
  "(max-width: 639px) calc(100vw - 32px), (max-width: 1263px) calc((100vw - 94px) / 2), 585px";

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
    <a href={article.href} className={className}>
      <CoverImage
        src={article.image}
        alt=""
        className={imageClassName}
        sizes={article.isFeatured ? FEATURED_CARD_SIZES : NORMAL_CARD_SIZES}
        preload={preload}
      />
      <div className={styles.body}>
        <div className={styles.eyebrow}>
          <span>{article.category}</span>
          {article.isFeatured && (
            <span className={styles.featuredLabel}>Featured</span>
          )}
        </div>
        <h3 className={titleClassName}>{article.title}</h3>
        <p className={styles.blurb}>{article.blurb}</p>
      </div>
    </a>
  );
}
