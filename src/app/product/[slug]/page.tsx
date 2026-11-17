import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/mockData';
import { getProductStructuredData, getBreadcrumbStructuredData } from '@/lib/seo';
import ProductDetailLive from '@/components/product/ProductDetailLive';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Product, CustomizationField } from '@/lib/types';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function safeParseArray(val: any): string[] {
  if (Array.isArray(val)) {
    return val.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  if (!val) return [];
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
        }
      } catch {}
    }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter((s) => s.length > 0);
    }
    return [trimmed];
  }
  return [];
}

function safeParseObjectArray<T = any>(val: any): T[] {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function safeParseObject(val: any): Record<string, string> {
  if (val && typeof val === 'object' && !Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
  }
  return {};
}

function mapDbProductToModel(row: any): Product {
  const parsedImages = safeParseArray(row.images);
  const images = parsedImages.length > 0 ? parsedImages : ['/images/products-optimized/1.png'];

  return {
    id: row.id,
    name: row.name || 'Personalized Gift',
    slug: row.slug || 'product',
    sku: row.sku || '',
    shortDescription: row.short_description || '',
    description: row.description || '',
    categoryId: row.category_id || '',
    categoryName: row.category_name || '',
    basePrice: Number(row.base_price) || 999,
    discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
    stock: Number(row.stock || 0),
    minOrderQty: Number(row.min_order_qty || 1),
    isCustomizable: Boolean(row.is_customizable !== false),
    engravingType: row.engraving_type || '',
    additionalCustomizationFee: Number(row.additional_customization_fee || 0),
    isFeatured: Boolean(row.is_featured),
    isBestseller: Boolean(row.is_bestseller),
    isNewArrival: Boolean(row.is_new_arrival),
    isActive: Boolean(row.is_active !== false),
    images,
    colors: safeParseArray(row.colors),
    fonts: safeParseArray(row.fonts),
    customizationFields: safeParseObjectArray<CustomizationField>(row.customization_fields),
    specifications: safeParseObject(row.specifications),
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (!error && data) {
        return mapDbProductToModel(data);
      }
    } catch (err) {
      console.warn('Supabase product fetch error:', err);
    }
  }

  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.slug);

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
