import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/mockData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Product } from '@/lib/types';

function mapDbProductToModel(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku || '',
    shortDescription: row.short_description || '',
    description: row.description || '',
    categoryId: row.category_id || '',
    categoryName: row.category_name || '',
    basePrice: Number(row.base_price),
    discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
    stock: Number(row.stock || 0),
    minOrderQty: Number(row.min_order_qty || 1),
    isCustomizable: Boolean(row.is_customizable),
    engravingType: row.engraving_type || '',
    additionalCustomizationFee: Number(row.additional_customization_fee || 0),
    isFeatured: Boolean(row.is_featured),
    isBestseller: Boolean(row.is_bestseller),
    isNewArrival: Boolean(row.is_new_arrival),
    isActive: Boolean(row.is_active),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : (row.colors || []),
    fonts: typeof row.fonts === 'string' ? JSON.parse(row.fonts) : (row.fonts || []),
    customizationFields: typeof row.customization_fields === 'string' ? JSON.parse(row.customization_fields) : (row.customization_fields || []),
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || {}),
  };
}

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('id');

      if (!error && data && data.length > 0) {
        const products = data.map(mapDbProductToModel);
        return NextResponse.json({ products });
      }
    } catch (err) {
      console.warn('Supabase products fetch failed, using fallback:', err);
    }
  }

  return NextResponse.json({ products: PRODUCTS });
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
          category_id: product.categoryId || 'cat-pens',
          category_name: product.categoryName || 'Personalized Pens',
          base_price: product.basePrice,
          discount_price: product.discountPrice || null,
          stock: product.stock || 100,
          is_customizable: product.isCustomizable !== false,
          is_featured: Boolean(product.isFeatured),
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
