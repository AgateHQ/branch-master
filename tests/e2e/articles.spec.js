import { expect, test } from "@playwright/test";
import {
  ARTICLE_IMAGE_COUNT,
  articleImageSrc,
  isFreeControlArticle,
} from "../../data/articles";

test("articleImageSrc maps arbitrary ids onto a shipped cover", () => {
  // The article route is reachable for any integer id (the random-article
  // button can produce 0–42690), so the mapping must always land on a cover
  // that actually ships in public/.
  const ids = [0, 1, 2, 9, 10, 11, 30, 42, 300, 42690, 999999, -1, -42690];

  for (const id of ids) {
    const match = /^\/article-(\d+)\.webp$/.exec(articleImageSrc(id));
    expect(match, `cover for id ${id}`).not.toBeNull();
    const index = Number(match[1]);
    expect(index, `index for id ${id}`).toBeGreaterThanOrEqual(0);
    expect(index, `index for id ${id}`).toBeLessThan(ARTICLE_IMAGE_COUNT);
  }
});

test("only the configured article is a free control", () => {
  expect(isFreeControlArticle(6)).toBe(true);
  expect(isFreeControlArticle(1)).toBe(false);
  expect(isFreeControlArticle(2)).toBe(false);
});
