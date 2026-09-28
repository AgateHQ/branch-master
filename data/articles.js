// Single source of truth for the synthetic article catalogue.
//
// To add, remove, or re-order an article, edit the data below. The index page,
// the article page, and the structured data all derive from it.

// Vivid poetic lines inspired by John Keats, used as card blurbs.
export const KEATS_LINES = [
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

// How many cover images ship in public/ as article-0.webp … article-9.webp.
export const ARTICLE_IMAGE_COUNT = 10;

// Number of articles in the catalogue. Ids run 1 … ARTICLE_COUNT.
export const ARTICLE_COUNT = 30;

// The article pinned as the large hero at the top of the index.
export const HERO_ARTICLE_ID = 1;

// Ids that render as double-width cards in the index grid.
export const FEATURED_ARTICLE_IDS = new Set([2, 9, 16, 23, 30]);

export const AXATE_LOGO_SRC = "/axate-logo.webp";

/**
 * Map any article id to one of the cover images in public/.
 *
 * This is safe for ids outside the catalogue range: the article page is
 * reachable for any positive id (see the "Go to a Random Article" button),
 * and the double modulo keeps the result a valid index for negative ids too.
 */
export function articleImageSrc(id) {
  const index =
    (((id - 1) % ARTICLE_IMAGE_COUNT) + ARTICLE_IMAGE_COUNT) %
    ARTICLE_IMAGE_COUNT;
  return `/article-${index}.webp`;
}

export const ARTICLES = Array.from({ length: ARTICLE_COUNT }, (_, index) => {
  const id = index + 1;
  return {
    id,
    href: `/articles/${id}`,
    title: `Article #${id}`,
    blurb: KEATS_LINES[index % KEATS_LINES.length],
    image: articleImageSrc(id),
    isHero: id === HERO_ARTICLE_ID,
    isFeatured: FEATURED_ARTICLE_IDS.has(id),
  };
});

export const HERO_ARTICLE =
  ARTICLES.find((article) => article.isHero) ?? ARTICLES[0];

export const GRID_ARTICLES = ARTICLES.filter((article) => !article.isHero);

export const INTEGRATION_CARD = {
  href: "/articles/axate-integration",
  title: "Axate Wallet Integration",
  blurb: "Learn how to embed the Axate wallet.",
  image: AXATE_LOGO_SRC,
};
