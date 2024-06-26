import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import { Text, Paper, Title, Image } from "@mantine/core";

function Article() {
  const router = useRouter();

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

        <article className="premium">
          <Title order={3} size="h1">
            Welcome to Post #{router.query.id}!
          </Title>
          <Image
            className="myImage"
            src="https://images.unsplash.com/photo-1712839398257-8f7ee9127998?ixlib=rb-	1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&h=120"
          />
          <Paper shadow="xs" p="xl">
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </Paper>
        </article>
        <div className="axate-notice"></div>
      </main>
    </>
  );
}

export default Article;
