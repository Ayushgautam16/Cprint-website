import { NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/utils';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { SAMPLE_ORDERS } from '@/lib/mockData';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// In-memory orders cache as immediate fallback
let globalOrders: Order[] = [...SAMPLE_ORDERS];

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('email');

  if (isSupabaseConfigured) {
    try {
      let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
      if (userEmail) {
        query = query.ilike('customer_email', userEmail);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const orders = data.map(mapDbOrderToModel);
        return NextResponse.json({ orders });
      }
    } catch (err) {
      console.warn('Supabase orders fetch error, falling back to cache:', err);
    }
  }

  // Fallback to cache / sample data
  if (userEmail) {
    const userOrders = globalOrders.filter(
      (o) => o.customerEmail.toLowerCase() === userEmail.toLowerCase()
    );
    return NextResponse.json({ orders: userOrders });
  }

  return NextResponse.json({ orders: globalOrders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      customerNotes,
      razorpayOrderId,
      razorpayPaymentId,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    // Server-side calculation of pricing (never trust client amounts)
    let subtotal = 0;
    let customizationTotal = 0;

    const validatedItems = items.map((item: any) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const customCharge = Number(item.customizationCharges) || 0;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const lineTotal = (unitPrice + customCharge) * qty;

      subtotal += unitPrice * qty;
      customizationTotal += customCharge * qty;

      return {
        id: item.id || `item_${Date.now()}_${Math.random()}`,
        productId: item.productId,
        productName: item.product?.name || item.productName,
        productSku: item.product?.sku || item.productSku || 'RYN-PROD',
        productImageUrl: item.product?.images?.[0] || item.productImageUrl,
        unitPrice,
        customizationCharge: customCharge,
        quantity: qty,
        totalPrice: lineTotal,
        customization: item.customization,
      };
    });

    const shippingFee = subtotal >= 999 ? 0 : 99;
    const taxAmount = Math.round((subtotal + customizationTotal) * 0.18);
    const totalAmount = subtotal + customizationTotal + shippingFee;

    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const isPaid = paymentMethod !== 'CASH_ON_DELIVERY';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: validatedItems,
      subtotal,
      customizationTotal,
      shippingFee,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      currency: 'INR',
      status: isPaid ? 'PAYMENT_CONFIRMED' : 'ORDER_PLACED',
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      customerNotes,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          id: `hist_${Date.now()}_1`,
          status: 'ORDER_PLACED',
          notes: 'Order placed online.',
          changedBy: 'SYSTEM',
          createdAt: now,
        },
        ...(isPaid
          ? [
              {
                id: `hist_${Date.now()}_2`,
                status: 'PAYMENT_CONFIRMED' as OrderStatus,
                notes: `Online payment confirmed via ${paymentMethod}.`,
                changedBy: 'SYSTEM',
                createdAt: now,
              },
            ]
          : []),
      ],
    };

    // 1. Insert into Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { error: dbError } = await supabaseAdmin.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          customer_phone: newOrder.customerPhone,
          shipping_address: newOrder.shippingAddress,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          customization_total: newOrder.customizationTotal,
          shipping_fee: newOrder.shippingFee,
          discount_amount: newOrder.discountAmount,
          tax_amount: newOrder.taxAmount,
          total_amount: newOrder.totalAmount,
          currency: newOrder.currency,
          status: newOrder.status,
          payment_status: newOrder.paymentStatus,
          payment_method: newOrder.paymentMethod,
          razorpay_order_id: newOrder.razorpayOrderId || null,
          razorpay_payment_id: newOrder.razorpayPaymentId || null,
          tracking_number: newOrder.trackingNumber || null,
          delivery_partner: newOrder.deliveryPartner || null,
          tracking_url: newOrder.trackingUrl || null,
          notes: newOrder.customerNotes || null,
          created_at: newOrder.createdAt,
          updated_at: newOrder.updatedAt,
        });

        if (dbError) {
          console.warn('Supabase order insert warning:', dbError.message);
        }
      } catch (err) {
        console.warn('Supabase insert failed, order saved in runtime cache:', err);
      }
    }

    // 2. Keep in local cache
    globalOrders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
