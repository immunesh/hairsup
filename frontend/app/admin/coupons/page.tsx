"use client";

import { useEffect, useState } from "react";
import {
  getAllCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} from "@/lib/coupon-admin-api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await getAllCoupons();
      setCoupons(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrder: form.minOrder
          ? Number(form.minOrder)
          : null,
        maxDiscount: form.maxDiscount
          ? Number(form.maxDiscount)
          : null,
        usageLimit: form.usageLimit
          ? Number(form.usageLimit)
          : null,
        expiresAt:
          form.expiresAt || null,
      });

      setForm({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        expiresAt: "",
      });

      loadCoupons();
    } catch (error) {
      console.error(error);
      alert("Failed to create coupon");
    }
  };

  const handleToggle = async (
    id: string
  ) => {
    try {
      await toggleCoupon(id);
      loadCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this coupon?"
      );

    if (!confirmDelete) return;

    try {
      await deleteCoupon(id);

      setCoupons((prev) =>
        prev.filter(
          (coupon) =>
            coupon.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading coupons...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Coupon Management
        </h1>

        <div className="bg-green-100 px-4 py-2 rounded">
          Total Coupons: {coupons.length}
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded shadow mb-8"
      >
        <h2 className="text-xl font-bold mb-4">
          Create Coupon
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Coupon Code"
            className="border p-3 rounded"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value,
              })
            }
            required
          />

          <select
            className="border p-3 rounded"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="PERCENTAGE">
              Percentage
            </option>

            <option value="FIXED">
              Fixed Amount
            </option>
          </select>

          <input
            type="number"
            placeholder="Value"
            className="border p-3 rounded"
            value={form.value}
            onChange={(e) =>
              setForm({
                ...form,
                value: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Minimum Order"
            className="border p-3 rounded"
            value={form.minOrder}
            onChange={(e) =>
              setForm({
                ...form,
                minOrder: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Maximum Discount"
            className="border p-3 rounded"
            value={form.maxDiscount}
            onChange={(e) =>
              setForm({
                ...form,
                maxDiscount:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Usage Limit"
            className="border p-3 rounded"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({
                ...form,
                usageLimit:
                  e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border p-3 rounded"
            value={form.expiresAt}
            onChange={(e) =>
              setForm({
                ...form,
                expiresAt:
                  e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-black text-white px-5 py-3 rounded"
        >
          Create Coupon
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Code
              </th>

              <th className="p-3 text-left">
                Type
              </th>

              <th className="p-3 text-left">
                Value
              </th>

              <th className="p-3 text-left">
                Used
              </th>

              <th className="p-3 text-left">
                Expiry
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {coupons.map(
              (coupon) => (
                <tr
                  key={coupon.id}
                  className="border-t"
                >
                  <td className="p-3 font-bold">
                    {coupon.code}
                  </td>

                  <td className="p-3">
                    {coupon.type}
                  </td>

                  <td className="p-3">
                    {coupon.value}
                  </td>

                  <td className="p-3">
                    {coupon.usedCount}
                  </td>

                  <td className="p-3">
                    {coupon.expiresAt
                      ? new Date(
                          coupon.expiresAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    {coupon.isActive
                      ? "✅ Active"
                      : "❌ Disabled"}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        handleToggle(
                          coupon.id
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          coupon.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}