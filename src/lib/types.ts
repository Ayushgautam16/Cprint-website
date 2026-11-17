export type Role = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'STAFF';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'CUSTOMIZATION_UNDER_REVIEW'
  | 'DESIGN_APPROVAL_PENDING'
  | 'DESIGN_APPROVED'
  | 'PROCESSING'
  | 'PRINTING_ENGRAVING'
  | 'QUALITY_CHECK'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod =
  | 'RAZORPAY'
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'CASH_ON_DELIVERY';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface CustomizationField {
  id: string;
  label: string;
  fieldType: 'TEXT' | 'TEXTAREA' | 'LOGO_UPLOAD' | 'FONT_SELECTION' | 'COLOR_SELECTION' | 'PLACEMENT_SELECTION';
  placeholder?: string;
  helperText?: string;
  isRequired: boolean;
  maxCharacters?: number;
  extraCharge: number;
  options?: Array<{ label: string; value: string; priceAdjustment?: number }>;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  colorName: string;
  colorCode: string;
  priceAdjustment: number;
  stock: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  discountPrice?: number;
  stock: number;
  minOrderQty: number;
  isCustomizable: boolean;
  engravingType?: string; // e.g. "Precision Laser Engraving", "Embossing"
  additionalCustomizationFee: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  images: string[];
  colors?: string[];
  fonts?: string[];
  variants?: ProductVariant[];
  customizationFields?: CustomizationField[];
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CustomizationDetails {
  customerName?: string;
  customText?: string;
  fontName?: string;
  fontColor?: string;
  placement?: string;
  artworkUrl?: string;
  artworkFileName?: string;
  specialInstructions?: string;
  extraCharges?: number;
  previewImageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  customizationCharges: number;
  customization?: CustomizationDetails;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string;
  unitPrice: number;
  customizationCharge: number;
  quantity: number;
  totalPrice: number;
  customization?: CustomizationDetails;
}

export interface OrderStatusHistoryItem {
  id: string;
  status: OrderStatus;
  notes?: string;
  changedBy: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  customizationTotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  courierName?: string;
  deliveryPartner?: string;
  trackingUrl?: string;
  customerNotes?: string;
  adminNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface WebsiteSettings {
  businessName: string;
  logoUrl: string;
  announcementText: string;
  announcementActive: boolean;
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRatePercent: number;
  razorpayEnabled: boolean;
  codEnabled: boolean;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    amazonStore?: string;
    linkedin?: string;
    twitter?: string;
  };
}

