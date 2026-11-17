import { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rynochi.com';

  const productUrls = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const categoryUrls = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    '',
    '/shop',
    '/corporate',
    '/track-order',
    '/about',
    '/contact',
    '/faqs',
    '/privacy-policy',
    '/terms-and-conditions',
    '/shipping-policy',
    '/refund-cancellation-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}

