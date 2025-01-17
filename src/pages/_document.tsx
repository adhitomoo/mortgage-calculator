import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Quicksand:wght@300..700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
