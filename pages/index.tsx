import { NextPage } from "next";
import Head from "next/head";
import { useAuthRequired } from "../common/useAuthRequired";

const Home: NextPage = () => {
  useAuthRequired("/report");

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </div>
  );
};

export default Home;
