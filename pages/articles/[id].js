import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Text, Paper, Image } from "@mantine/core";

const DEFAULT_SITE_ORIGIN = "https://branchmaster.news";
const ARTICLE_DESCRIPTION =
  "Practical guidance for configuring, testing, and maintaining a sustainable digital paywall experience.";
const PUBLISHER_NAME = "Branch Master News";
const AUTHOR_NAME = "Branch Master Editorial Team";

function subscribeToLocation() {
  return () => {};
}

function useBrowserUrl() {
  return useSyncExternalStore(
    subscribeToLocation,
    () => window.location.href,
    () => "",
  );
}

function Article() {
  // Handler for random article navigation
  const goToRandomArticle = () => {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const randomId = randomValues[0] % 42691;
    router.push(`/articles/${randomId}`);
  };
  const router = useRouter();

  const articleUrl = useBrowserUrl();
  const premiumHeights = [750, 1000, 2000, 300];

  const gradients = [
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  ];

  const articleId = parseInt(router.query.id || "1", 10);
  const safeArticleId =
    Number.isFinite(articleId) && articleId > 0 ? articleId : 1;
  const articleImageUrl = `/${((safeArticleId - 1) % 8) + 1}.png`;
  const premiumHeight =
    premiumHeights[(safeArticleId - 1) % premiumHeights.length];
  const heroGradient = gradients[(safeArticleId - 1) % gradients.length];
  const articleHeadline = `Paywall Implementation Playbook #${safeArticleId}`;
  const articleOrigin = useMemo(() => {
    if (!articleUrl) {
      return DEFAULT_SITE_ORIGIN;
    }
    try {
      return new URL(articleUrl).origin;
    } catch {
      return DEFAULT_SITE_ORIGIN;
    }
  }, [articleUrl]);
  const canonicalUrl = useMemo(() => {
    if (articleUrl) {
      return articleUrl;
    }
    return `${articleOrigin}/articles/${safeArticleId}`;
  }, [articleUrl, articleOrigin, safeArticleId]);
  const publishedDate = useMemo(() => {
    const baseDate = new Date(Date.UTC(2024, 0, 1, 9, 0, 0));
    baseDate.setDate(baseDate.getDate() + (safeArticleId - 1));
    return baseDate.toISOString();
  }, [safeArticleId]);
  const registrationLink = useMemo(() => {
    if (!articleUrl) {
      return "";
    }

    const currentUrl = new URL(articleUrl);
    const publisher = currentUrl.hostname.split(".")[0];
    const environment =
      window.localStorage.getItem("selectedEnvironment") ||
      window.localStorage.getItem("selectedEnviroment") ||
      "staging";
    const registrationOrigin =
      environment === "live"
        ? "https://register.axate.io"
        : "https://register-staging.axate.io";

    return `${registrationOrigin}/?pub=${publisher}&redirectTo=${encodeURIComponent(articleUrl)}`;
  }, [articleUrl]);
  const articleSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline: articleHeadline,
      image: [`${articleOrigin}${articleImageUrl}`],
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: {
        "@type": "Organization",
        name: AUTHOR_NAME,
      },
      publisher: {
        "@type": "NewsMediaOrganization",
        name: PUBLISHER_NAME,
        url: articleOrigin,
        logo: {
          "@type": "ImageObject",
          url: `${articleOrigin}/ai.png`,
        },
      },
      description: ARTICLE_DESCRIPTION,
      isAccessibleForFree: false,
      hasPart: {
        "@type": "WebPageElement",
        isAccessibleForFree: false,
        cssSelector: ".premium",
      },
      inLanguage: "en",
      articleSection: "Features",
    }),
    [
      articleHeadline,
      articleImageUrl,
      articleOrigin,
      canonicalUrl,
      publishedDate,
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const walletElement = document.getElementById("axate-wallet");
    if (!walletElement) {
      return;
    }
    const isOddArticle = safeArticleId % 2 === 1;
    walletElement.setAttribute(
      "data-selector-button-mode",
      isOddArticle ? "true" : "false",
    );
    const noticeSelector = walletElement.getAttribute(
      "data-selector-in-page-notice",
    );
    if (isOddArticle && noticeSelector) {
      const noticeElement = document.querySelector(noticeSelector);
      if (noticeElement && noticeElement.parentNode) {
        noticeElement.parentNode.insertBefore(walletElement, noticeElement);
      }
      return;
    }
    const bodyElement = document.body;
    if (bodyElement && bodyElement.firstChild !== walletElement) {
      bodyElement.insertBefore(walletElement, bodyElement.firstChild);
    }
  }, [safeArticleId]);

  return (
    <>
      <Head>
        <title>{articleHeadline}</title>
        <meta name="description" content={ARTICLE_DESCRIPTION} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      </Head>
      <main className={styles.main}>
        <div style={{ display: "flex", width: "100%", marginBottom: "1.5rem" }}>
          <div style={{ width: "50%", paddingRight: "0.5rem" }}>
            <Link
              href="/"
              className={styles.backButton}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "linear-gradient(90deg, #fbc2eb 0%, #a18cd1 100%)",
                borderRadius: "6px",
                padding: "0.6rem 0",
                color: "#222",
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                border: "none",
              }}
            >
              ← Back
            </Link>
          </div>
          <div style={{ width: "50%", paddingLeft: "0.5rem" }}>
            <button
              type="button"
              onClick={goToRandomArticle}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 0",
                color: "#222",
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "background 0.2s",
              }}
            >
              Go to a Random Article
            </button>
          </div>
        </div>

        <div
          className={`article premium ${styles.article}`}
          data-premium-height={premiumHeight}
        >
          <h1 className={styles.title}>{articleHeadline}</h1>
          {/* Registration button moved below the image */}
          <Image
            className={styles.hero}
            src={articleImageUrl}
            alt="Abstract illustration for the article"
            style={{ background: heroGradient }}
          />
          {registrationLink && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "2rem 0 1.5rem 0",
              }}
            >
              <a
                href={registrationLink}
                style={{
                  display: "inline-block",
                  padding: "0.85rem 2.8rem",
                  background:
                    "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  fontSize: "1.13rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 18px rgba(67,233,123,0.18)",
                  textDecoration: "none",
                  letterSpacing: "0.7px",
                  border: "none",
                  textAlign: "center",
                  transition:
                    "transform 0.15s, box-shadow 0.15s, background 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)";
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(67,233,123,0.22)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 4px 18px rgba(67,233,123,0.18)";
                }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>
                  Go to new registration
                </span>
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 100%)",
                    zIndex: 1,
                    borderRadius: "12px",
                    pointerEvents: "none",
                  }}
                />
              </a>
            </div>
          )}
          <Paper
            shadow="xs"
            p={40}
            className={styles.content}
            style={{
              padding: 40,
              paddingTop: 48,
              paddingBottom: 48,
              paddingLeft: 32,
              paddingRight: 32,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Effective paywalls start with clear objectives. Define the revenue
              or engagement target you are solving for, document your existing
              conversion funnel, and benchmark metrics like engaged uniques,
              trial conversion, and churn before flipping the switch so you can
              prove impact afterward.
            </Text>
            <div
              style={{
                width: "100%",
                height: 32,
                borderRadius: 16,
                margin: "2.2rem 0",
                background: "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)",
              }}
            />
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Audit your content library and map pieces to access tiers. Decide
              which categories stay free, which get metered, and which require
              hard stops. For metered walls, configure preview components (such
              as the premium height setting above) so readers see enough value
              to justify subscribing without giving the full story away.
            </Text>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Streamline the registration journey that follows the paywall.
              Prefill email fields when possible, minimize the number of
              required inputs, and offer wallet, SSO, or reader-revenue platform
              integrations so recurring visitors can authenticate in a single
              click.
            </Text>
            <div
              style={{
                width: "100%",
                height: 32,
                borderRadius: 16,
                margin: "2.2rem 0",
                background: "linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)",
              }}
            />
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Invest in messaging around the wall. Use the in-page notice
              element to explain the value of membership, surface key benefits
              like ad-light experiences or subscriber-only newsletters, and
              localize the copy so it reflects the reader’s region and currency.
            </Text>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Treat pricing and access rules as experiments. Run controlled
              tests that vary free-article counts, introductory offers, and
              headline copy, and feed results into an optimization backlog so
              marketing and product teams can iterate together.
            </Text>
            <div
              style={{
                width: "100%",
                height: 32,
                borderRadius: 16,
                margin: "2.2rem 0",
                background: "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)",
              }}
            />
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Plan for technical resilience. Cache paywall configuration
              responses, set sane timeouts to avoid blocking article renders,
              and provide a fallback state that reverts to metered access if
              your payment provider has an outage.
            </Text>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              After launch, monitor the entire customer lifecycle. Share
              dashboards with editorial leads, funnel user feedback into support
              workflows, and schedule quarterly reviews of churn, reactivation,
              and ARPU so the paywall continues to support the newsroom’s goals.
            </Text>
            <div
              style={{
                width: "100%",
                height: 32,
                borderRadius: 16,
                margin: "2.2rem 0",
                background: "linear-gradient(90deg, #fa709a 0%, #fee140 100%)",
              }}
            />
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.32rem",
                color: "#2d2d2d",
                marginBottom: "1.6rem",
                lineHeight: 1.7,
              }}
            >
              Celebrate wins, but keep iterating. Pair qualitative interviews
              with quantitative dashboards so you understand the “why” behind
              conversion changes and can prioritize the next round of paywall
              enhancements with confidence.
            </Text>
          </Paper>
        </div>
        <div className="axate-notice"></div>
      </main>
    </>
  );
}

export default Article;
