import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LayoutProvider } from '@/components/LayoutProvider';
import { ValidationProvider } from '@/components/ValidationContext';
import { MainContent } from '@/components/MainContent';
import { OptimizeAds } from '@/components/OptimizeAds';

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
  alternates: {
    canonical: 'https://jsonlint.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        <meta name="theme-color" content="#0f1115" />
        <Script
          id="bsaOptimizeQueue"
          strategy="beforeInteractive"
        >
          {`window.optimize = window.optimize || { queue: [] };`}
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
        
        <Script
          id="bsaOptimizeScript"
          strategy="afterInteractive"
          src="https://cdn4.buysellads.net/pub/jsonlint.js"
        />

        {/* BuySellAds Native Ads */}
        <Script src="//m.servedby-buysellads.com/monetization.custom.js" strategy="afterInteractive" />
        <Script
          id="native-ad"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function() {
                if (typeof _bsa !== 'undefined' && _bsa) {
                  _bsa.init('custom', 'CVADT27Y', 'placement:jsonlintcom', {
                    target: '.native-ad-container',
                    template: \`
                      <a href="##link##" class="native-ad" rel="noopener sponsored">
                        <div class="native-ad-sponsor">
                          <span>Sponsored by ##company##</span>
                        </div>
                        <div class="native-ad-content">
                          <img class="native-ad-logo" src="##logo##" style="background-color: ##backgroundColor##" alt="##company##">
                          <div class="native-ad-text">
                            <div class="native-ad-tagline">##tagline##</div>
                            <div class="native-ad-description">##description##</div>
                            <div class="native-ad-cta">##callToAction##</div>
                          </div>
                        </div>
                      </a>\`
                  });
                }
              };
            `,
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=UA-69209117-1" />
        <Script
          id="gajs"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-69209117-1');
            `,
          }}
        />
      </body>
    </html>
  );
}
