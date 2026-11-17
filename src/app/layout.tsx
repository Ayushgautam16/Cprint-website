import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import { getOrganizationStructuredData } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://rynochi.com'),
  title: {
    default: 'RYNOCHI | Premium Personalized Printing, Laser Engraved Pens & Executive Gifts',
    template: '%s | RYNOCHI',
  },
  description:
    'Turn everyday essentials into extraordinary keepsakes. Explore precision laser-engraved pens, handcrafted PU leather diaries, stylus pens, and bespoke corporate gifting solutions.',
  keywords: [
    'customized pens',
    'personalized engraved pens',
    'laser printed gifts',
    'customized diaries',
    'corporate gifting products',
    'personalized corporate gifts',
    'customized stylus pens',
    'RYNOCHI luxury gifts',
  ],
  authors: [{ name: 'RYNOCHI' }],
  creator: 'RYNOCHI',
  publisher: 'RYNOCHI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rynochi.com',
    title: 'RYNOCHI | Luxury Personalized Printing & Executive Gifting',
    description:
      'Turn everyday essentials into extraordinary keepsakes with precision laser engraving and custom printing.',
    siteName: 'RYNOCHI',
    images: [
      {
        url: '/images/products/giftset-diary-pen-showcase.jpg',
        width: 1200,
        height: 630,
        alt: 'RYNOCHI Executive Gift Box Set and Engraved Pens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RYNOCHI | Premium Custom Printing & Personalized Gifts',
    description: 'Precision laser-engraved pens and handcrafted leather diaries.',
    images: ['/images/products/giftset-diary-pen-showcase.jpg'],
  },
  verification: {
    google: 'google5a7ae47222b0cb1b',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = getOrganizationStructuredData();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFDF8] text-[#2A2620] antialiased selection:bg-[#F0DFAE] selection:text-[#2A2620]">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

