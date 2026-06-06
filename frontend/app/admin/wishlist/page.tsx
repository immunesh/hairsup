"use client";

import { useEffect, useState } from "react";
import { getAllWishlists } from "@/lib/wishlist-admin-api";

export default function AdminWishlistPage() {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      const res = await getAllWishlists();

      setWishlists(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading wishlist...
      </div>
    );
  }

 return (
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Wishlist Management
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor customer wishlist activity
        </p>
      </div>

      <div
        className="
        px-5
        py-3

        rounded-2xl

        bg-pink-500/10
        border
        border-pink-500/20

        text-pink-300
        font-medium
        "
      >
        Total Items: {wishlists.length}
      </div>
    </div>

    {/* Table */}
    <div
      className="
      rounded-3xl

      bg-white/5
      backdrop-blur-xl

      border
      border-white/10

      overflow-hidden
      "
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-5 text-left text-slate-300">
              User
            </th>

            <th className="p-5 text-left text-slate-300">
              Email
            </th>

            <th className="p-5 text-left text-slate-300">
              Product
            </th>

            <th className="p-5 text-left text-slate-300">
              Quantity
            </th>

            <th className="p-5 text-left text-slate-300">
              Added
            </th>
          </tr>
        </thead>

        <tbody>
          {wishlists.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="
                p-12
                text-center
                text-slate-500
                "
              >
                No wishlist items found
              </td>
            </tr>
          ) : (
            wishlists.map((item) => (
              <tr
                key={item.id}
                className="
                border-b
                border-white/5

                hover:bg-white/5

                transition-all
                duration-300
                "
              >
                {/* User */}
                <td className="p-5">
                  <div className="font-medium text-white">
                    {item.user?.firstName}{" "}
                    {item.user?.lastName}
                  </div>
                </td>

                {/* Email */}
                <td className="p-5 text-slate-300">
                  {item.user?.email}
                </td>

                {/* Product */}
                <td className="p-5 text-white">
                  {item.product?.name}
                </td>

                {/* Qty */}
                <td className="p-5">
                  <span
                    className="
                    px-3
                    py-1

                    rounded-full

                    text-xs
                    font-semibold

                    bg-pink-500/20
                    text-pink-300

                    border
                    border-pink-500/20
                    "
                  >
                    1
                  </span>
                </td>

                {/* Date */}
                <td className="p-5 text-slate-400">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}