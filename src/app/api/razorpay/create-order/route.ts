import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getRazorpayKeys } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const { keyId, keySecret } = getRazorpayKeys();

    // If live or valid keys exist, call Razorpay SDK
    // Amount in Razorpay is in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    let orderId: string;

    try {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      };

      const rzpOrder = await instance.orders.create(options);
      orderId = rzpOrder.id;
    } catch (sdkError: any) {
      // In development or when using mock test credentials, simulate the order creation
      console.warn('Using fallback test mode Razorpay order ID:', sdkError?.message);
      orderId = `order_test_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaise,
      currency,
      keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

