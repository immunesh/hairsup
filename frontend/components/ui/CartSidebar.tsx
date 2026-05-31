'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Gift } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { cartApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateItem, total, itemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.get().then(({ data }) => {
        useCartStore.getState().setItems(data.data);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (id: string, newQty: number) => {
    try {
      if (newQty <= 0) {
        await cartApi.remove(id);
        removeItem(id);
      } else {
        await cartApi.update(id, newQty);
        updateItem(id, newQty);
      }
    } catch {}
  };

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold">Your Bag ({itemCount})</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && total < 999 && (
          <div className="px-6 py-3 bg-brand-50">
            <p className="text-xs text-brand-700 font-medium mb-1.5">
              Add {formatPrice(999 - total)} more for FREE shipping!
            </p>
            <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / 999) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {items.length > 0 && total >= 999 && (
          <div className="px-6 py-3 bg-green-50">
            <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" /> Yay! You qualify for FREE shipping!
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your bag is empty</h3>
              <p className="text-sm text-gray-500 mb-6">Looks like you haven&apos;t added any wigs yet.</p>
              <button onClick={closeCart} className="btn-primary">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const primaryImg = item.product.images?.find((i) => i.isPrimary) || item.product.images?.[0];
                const price = item.product.salePrice || item.product.basePrice;
                return (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                    {primaryImg && (
                      <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                          <Image src={primaryImg.url} alt={item.product.name} fill className="object-cover" />
                        </div>
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors">
                          {item.product.name}
                        </h4>
                      </Link>
                      {item.product.color && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.product.color}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">{formatPrice(price * item.quantity)}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 0)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block text-center text-sm text-brand-600 hover:underline"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
