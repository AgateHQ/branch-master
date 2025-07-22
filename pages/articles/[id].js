import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Text, Paper, Title, Image } from "@mantine/core";

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
      <style jsx>{`
        .myImage {
          height: 150px;
        }
      `}</style>
      <main className={styles.main}>
        <Link href="/">Go Back</Link>

        <div className="article premium" data-premium-height={premiumHeight}>
          <Title order={3} size="h1">
            Welcome to Post #{router.query.id}!
          </Title>
          {registrationLink && (
            <a href={registrationLink}>Go to new registration</a>
          )}
          <Image
            className="myImage"
            src="https://images.unsplash.com/photo-1712839398257-8f7ee9127998?ixlib=rb-	1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&h=120"
          />
          <Paper shadow="xs" p="xl">
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
