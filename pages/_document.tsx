import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased bg-white text-gray-900 selection:bg-brand-blue/10 selection:text-brand-blue">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
