import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/mockData';
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ product: mapDbProductToModel(data) });
      }
    } catch (err) {
      console.warn('Supabase product fetch failed:', err);
    }
  }

  const fallback = PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (fallback) {
    return NextResponse.json({ product: fallback });
  }

  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.sku !== undefined) updates.sku = body.sku;
    if (body.shortDescription !== undefined) updates.short_description = body.shortDescription;
    if (body.description !== undefined) updates.description = body.description;
    if (body.categoryId !== undefined) updates.category_id = body.categoryId;
    if (body.categoryName !== undefined) updates.category_name = body.categoryName;
    if (body.basePrice !== undefined) updates.base_price = Number(body.basePrice);
    if (body.discountPrice !== undefined) updates.discount_price = body.discountPrice ? Number(body.discountPrice) : null;
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.minOrderQty !== undefined) updates.min_order_qty = Number(body.minOrderQty);
    if (body.isCustomizable !== undefined) updates.is_customizable = Boolean(body.isCustomizable);
    if (body.engravingType !== undefined) updates.engraving_type = body.engravingType;
    if (body.additionalCustomizationFee !== undefined) updates.additional_customization_fee = Number(body.additionalCustomizationFee);
    if (body.isFeatured !== undefined) updates.is_featured = Boolean(body.isFeatured);
    if (body.isBestseller !== undefined) updates.is_bestseller = Boolean(body.isBestseller);
    if (body.isNewArrival !== undefined) updates.is_new_arrival = Boolean(body.isNewArrival);
    if (body.isActive !== undefined) updates.is_active = Boolean(body.isActive);
    if (body.images !== undefined) updates.images = body.images;
    if (body.colors !== undefined) updates.colors = body.colors;
    if (body.fonts !== undefined) updates.fonts = body.fonts;
    if (body.customizationFields !== undefined) updates.customization_fields = body.customizationFields;
    if (body.specifications !== undefined) updates.specifications = body.specifications;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .update(updates)
          .or(`id.eq.${id},slug.eq.${id}`)
          .select()
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({ success: true, product: mapDbProductToModel(data) });
        }
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Product updated', updates });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .or(`id.eq.${id},slug.eq.${id}`);

        if (error) {
          console.warn('Supabase product delete error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      } catch (err) {
        console.warn('Supabase delete exception:', err);
      }
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete product' }, { status: 500 });
  }
}

