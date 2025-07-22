import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Text, Paper, Image } from "@mantine/core";

function Article() {
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
      const link = `https://register.axate.io/?pub=${subdomain}&redirectTo=${encodeURIComponent(
        redirectTo,
      )}`;
      setRegistrationLink(link);
    }
  }, []);

  return (
    <>
      <main className={styles.main}>
        <Link href="/" className={styles.linkBack}>
          Go Back
        </Link>

        <div
          className={`article premium ${styles.article}`}
          data-premium-height={premiumHeight}
        >
          <h1 className={styles.title}>Welcome to Post #{router.query.id}!</h1>
          {registrationLink && (
            <a href={registrationLink}>Go to new registration</a>
          )}
          <Image
            className={styles.hero}
            src="https://images.unsplash.com/photo-1712839398257-8f7ee9127998?auto=format&fit=crop&w=800&h=400"
            style={{ background: heroGradient }}
          />
          <Paper shadow="xs" p="xl" className={styles.content}>
            <Text>
              This demo article demonstrates how Branch Master loads dynamic
              content. The post number in the URL shows which article you’re
              viewing.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
            <Text>
              All of these pages work with the Axate wallet, so the registration
              link updates automatically based on the subdomain you choose.
            </Text>
            <Text>
              Try switching the hostname to other publishers or exploring
              different sections to see how the site adapts. Real stories would
              replace this placeholder copy.
            </Text>
          </Paper>
        </div>
        <div className="axate-notice"></div>
      </main>
    </>
  );
}

export default Article;
