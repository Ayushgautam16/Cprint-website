import { OrderStatus } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function calculateDiscountPercentage(basePrice: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= basePrice) return 0;
  return Math.round(((basePrice - discountPrice) / basePrice) * 100);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RYN-${timestamp}-${random}`;
}

export function getOrderStatusDetails(status: OrderStatus): {
  label: string;
  colorClass: string;
  bgClass: string;
  stepNumber: number;
  description: string;
} {
  switch (status) {
    case 'ORDER_PLACED':
      return {
        label: 'Order Placed',
        colorClass: 'text-blue-400',
        bgClass: 'bg-blue-900/30 border-blue-500/30',
        stepNumber: 1,
        description: 'Your order has been received and registered in our queue.',
      };
    case 'PAYMENT_CONFIRMED':
      return {
        label: 'Payment Confirmed',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-900/30 border-emerald-500/30',
        stepNumber: 2,
        description: 'Online payment received and verified.',
      };
    case 'CUSTOMIZATION_UNDER_REVIEW':
      return {
        label: 'Customization Review',
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-900/30 border-amber-500/30',
        stepNumber: 3,
        description: 'Our artisan team is reviewing your text and artwork specifications.',
      };
    case 'DESIGN_APPROVAL_PENDING':
      return {
        label: 'Approval Pending',
        colorClass: 'text-orange-400',
        bgClass: 'bg-orange-900/30 border-orange-500/30',
        stepNumber: 4,
        description: 'Digital proof generated awaiting customer confirmation.',
      };
    case 'DESIGN_APPROVED':
      return {
        label: 'Design Approved',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-900/30 border-emerald-500/30',
        stepNumber: 5,
        description: 'Design proof finalized and sent to the production bench.',
      };
    case 'PROCESSING':
      return {
        label: 'Processing',
        colorClass: 'text-indigo-400',
        bgClass: 'bg-indigo-900/30 border-indigo-500/30',
        stepNumber: 6,
        description: 'Product prepared and loaded into precision laser machines.',
      };
    case 'PRINTING_ENGRAVING':
      return {
        label: 'Laser Engraving',
        colorClass: 'text-yellow-400',
        bgClass: 'bg-yellow-900/30 border-yellow-500/30',
        stepNumber: 7,
        description: 'High-precision fiber laser engraving underway.',
      };
    case 'QUALITY_CHECK':
      return {
        label: 'Quality Check',
        colorClass: 'text-teal-400',
        bgClass: 'bg-teal-900/30 border-teal-500/30',
        stepNumber: 8,
        description: 'Inspecting engraving depth, finish, alignment, and packaging.',
      };
    case 'PACKED':
      return {
        label: 'Packed in Luxury Box',
        colorClass: 'text-purple-400',
        bgClass: 'bg-purple-900/30 border-purple-500/30',
        stepNumber: 9,
        description: 'Placed in signature presentation gift box with gold ribbon.',
      };
    case 'SHIPPED':
      return {
        label: 'Shipped',
        colorClass: 'text-sky-400',
        bgClass: 'bg-sky-900/30 border-sky-500/30',
        stepNumber: 10,
        description: 'Handed over to premier courier partner with tracking.',
      };
    case 'OUT_FOR_DELIVERY':
      return {
        label: 'Out for Delivery',
        colorClass: 'text-cyan-400',
        bgClass: 'bg-cyan-900/30 border-cyan-500/30',
        stepNumber: 11,
        description: 'Courier agent is out for delivery to your doorstep today.',
      };
    case 'DELIVERED':
      return {
        label: 'Delivered',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-900/30 border-emerald-500/30',
        stepNumber: 12,
        description: 'Successfully delivered to customer.',
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        colorClass: 'text-red-400',
        bgClass: 'bg-red-900/30 border-red-500/30',
        stepNumber: 0,
        description: 'Order was cancelled.',
      };
    case 'REFUNDED':
      return {
        label: 'Refunded',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-900/30 border-rose-500/30',
        stepNumber: 0,
        description: 'Payment has been refunded.',
      };
    default:
      return {
        label: status,
        colorClass: 'text-gray-400',
        bgClass: 'bg-gray-800 border-gray-700',
        stepNumber: 1,
        description: 'Order in progress.',
      };
  }
}

