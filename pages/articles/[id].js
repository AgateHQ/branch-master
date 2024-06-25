import { useRouter } from "next/router";
import styles from "../../styles/Article.module.css";
import Link from "next/link";
import Image from "next/image";
import Script from 'next/script'

function Article() {
  const router = useRouter();

  const myLoader = ({ src, width, quality }) => {
    return `/${src}?w=${width}&q=${quality || 75}`;
  };

  const MyImage = (props) => {
    return (
      <Image
        loader={myLoader}
        src="ai.png"
        alt="Picture of something"
        width={500}
        height={500}
      />
    );
  };

  return (
    <>
      <main className={styles.main}>
        <Link href="/">Go Back</Link>

        <article className="premium">
          <h1>Hello from post number {router.query.id}!</h1>
          <MyImage />
          <section>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>
        </article>
        <div className="axate-notice"></div>
        <Script id="my-inline-callback-script">{`
         // These are callback functions reffered here: https://github.com/AgateHQ/axate-developer-docs/blob/main/docs/analytics-hooks.md
        function agateUserLoggedOut(){
          console.log("0. agateUserLoggedOut")
        }
        function axateInit(){
          console.log("1. axateInit");
        }
        function agateUserLoggedIn(){
          console.log("2. axateUserLoggedIn");
        }
        function axateUserOnFreePeriod(){
          console.log("3. axateUserOnFreePeriod")
        }
        function agatePremiumContentRendered(){
          console.log("agatePremiumContentRendered")
        }
        function axateUserHasAccessToContent(){
          console.log("axateUserHasAccessToContent")
        }
        function axatePaidTransaction(){
          console.log("axatePaidTransaction")
        }
        function axateBonusReadTransaction(){
          console.log("axatePaidTransaction")
        }
        function axateFreePeriodTransaction(){
          console.log("axateFreePeriodTransaction")
        }
        function axateAlreadyReadTransaction(){
          console.log("axateAlreadyReadTransaction")
        }
        function axateUserOnFreePeriod(){
          console.log("axateUserOnFreePeriod")
        }
        `}</Script>
      </main>
    </>
  );
}

export default Article;
