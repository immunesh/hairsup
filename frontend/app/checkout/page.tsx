'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Plus, MapPin, CreditCard, Truck, Shield, Check, Loader2 } from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { ordersApi, userApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Address } from '@/types';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Pay via GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
  { id: 'emi', label: 'EMI', icon: '📅', desc: 'No-cost EMI on credit cards' },
];

const STEPS = ['Address', 'Review', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { showToast } = useUIStore();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [couponCode, setCouponCode] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    userApi.getAddresses().then(({ data }) => {
      setAddresses(data.data);
      const def = data.data.find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, [isAuthenticated, router]);

  const shipping = total >= 999 ? 0 : 99;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { showToast('Please select a delivery address', 'error'); return; }
    setPlacing(true);
    try {
      const { data } = await ordersApi.create({
        addressId: selectedAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
      });
      clearCart();
      router.push(`/order-confirmed?id=${data.data.orderNumber}`);
    } catch {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticated) return null;

  const MOCK_ADDRESSES: Address[] = addresses.length > 0 ? addresses : [
    {
      id: 'demo-1', type: 'HOME', fullName: user?.firstName + ' ' + user?.lastName || 'Customer',
      phone: user?.phone || '9876543210', line1: '123, Sample Apartment, MG Road',
      city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India', isDefault: true,
    },
  ];

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-display font-bold mb-6">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white cursor-pointer' :
                i === step ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </button>
            <span className={`text-sm font-medium ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 0: Address */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> Delivery Address
              </h2>
              <div className="space-y-3">
                {MOCK_ADDRESSES.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedAddress === addr.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  }`}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1 text-brand-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{addr.fullName}</span>
                        <span className="badge bg-gray-100 text-gray-600 text-xs">{addr.type}</span>
                        {addr.isDefault && <span className="badge bg-green-100 text-green-700 text-xs">Default</span>}
                      </div>
                      <p className="text-sm text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>
                    </div>
                  </label>
                ))}
                <Link href="/profile#addresses" className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-all font-medium">
                  <Plus className="w-4 h-4" /> Add New Address
                </Link>
              </div>
              <button onClick={() => setStep(1)} disabled={!selectedAddress} className="btn-primary mt-6 flex items-center gap-2 disabled:opacity-50">
                Continue to Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: Review */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Review Your Order</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const img = item.product.images?.find((i) => i.isPrimary) || item.product.images?.[0];
                  const price = item.product.salePrice || item.product.basePrice;
                  return (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                      {img && <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0"><Image src={img.url} alt={item.product.name} fill className="object-cover" /></div>}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">{formatPrice(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Truck className="w-4 h-4 text-brand-600" /> Delivery to:</p>
                {MOCK_ADDRESSES.find((a) => a.id === selectedAddress) && (() => {
                  const addr = MOCK_ADDRESSES.find((a) => a.id === selectedAddress)!;
                  return <p className="text-sm text-gray-600">{addr.line1}, {addr.city}, {addr.state} {addr.pincode}</p>;
                })()}
              </div>
              {/* Coupon */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Coupon Code (optional)</label>
                <div className="flex gap-2">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. FIRST20" className="input-field flex-1 text-sm py-2" />
                  <button className="btn-secondary text-sm py-2 px-4">Apply</button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-ghost border border-gray-200">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" /> Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  }`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="text-brand-600" />
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-green-700">
                <Shield className="w-4 h-4 flex-shrink-0" /> Your payment is 100% secure and encrypted
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost border border-gray-200">← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex items-center gap-2 flex-1 justify-center py-3.5">
                  {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : <>Place Order — {formatPrice(grandTotal)}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="card p-5 h-fit space-y-3 sticky top-24">
          <h3 className="font-bold text-gray-900">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal ({items.length} items)</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-brand-600">{formatPrice(grandTotal)}</span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>✓ Free delivery on orders above ₹999</p>
            <p>✓ Estimated delivery in 3–5 business days</p>
            <p>✓ 7-day hassle-free returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
