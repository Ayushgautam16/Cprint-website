import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/mockData';
import { getProductStructuredData, getBreadcrumbStructuredData } from '@/lib/seo';
import ProductDetailLive from '@/components/product/ProductDetailLive';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Structured Data for Google SEO
  const productJsonLd = getProductStructuredData(product);
  const breadcrumbJsonLd = getBreadcrumbStructuredData([
    { name: 'Home', url: 'https://rynochi.com' },
    { name: 'Shop', url: 'https://rynochi.com/shop' },
    { name: product.categoryName, url: `https://rynochi.com/category/${product.categoryId}` },
    { name: product.name, url: `https://rynochi.com/product/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductDetailLive initialProduct={product} slug={params.slug} />
    </div>
  );
}

