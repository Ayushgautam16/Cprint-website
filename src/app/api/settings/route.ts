import { NextResponse } from 'next/server';
import { INITIAL_SETTINGS } from '@/lib/mockData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { WebsiteSettings } from '@/lib/types';

function mapDbSettingsToModel(row: any): WebsiteSettings {
  return {
    businessName: row.business_name || 'RYNOCHI',
    logoUrl: row.logo_url || '/images/brand/rynochi-gold-logo.png',
    announcementText: row.announcement_text || '',
    announcementActive: Boolean(row.announcement_active),
    whatsappNumber: row.whatsapp_number || '917277338436',
    supportEmail: row.support_email || 'rynochioffice@gmail.com',
    supportPhone: row.support_phone || '+91 72773 38436',
    officeAddress: row.office_address || '',
    shippingFee: Number(row.shipping_fee || 99),
    freeShippingThreshold: Number(row.free_shipping_threshold || 999),
    taxRatePercent: Number(row.tax_rate_percent || 18),
    razorpayEnabled: Boolean(row.razorpay_enabled),
    codEnabled: Boolean(row.cod_enabled),
    socialLinks: typeof row.social_links === 'string' ? JSON.parse(row.social_links) : (row.social_links || {}),
  };
}

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ settings: mapDbSettingsToModel(data) });
      }
    } catch (err) {
      console.warn('Supabase settings fetch error:', err);
    }
  }

  return NextResponse.json({ settings: INITIAL_SETTINGS });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.businessName !== undefined) updates.business_name = body.businessName;
    if (body.announcementText !== undefined) updates.announcement_text = body.announcementText;
    if (body.announcementActive !== undefined) updates.announcement_active = body.announcementActive;
    if (body.whatsappNumber !== undefined) updates.whatsapp_number = body.whatsappNumber;
    if (body.supportPhone !== undefined) updates.support_phone = body.supportPhone;
    if (body.supportEmail !== undefined) updates.support_email = body.supportEmail;
    if (body.officeAddress !== undefined) updates.office_address = body.officeAddress;
    if (body.shippingFee !== undefined) updates.shipping_fee = Number(body.shippingFee);
    if (body.freeShippingThreshold !== undefined) updates.free_shipping_threshold = Number(body.freeShippingThreshold);
    if (body.taxRatePercent !== undefined) updates.tax_rate_percent = Number(body.taxRatePercent);
    if (body.razorpayEnabled !== undefined) updates.razorpay_enabled = Boolean(body.razorpayEnabled);
    if (body.codEnabled !== undefined) updates.cod_enabled = Boolean(body.codEnabled);
    if (body.socialLinks !== undefined) updates.social_links = body.socialLinks;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('store_settings')
          .update(updates)
          .eq('id', 'default')
          .select()
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({ success: true, settings: mapDbSettingsToModel(data) });
        }
      } catch (err) {
        console.warn('Supabase settings update error:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update settings' }, { status: 500 });
  }
}

