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

  const imageURL = "/bg.jpg";

  return (
    <>
      <main className={styles.main}>
        <Link href="/" className="btn btn-sm btn-outline mb-4">
          Go Back
        </Link>

        <div
          className={`article premium ${styles.article}`}
          data-premium-height={premiumHeight}
        >
          <h1 className={styles.title}>Welcome to Post #{router.query.id}!</h1>
          {registrationLink && (
            <a href={registrationLink} className="btn btn-primary my-4">
              Go to new registration
            </a>
          )}
          <Image
            className={styles.hero}
            src="https://images.unsplash.com/photo-1712839398257-8f7ee9127998?auto=format&fit=crop&w=800&h=400"
          />
          <Paper shadow="xs" p="xl" className={`${styles.content} prose`}>
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
