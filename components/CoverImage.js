import Image from "next/image";
import styles from "../styles/CoverImage.module.css";

/**
 * A fixed-height, cover-cropped image frame backed by next/image.
 *
 * Replaces the old `background: url(...) center/cover` div pattern. The frame
 * takes its height from the `className` you pass in; the image fills it and
 * crops with `object-fit: cover`. Because the frame is a real positioned
 * element, next/image can emit a responsive `srcset` and lazy-load the image.
 *
 * Pass `style` to paint a background behind the image (used by the article
 * hero, which falls back to a gradient while the image loads).
 *
 * LCP hints: `preload` inserts a <link rel="preload"> in the head and replaces
 * the `priority` prop that Next.js 16 deprecated. Reach for it only when the
 * image src is stable across the server render and hydration. If the src
 * changes after hydration — which it does on the article pages, see the note in
 * AGENTS.md — use `eager` + `fetchPriority` instead, so a wasted preloaded
 * request is not guaranteed.
 */
export default function CoverImage({
  src,
  alt,
  sizes,
  className = "",
  preload = false,
  eager = false,
  fetchPriority,
  style,
}) {
  const frameClassName = [styles.frame, className].filter(Boolean).join(" ");

  return (
    <div className={frameClassName} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={eager ? "eager" : undefined}
        fetchPriority={fetchPriority}
        className={styles.image}
      />
    </div>
  );
}
