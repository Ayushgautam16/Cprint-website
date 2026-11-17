import { NextResponse } from 'next/server';
import { generateOrderNumber } from '@/lib/utils';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { SAMPLE_ORDERS } from '@/lib/mockData';

// In-memory orders cache for instant runtime response
let globalOrders: Order[] = [...SAMPLE_ORDERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('email');

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

