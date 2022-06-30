import React from "react";
import Head from "next/head";

export default function HeadComponent() {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#000000" />

      <title>Create your Solana Online Store</title>
      <meta name="title" content="Create your Solana Online Store" />
      <meta name="description" content="React.js + Next.js + Vercel 👉 Solanaでオリジナルのデータショップを作ろう✨" />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.shiftbase.xyz/" />
      <meta property="og:title" content="Create your Solana Online Store" />
      <meta property="og:description" content="React.js + Next.js + Vercel 👉 Solanaでオリジナルのデータショップを作ろう✨" />
      <meta property="og:image" content="/banner-solana-online-store.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.shiftbase.xyz/" />
      <meta property="twitter:title" content="Create your Solana Online Store" />
      <meta property="twitter:description" content="React.js + Next.js + Vercel 👉 Solanaでオリジナルのデータショップを作ろう✨" />
      <meta property="twitter:image" content="/banner-solana-online-store.png" />
    </Head>
  );
}
