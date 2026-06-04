import Link from "next/link";

async function getOrders() {
try {
const res = await fetch(
"http://localhost:5000/api/orders/admin/all",
{
cache: "no-store",
}
);


if (!res.ok) {
  return [];
}

const data = await res.json();

return data.data || [];


} catch (error) {
console.error(error);
return [];
}
}

export default async function OrdersPage() {
const orders = await getOrders();

return ( <div> <div className="flex items-center justify-between mb-6"> <div> <h1 className="text-4xl font-bold">
Orders </h1>


      <p className="text-gray-500 mt-1">
        Manage all customer orders
      </p>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow border overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="p-4 text-left">
            Order Number
          </th>

          <th className="p-4 text-left">
            Customer
          </th>

          <th className="p-4 text-left">
            Email
          </th>

          <th className="p-4 text-left">
            Total
          </th>

          <th className="p-4 text-left">
            Payment
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-left">
            Date
          </th>

          <th className="p-4 text-left">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="text-center p-10 text-gray-500"
            >
              No Orders Found
            </td>
          </tr>
        ) : (
          orders.map((order: any) => (
            <tr
              key={order.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4 font-medium">
                {order.orderNumber}
              </td>

              <td className="p-4">
                {order.user?.firstName}{" "}
                {order.user?.lastName}
              </td>

              <td className="p-4">
                {order.user?.email}
              </td>

              <td className="p-4 font-semibold">
                ₹{order.total}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus ===
                    "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status ===
                    "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order.status ===
                        "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>

              <td className="p-4">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </td>

              <td className="p-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                >
                  View
                </Link>
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
