"use client";

import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/lib/order-api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: string
  ) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

return (
  <div className="p-4 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
        Order Management
      </h1>

      <p className="mt-2 text-sm sm:text-base text-slate-400">
        Manage customer orders and update status
      </p>
    </div>

    {/* Loading */}
    {loading ? (
      <div
        className="
        rounded-3xl
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        p-8 sm:p-10
        text-center
        text-slate-400
        "
      >
        Loading orders...
      </div>
    ) : (
      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        overflow-hidden
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-3 sm:p-5 text-slate-300 text-sm">
                  Order No
                </th>

                <th className="text-left p-3 sm:p-5 text-slate-300 text-sm">
                  Customer
                </th>

                <th className="text-left p-3 sm:p-5 text-slate-300 text-sm">
                  Email
                </th>

                <th className="text-left p-3 sm:p-5 text-slate-300 text-sm">
                  Total
                </th>

                <th className="text-left p-3 sm:p-5 text-slate-300 text-sm">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="
                    text-center
                    p-8 sm:p-10
                    text-slate-500
                    "
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="
                    border-b
                    border-white/5
                    hover:bg-white/5
                    transition-all
                    duration-300
                    "
                  >
                    {/* Order Number */}
                    <td className="p-3 sm:p-5">
                      <span className="font-medium text-white">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-3 sm:p-5 text-white">
                      {order.user?.firstName}{" "}
                      {order.user?.lastName}
                    </td>

                    {/* Email */}
                    <td className="p-3 sm:p-5 text-slate-400">
                      {order.user?.email}
                    </td>

                    {/* Total */}
                    <td className="p-3 sm:p-5">
                      <span className="font-semibold text-emerald-400">
                        ₹{order.total}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3 sm:p-5">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                        className="
                        w-full
                        min-w-[140px]

                        px-3 sm:px-4
                        py-2

                        text-sm

                        rounded-xl

                        bg-[#131827]

                        border
                        border-white/10

                        text-white

                        focus:outline-none
                        focus:border-cyan-500/50
                        "
                      >
                        <option value="PENDING">
                          PENDING
                        </option>

                        <option value="PROCESSING">
                          PROCESSING
                        </option>

                        <option value="SHIPPED">
                          SHIPPED
                        </option>

                        <option value="DELIVERED">
                          DELIVERED
                        </option>

                        <option value="CANCELLED">
                          CANCELLED
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
}