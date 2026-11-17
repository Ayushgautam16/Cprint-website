import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

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
    if (body.shortDescription !== undefined) updates.short_description = body.shortDescription;
    if (body.description !== undefined) updates.description = body.description;
    if (body.basePrice !== undefined) updates.base_price = Number(body.basePrice);
    if (body.discountPrice !== undefined) updates.discount_price = body.discountPrice ? Number(body.discountPrice) : null;
    if (body.stock !== undefined) updates.stock = Number(body.stock);
    if (body.isCustomizable !== undefined) updates.is_customizable = Boolean(body.isCustomizable);
    if (body.isFeatured !== undefined) updates.is_featured = Boolean(body.isFeatured);
    if (body.images !== undefined) updates.images = body.images;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({ success: true, product: data });
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

