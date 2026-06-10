import type { OrderStatus } from "@/constants/orderStatus";
import type { PaymentStatus } from "@/constants/paymentStatus";

export type DeliveryType = "DELIVERY" | "PICKUP" | "EXPRESS" | "STANDARD" | string;

export type Order = {
  _id?: string;
  id: string;
  orderCode: string;
  customer?: OrderCustomer | string | null;
  customerId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryType?: DeliveryType;
  items?: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  totalAmount?: number;
  total?: number;
  payment?: PaymentInfo | null;
  shipment?: ShipmentInfo | null;
  shippingAddress?: ShippingAddress | null;
  statusHistory?: OrderStatusHistory[];
  timeline?: OrderStatusHistory[];
  createdAt?: string;
  updatedAt?: string;
};

export type OrderItem = {
  _id?: string;
  id?: string;
  product?: OrderProductRef | string | null;
  variant?: OrderVariantRef | string | null;
  productName?: string;
  variantName?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  price: number;
  salePrice?: number | null;
  total?: number;
  lineTotal?: number;
};

export type OrderCustomer = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export type OrderProductRef = {
  _id?: string;
  id?: string;
  name: string;
  sku?: string;
};

export type OrderVariantRef = {
  _id?: string;
  id?: string;
  name: string;
  barcode?: string | null;
};

export type ShippingAddress = {
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
};

export type PaymentInfo = {
  method?: string;
  provider?: string;
  transactionId?: string;
  paidAt?: string;
  status?: PaymentStatus;
};

export type ShipmentInfo = {
  deliveryType?: DeliveryType;
  carrier?: string;
  trackingCode?: string;
  shippedAt?: string;
  deliveredAt?: string;
  note?: string;
};

export type OrderStatusHistory = {
  _id?: string;
  id?: string;
  status: OrderStatus;
  note?: string | null;
  createdAt?: string;
  updatedBy?: OrderCustomer | string | null;
};
