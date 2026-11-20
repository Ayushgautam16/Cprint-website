import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/mockData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Product, CustomizationField } from '@/lib/types';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get('all') === 'true' || searchParams.get('admin') === 'true';

  if (isSupabaseConfigured) {
    try {
      let query = supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const products = data.map(mapDbProductToModel);
        return NextResponse.json({ products });
      }
    } catch (err) {
      console.warn('Supabase products fetch failed, using fallback:', err);
    }
  }

  const fallback = includeInactive ? PRODUCTS : PRODUCTS.filter((p) => p.isActive);
  return NextResponse.json({ products: fallback });
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    if (!product.name || !product.basePrice) {
      return NextResponse.json({ error: 'Name and Base Price are required' }, { status: 400 });
    }

    const id = product.id || `prod_${Date.now()}`;
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin.from('products').insert({
          id,
          name: product.name,
          slug,
          sku: product.sku || `RYN-${Date.now().toString().slice(-4)}`,
          short_description: product.shortDescription || '',
          description: product.description || '',
          category_id: product.categoryId || 'cat-keychain',
          category_name: product.categoryName || 'Keychain',
          base_price: Number(product.basePrice),
          discount_price: product.discountPrice ? Number(product.discountPrice) : null,
          stock: Number(product.stock || 100),
          is_customizable: product.isCustomizable !== false,
          is_featured: Boolean(product.isFeatured),
          is_bestseller: Boolean(product.isBestseller),
          is_new_arrival: Boolean(product.isNewArrival),
          is_active: product.isActive !== false,
          images: product.images || [],
          colors: product.colors || [],
          fonts: product.fonts || [],
        }).select().single();

        if (!error && data) {
          return NextResponse.json({ success: true, product: mapDbProductToModel(data) });
        }
      } catch (err) {
        console.warn('Supabase product insert error:', err);
      }
    }

    return NextResponse.json({ success: true, product: { ...product, id, slug } });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }
}
