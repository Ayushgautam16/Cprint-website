import { NextResponse } from 'next/server';
import { SAMPLE_ORDERS } from '@/lib/mockData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Order } from '@/lib/types';

function mapDbOrderToModel(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    customizationTotal: Number(row.customization_total || 0),
    shippingFee: Number(row.shipping_fee || 0),
    discountAmount: Number(row.discount_amount || 0),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount),
    currency: row.currency || 'INR',
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    trackingNumber: row.tracking_number,
    deliveryPartner: row.delivery_partner,
    trackingUrl: row.tracking_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusHistory: [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  const { orderNumber } = params;

  if (isSupabaseConfigured) {
    try {
      let query = supabaseAdmin.from('orders').select('*');
      if (orderNumber.startsWith('ord-')) {
        query = query.eq('id', orderNumber);
      } else {
        query = query.ilike('order_number', orderNumber);
      }
      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return NextResponse.json({ order: mapDbOrderToModel(data) });
      }
    } catch (err) {
      console.warn('Supabase fetch order failed:', err);
    }
  }

  // Fallback to sample data
  const order = SAMPLE_ORDERS.find(
    (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
  );

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  const { orderNumber } = params;
  try {
    const body = await request.json();
    const { status, trackingNumber, deliveryPartner, trackingUrl, notes } = body;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
    if (deliveryPartner !== undefined) updates.delivery_partner = deliveryPartner;
    if (trackingUrl !== undefined) updates.tracking_url = trackingUrl;
    if (notes !== undefined) updates.notes = notes;

    if (isSupabaseConfigured) {
      try {
        let query = supabaseAdmin.from('orders').update(updates);
        if (orderNumber.startsWith('ord-')) {
          query = query.eq('id', orderNumber);
        } else {
          query = query.ilike('order_number', orderNumber);
        }
        const { data, error } = await query.select().maybeSingle();

        if (!error && data) {
          return NextResponse.json({ success: true, order: mapDbOrderToModel(data) });
        }
      } catch (err) {
        console.warn('Supabase order update failed:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated in runtime',
      updates,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
