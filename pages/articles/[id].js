import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Text, Paper, Image } from "@mantine/core";

function Article() {
  // Handler for random article navigation
  const goToRandomArticle = () => {
    const randomId = Math.floor(Math.random() * 42691); // 0 to 42690 inclusive
    router.push(`/articles/${randomId}`);
  };
  const router = useRouter();

  const [registrationLink, setRegistrationLink] = useState("");
  const premiumHeights = [750, 1000, 2000, 300];
  const premiumHeight = useMemo(
    () => premiumHeights[Math.floor(Math.random() * premiumHeights.length)],
    [],
  );

  const gradients = [
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  ];

  const articleId = parseInt(router.query.id || "1", 10);
  const heroGradient = gradients[(articleId - 1) % gradients.length];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const subdomain = hostname.split(".")[0];
      const redirectTo = window.location.href;
      const env = localStorage.getItem("selectedEnviroment") || "staging";
      const registerBase =
        env === "live"
          ? "https://register.axate.io"
          : "https://register-staging.axate.io";
      const link = `${registerBase}/?pub=${subdomain}&redirectTo=${encodeURIComponent(redirectTo)}`;
      setRegistrationLink(link);
    }
  }, []);

  return (
    <>
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
          <h1 className={styles.title}>Welcome to Post #{router.query.id}!</h1>
          {/* Registration button moved below the image */}
          <Image
            className={styles.hero}
            src="https://images.unsplash.com/photo-1712839398257-8f7ee9127998?auto=format&fit=crop&w=800&h=400"
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
              Today, I choose to create with purpose and passion, knowing that
              every word I write is a step toward a brighter future. My thoughts
              are seeds, and with care, I nurture them into stories that inspire
              and uplift those who read them.
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
              I am open to new ideas and welcome inspiration from every corner
              of the world. Each day, I allow my mind to wander, to dream, and
              to discover new perspectives that enrich my creative journey and
              deepen my understanding.
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
              My work uplifts others and brings light to those who read it. I
              believe in the power of words to heal, to encourage, and to
              connect us all, no matter where we are or what we face in life’s
              unfolding story.
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
              I am grateful for the opportunity to share my story and connect
              with others. Every interaction, every comment, and every shared
              moment is a reminder that we are all part of a greater tapestry,
              woven together by our hopes and dreams.
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
              Every challenge I face is a chance to grow and learn. I embrace
              obstacles as opportunities, knowing that with each step, I become
              more resilient, more compassionate, and more attuned to the beauty
              of the creative process.
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
              My creativity flows freely and abundantly, unburdened by doubt or
              fear. I trust in my ability to bring forth ideas that matter, and
              I celebrate the unique voice that only I can share with the world.
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
              I trust the process and embrace the journey of discovery, knowing
              that every page I fill is a testament to my growth. I honor my
              progress and find joy in the act of creation itself, regardless of
              the outcome.
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
              I am proud of what I create and celebrate every step forward, no
              matter how small. With gratitude and hope, I continue to write my
              story, confident that my words will find their place in the hearts
              of others.
            </Text>
          </Paper>
        </div>
        <div className="axate-notice"></div>
      </main>
    </>
  );
}

export default Article;
