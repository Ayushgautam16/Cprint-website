import { NextResponse } from 'next/server';
import { SAMPLE_ORDERS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  const { orderNumber } = params;

  // Search in memory / sample data
  const order = SAMPLE_ORDERS.find(
    (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
  );

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}

