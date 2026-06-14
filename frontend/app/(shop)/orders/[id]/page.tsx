'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package, MapPin, CreditCard, ArrowLeft, Download,
  CheckCircle, Truck, ChevronRight,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ordersApi } from '@/lib/api';
const MOCK_ORDER: Order = {
  id: '1',
  orderNumber: 'HU-DEMO-001',
  status: 'SHIPPED',
  paymentStatus: 'PAID',
  paymentMethod: 'UPI',
  subtotal: 3499,
  discount: 0,
  shipping: 0,
  tax: 629,
  total: 4128,
  estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  items: [
    {
      id: '1', productId: '1', name: 'Silky Straight Lace Front Wig',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
      quantity: 1, price: 3499,
    },
  ],
  address: {
    id: '1', type: 'HOME', fullName: 'Priya Sharma', phone: '9876543210',
    line1: '123, Sunshine Apartments, MG Road', city: 'Mumbai',
    state: 'Maharashtra', pincode: '400001', country: 'India', isDefault: true,
  },
  tracking: [
    { id: '4', status: 'SHIPPED', message: 'Package picked up by courier partner (Blue Dart).', location: 'Mumbai Warehouse', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: '3', status: 'PROCESSING', message: 'Quality checked and packed. Ready for dispatch.', location: 'Mumbai Fulfillment Centre', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
    { id: '2', status: 'CONFIRMED', message: 'Order confirmed. Payment received successfully.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: '1', status: 'PENDING', message: 'Order placed successfully.', createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() },
  ],
  createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
};

const STATUS_TIMELINE = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderDetailPage() {
  const params = useParams();
const [order, setOrder] = useState<Order | null>(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadOrder = async () => {
    try {
      setLoading(true);

      const { data } =
        await ordersApi.getById(
          params.id as string
        );

      setOrder(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (params.id) {
    loadOrder();
  }
}, [params.id]);

if (loading) {
  return (
    <div className="container-custom py-10">
      Loading...
    </div>
  );
}

if (!order) {
  return (
    <div className="container-custom py-10">
      Order not found
    </div>
  );
}
  const currentStatusIdx = STATUS_TIMELINE.indexOf(order.status);

  return (
    <div className="container-custom py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={cn('badge text-sm font-semibold px-3 py-1', ORDER_STATUS_COLORS[order.status])}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <button className="flex items-center gap-1.5 text-sm text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Invoice
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: tracking + items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tracking timeline */}
          {!['CANCELLED', 'RETURNED'].includes(order.status) && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-600" /> Order Tracking
              </h2>

              {/* Progress bar */}
              <div className="relative mb-8">
                <div className="flex justify-between items-center mb-2">
                  {STATUS_TIMELINE.slice(0, 5).map((status, i) => (
                    <div key={status} className="flex flex-col items-center gap-1 flex-1">
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 text-xs font-bold transition-all',
                        i < currentStatusIdx ? 'bg-green-500 border-green-500 text-white' :
                        i === currentStatusIdx ? 'bg-brand-600 border-brand-600 text-white scale-110' :
                        'bg-white border-gray-300 text-gray-400'
                      )}>
                        {i < currentStatusIdx ? '✓' : i + 1}
                      </div>
                      <span className={cn('text-xs text-center leading-tight hidden sm:block', i <= currentStatusIdx ? 'text-gray-700 font-medium' : 'text-gray-400')}>
                        {ORDER_STATUS_LABELS[status]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-4">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-brand-600 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(currentStatusIdx / 4 * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Estimated delivery */}
              {order.estimatedDelivery && !['DELIVERED', 'CANCELLED'].includes(order.status) && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-brand-700 font-medium">
                    📦 Estimated Delivery: <span className="font-bold">{formatDate(order.estimatedDelivery)}</span>
                  </p>
                </div>
              )}

              {/* Tracking events */}
              <div className="space-y-4">
                {order.tracking.map((event, i) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        i === 0 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'
                      )}>
                        {i === 0 ? <Truck className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                      {i < order.tracking.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={cn('font-semibold text-sm', i === 0 ? 'text-brand-700' : 'text-gray-600')}>
                        {event.message}
                      </p>
                      {event.location && <p className="text-xs text-gray-500 mt-0.5">📍 {event.location}</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-600" /> Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  {item.image && (
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                    {item.variant && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.variant).map(([k, v]) => (
                          <span key={k} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{k}: {v}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: address + payment + summary */}
        <div className="space-y-5">
          {/* Delivery address */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address
            </h3>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-semibold text-gray-900">{order.address.fullName}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state}</p>
              <p>{order.address.pincode} — {order.address.country}</p>
              <p className="mt-1">📞 {order.address.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" /> Payment
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Method</span>
                <span className="font-medium">{order.paymentMethod || 'UPI'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status</span>
                <span className={cn('font-semibold', order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600')}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span><span>{formatPrice(order.tax)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                <span>Total Paid</span><span className="text-brand-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {order.status === 'DELIVERED' && (
              <Link href={`/products`} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
                Buy Again
              </Link>
            )}
            {['PENDING', 'CONFIRMED'].includes(order.status) && (
              <button className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2.5 rounded-full transition-colors text-sm">
                Cancel Order
              </button>
            )}
            <Link href="/contact" className="block text-center text-sm text-brand-600 hover:underline">
              Need help with this order? →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
