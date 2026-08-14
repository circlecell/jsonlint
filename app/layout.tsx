import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LayoutProvider } from '@/components/LayoutProvider';
import { ValidationProvider } from '@/components/ValidationContext';
import { MainContent } from '@/components/MainContent';
import { OptimizeAds } from '@/components/OptimizeAds';
import { DelayedAdLoader } from '@/components/DelayedAdLoader';

// Self-hosted via next/font — replaces the render-blocking Google Fonts
// @import in globals.css (eliminates a blocking request, improves LCP).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'JSONLint - The JSON Validator',
    template: '%s | JSONLint',
  },
  description:
    'JSONLint is the free online validator, json formatter, and json beautifier tool for JSON, a lightweight data-interchange format.',
  metadataBase: new URL('https://jsonlint.com'),
  keywords: ['JSON', 'validator', 'formatter', 'beautifier', 'lint', 'parser', 'online tool', 'JSON checker'],
  authors: [{ name: 'JSONLint' }],
  creator: 'JSONLint',
  publisher: 'JSONLint',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jsonlint.com',
    siteName: 'JSONLint',
    title: 'JSONLint - The JSON Validator',
    description: 'JSONLint is the free online validator, json formatter, and json beautifier tool for JSON, a lightweight data-interchange format.',
  },
  twitter: {
    card: 'summary',
    title: 'JSONLint - The JSON Validator',
    description: 'JSONLint is the free online validator, json formatter, and json beautifier tool for JSON.',
  },
  // NOTE: no site-wide `alternates.canonical` — each page sets its own
  // self-referencing canonical (relative, resolved against metadataBase).
  // A root canonical here forces every child page to canonicalize to the
  // homepage, which suppresses their indexing.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
            try {
              var stored = localStorage.getItem('jsonlint-theme');
              var dark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(dark ? 'dark' : 'light');
            } catch (e) {}
          })();`}
        </Script>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/site.webmanifest" />
        <meta name="theme-color" content="#0D0D0D" />
        <Script
          id="bsaOptimizeQueue"
          strategy="afterInteractive"
        >
          {`window.optimize = window.optimize || { queue: [] };`}
        </Script>
        <Script
          id="fullres-analytics"
          strategy="lazyOnload"
        >
          {`(function(){
            var fullres = document.createElement('script');
            fullres.async = true;
            fullres.src = 'https://t.fullres.net/jsonlint.js?'+(new Date()-new Date()%43200000);
            document.head.appendChild(fullres);
          })();`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <LayoutProvider>
            <ValidationProvider>
              <Header />
              <MainContent>{children}</MainContent>
              <Footer />
            </ValidationProvider>
          </LayoutProvider>
        </ThemeProvider>

        {/* BuySellAds Optimize - handles ad refresh on SPA navigation */}
        <OptimizeAds />
        
        {/* The primary BSA/Prebid stack loads when the browser is idle; native
            ad rendering is delayed further to preserve initial responsiveness. */}
        <DelayedAdLoader delay={6500} />
      </body>
    </html>
  );
}
