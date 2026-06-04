'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-8">
        HairsUp Admin
      </h1>

      <div className="space-y-2">

        <Link href="/admin" className="block p-2 hover:bg-gray-800 rounded">
          Dashboard
        </Link>

        <Link href="/admin/products" className="block p-2 hover:bg-gray-800 rounded">
          Products
        </Link>

        <Link href="/admin/categories" className="block p-2 hover:bg-gray-800 rounded">
          Categories
        </Link>

        <Link href="/admin/orders" className="block p-2 hover:bg-gray-800 rounded">
          Orders
        </Link>

        <Link href="/admin/users" className="block p-2 hover:bg-gray-800 rounded">
          Users
        </Link>

        <Link href="/admin/carts" className="block p-2 hover:bg-gray-800 rounded">
          Cart
        </Link>

        <Link href="/admin/wishlist" className="block p-2 hover:bg-gray-800 rounded">
          Wishlist
        </Link>

        <Link href="/admin/reviews" className="block p-2 hover:bg-gray-800 rounded">
          Reviews
        </Link>

        <Link href="/admin/coupons" className="block p-2 hover:bg-gray-800 rounded">
          Coupons
        </Link>

        <Link href="/admin/blogs" className="block p-2 hover:bg-gray-800 rounded">
          Blogs
        </Link>

        <Link href="/admin/stores" className="block p-2 hover:bg-gray-800 rounded">
          Stores
        </Link>

      </div>
    </div>
  );
}