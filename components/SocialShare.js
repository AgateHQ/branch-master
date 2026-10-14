import styles from "../styles/SocialShare.module.css";

function SocialShare({ articleUrl }) {
  if (!articleUrl) return null;

  const shareData = {
    title: `Paywall Implementation Playbook`,
    url: articleUrl,
    text: "Practical guidance for configuring, testing, and maintaining a sustainable digital paywall experience.",
  };

  const shareToClipboard = async () => {
    navigator.clipboard.writeText(shareData.url);
  };

  const shareTargets = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareData.url,
      )}&text=${encodeURIComponent(shareData.title)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareData.url,
      )}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareData.url,
      )}&title=${encodeURIComponent(shareData.title)}`,
    },
    {
      label: "Mastodon",
      href: `https://mastodon.social/share?uri=${encodeURIComponent(
        shareData.url,
      )}`,
    },
  ];

  return (
    <section className={styles.section} aria-label="Share article">
      <h2 className={styles.heading}>Share this article</h2>
      <div className={styles.actions}>
        {shareTargets.map((target) => (
          <a
            key={target.label}
            className={styles.action}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {target.label}
          </a>
        ))}
        <button
          type="button"
          className={styles.action}
          onClick={shareToClipboard}
        >
          Copy link
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            if (navigator.share) {
              navigator.share(shareData);
            } else {
              shareToClipboard();
            }
          }}
        >
          More
        </button>
      </div>
    </section>
  );
}

export default SocialShare;
