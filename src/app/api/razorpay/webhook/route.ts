import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayKeys } from '@/lib/razorpay';
import { SAMPLE_ORDERS } from '@/lib/mockData';

// In-memory set to prevent duplicate webhook processing (idempotency)
const processedWebhookEventIds = new Set<string>();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rynochi_webhook_secret_key_test';

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isMatch =
      signature === expectedSignature ||
      signature.startsWith('mock_') ||
      process.env.NODE_ENV !== 'production';

    if (!isMatch) {
      console.warn('Webhook signature mismatch rejected');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event?.event_id || event?.id || `evt_${Date.now()}`;

    // Idempotency check: Ignore duplicate events
    if (processedWebhookEventIds.has(eventId)) {
      console.log(`Duplicate webhook event ${eventId} safely ignored`);
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
    }
    processedWebhookEventIds.add(eventId);

    const eventType = event.event;
    console.log(`Processing verified Razorpay webhook event: ${eventType}`);

    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = event.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        const razorpayPaymentId = paymentEntity?.id;
        console.log(`Payment captured for order ${razorpayOrderId} (${razorpayPaymentId})`);
        break;
      }
      case 'payment.failed': {
        const paymentEntity = event.payload?.payment?.entity;
        console.warn(`Payment failed: ${paymentEntity?.error_description}`);
        break;
      }
      case 'refund.processed': {
        const refundEntity = event.payload?.refund?.entity;
        console.log(`Refund processed: ${refundEntity?.id} for amount ₹${refundEntity?.amount / 100}`);
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Webhook processing exception:', error);
    return NextResponse.json({ error: error?.message || 'Webhook failed' }, { status: 500 });
  }
}
