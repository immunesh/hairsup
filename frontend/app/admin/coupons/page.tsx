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
    <div className="p-8">
      <div
        className="
        rounded-3xl

        bg-white/5
        backdrop-blur-xl

        border
        border-white/10

        p-10

        text-center
        text-slate-400
        "
      >
        Loading coupons...
      </div>
    </div>
  );
}

 return (
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Coupon Management
        </h1>

        <p className="text-slate-400 mt-2">
          Create and manage discount coupons
        </p>
      </div>

      <div
        className="
        px-5
        py-3

        rounded-2xl

        bg-emerald-500/10
        border
        border-emerald-500/20

        text-emerald-300
        font-medium
        "
      >
        Total Coupons: {coupons.length}
      </div>
    </div>

    {/* Create Coupon */}
    <form
      onSubmit={handleCreate}
      className="
      rounded-3xl

      bg-white/5
      backdrop-blur-xl

      border
      border-white/10

      p-8

      mb-8
      "
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Create Coupon
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <input
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value,
            })
          }
          required
          className="
          px-4
          py-3

          rounded-2xl

          bg-white/5

          border
          border-white/10

          text-white

          placeholder:text-slate-500

          focus:outline-none
          focus:border-cyan-500/50
          "
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
          className="
          px-4
          py-3

          rounded-2xl

          bg-[#131827]

          border
          border-white/10

          text-white
          "
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
          value={form.value}
          onChange={(e) =>
            setForm({
              ...form,
              value: e.target.value,
            })
          }
          required
          className="
          px-4
          py-3

          rounded-2xl

          bg-white/5

          border
          border-white/10

          text-white
          "
        />

        <input
          type="number"
          placeholder="Minimum Order"
          value={form.minOrder}
          onChange={(e) =>
            setForm({
              ...form,
              minOrder: e.target.value,
            })
          }
          className="
          px-4
          py-3

          rounded-2xl

          bg-white/5

          border
          border-white/10

          text-white
          "
        />

        <input
          type="number"
          placeholder="Maximum Discount"
          value={form.maxDiscount}
          onChange={(e) =>
            setForm({
              ...form,
              maxDiscount:
                e.target.value,
            })
          }
          className="
          px-4
          py-3

          rounded-2xl

          bg-white/5

          border
          border-white/10

          text-white
          "
        />

        <input
          type="number"
          placeholder="Usage Limit"
          value={form.usageLimit}
          onChange={(e) =>
            setForm({
              ...form,
              usageLimit:
                e.target.value,
            })
          }
          className="
          px-4
          py-3

          rounded-2xl

          bg-white/5

          border
          border-white/10

          text-white
          "
        />

        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) =>
            setForm({
              ...form,
              expiresAt:
                e.target.value,
            })
          }
          className="
          px-4
          py-3

          rounded-2xl

          bg-[#131827]

          border
          border-white/10

          text-white
          "
        />
      </div>

      <button
        type="submit"
        className="
        mt-6

        px-8
        py-3

        rounded-2xl

        bg-gradient-to-r
        from-cyan-500
        to-purple-600

        text-white
        font-medium

        transition-all
        duration-300

        hover:scale-105

        shadow-[0_0_25px_rgba(56,189,248,0.35)]
        "
      >
        Create Coupon
      </button>
    </form>

    {/* Coupons Table */}
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
              Code
            </th>

            <th className="p-5 text-left text-slate-300">
              Type
            </th>

            <th className="p-5 text-left text-slate-300">
              Value
            </th>

            <th className="p-5 text-left text-slate-300">
              Used
            </th>

            <th className="p-5 text-left text-slate-300">
              Expiry
            </th>

            <th className="p-5 text-left text-slate-300">
              Status
            </th>

            <th className="p-5 text-left text-slate-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="
                p-12
                text-center
                text-slate-500
                "
              >
                No coupons found
              </td>
            </tr>
          ) : (
            coupons.map(
              (coupon) => (
                <tr
                  key={coupon.id}
                  className="
                  border-b
                  border-white/5

                  hover:bg-white/5

                  transition-all
                  duration-300
                  "
                >
                  <td className="p-5 font-bold text-cyan-300">
                    {coupon.code}
                  </td>

                  <td className="p-5 text-white">
                    {coupon.type}
                  </td>

                  <td className="p-5 text-white">
                    {coupon.value}
                  </td>

                  <td className="p-5 text-slate-300">
                    {coupon.usedCount}
                  </td>

                  <td className="p-5 text-slate-400">
                    {coupon.expiresAt
                      ? new Date(
                          coupon.expiresAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-5">
                    {coupon.isActive ? (
                      <span
                        className="
                        px-3
                        py-1

                        rounded-full

                        text-xs
                        font-semibold

                        bg-emerald-500/20
                        text-emerald-300

                        border
                        border-emerald-500/20
                        "
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        className="
                        px-3
                        py-1

                        rounded-full

                        text-xs
                        font-semibold

                        bg-red-500/20
                        text-red-300

                        border
                        border-red-500/20
                        "
                      >
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleToggle(
                            coupon.id
                          )
                        }
                        className="
                        px-4
                        py-2

                        rounded-xl

                        bg-blue-500/20
                        border
                        border-blue-500/30

                        text-blue-300

                        hover:bg-blue-500/30
                        hover:text-white

                        transition-all
                        duration-300
                        "
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            coupon.id
                          )
                        }
                        className="
                        px-4
                        py-2

                        rounded-xl

                        bg-red-500/20
                        border
                        border-red-500/30

                        text-red-300

                        hover:bg-red-500/30
                        hover:text-white

                        transition-all
                        duration-300
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}