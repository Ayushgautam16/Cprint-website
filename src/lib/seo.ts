import { Product } from './types';

export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RYNOCHI',
    url: 'https://rynochi.com',
    logo: 'https://rynochi.com/images/brand/rynochi-header-crop.jpg',
    description: 'Premier brand for personalized printing, precision laser engraved pens, luxury leather diaries, and bespoke corporate gifting.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'T371-FAST FLOR CHAMELIN ROAD, KAROL BAGH',
      addressLocality: 'NEW DELHI',
      addressRegion: 'DELHI',
      postalCode: '110006',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-72773-38436',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/rynochi__eye_wear?utm_source=qr&srtk=MTB0MDVyMzd5anJsOQ==',
      'https://www.facebook.com/share/19ca1jff5P/',
      'http://youtube.com/@rynochi-p?si=8yDkeTxuhbS1fZQ3',
      'https://www.amazon.in/storefront?me=A199V62RGC67K7&ref_=ssf_share',
    ],
  };
}

export function getProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) =>
      img.startsWith('http') ? img : `https://rynochi.com${img}`
    ),
    description: product.shortDescription,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'RYNOCHI',
    },
    offers: {
      '@type': 'Offer',
      url: `https://rynochi.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.discountPrice || product.basePrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'RYNOCHI',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 12,
        }
      : undefined,
  };
}

export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

