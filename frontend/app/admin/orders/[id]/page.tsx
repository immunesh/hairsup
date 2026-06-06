import Link from "next/link";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";
async function getOrder(id: string) {
try {
const res = await fetch(
`http://localhost:5000/api/orders/admin/${id}`,
{
cache: "no-store",
}
);


if (!res.ok) {
  throw new Error(
    "Failed to fetch order"
  );
}

const data = await res.json();

return data.data;


} catch (error) {
console.error(error);
return null;
}
}

export default async function OrderDetailsPage({
params,
}: {
params: {
id: string;
};
}) {
const order = await getOrder(
params.id
);

if (!order) {
return ( <div className="p-6"> <h1 className="text-2xl font-bold">
Order Not Found </h1> </div>
);
}

return (
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Order Details
        </h1>

        <p className="text-slate-400 mt-2">
          {order.orderNumber}
        </p>
      </div>

      <Link
        href="/admin/orders"
        className="
        px-5
        py-3

        rounded-2xl

        bg-white/5
        border
        border-white/10

        text-slate-300

        hover:bg-white/10
        hover:text-white

        transition-all
        duration-300
        "
      >
        ← Back
      </Link>
    </div>

    {/* Top Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer */}
      <div
        className="
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-6
        "
      >
        <h2 className="text-xl font-semibold text-white mb-5">
          Customer Information
        </h2>

        <div className="space-y-3 text-slate-300">
          <p>
            <span className="text-white font-medium">
              Name:
            </span>{" "}
            {order.user.firstName}{" "}
            {order.user.lastName}
          </p>

          <p>
            <span className="text-white font-medium">
              Email:
            </span>{" "}
            {order.user.email}
          </p>

          <p>
            <span className="text-white font-medium">
              Phone:
            </span>{" "}
            {order.user.phone || "-"}
          </p>
        </div>
      </div>

      {/* Shipping */}
      <div
        className="
        rounded-3xl
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        p-6
        "
      >
        <h2 className="text-xl font-semibold text-white mb-5">
          Shipping Address
        </h2>

        <div className="space-y-2 text-slate-300">
          <p>{order.address.fullName}</p>
          <p>{order.address.line1}</p>

          {order.address.line2 && (
            <p>{order.address.line2}</p>
          )}

          <p>
            {order.address.city},{" "}
            {order.address.state}
          </p>

          <p>{order.address.pincode}</p>

          <p>{order.address.country}</p>
        </div>
      </div>
    </div>

    {/* Ordered Products */}
    <div
      className="
      mt-6

      rounded-3xl
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10

      overflow-x-auto
      "
    >
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">
          Ordered Products
        </h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left p-5 text-slate-300">
              Product
            </th>

            <th className="text-left p-5 text-slate-300">
              Qty
            </th>

            <th className="text-left p-5 text-slate-300">
              Price
            </th>

            <th className="text-left p-5 text-slate-300">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item: any) => (
            <tr
              key={item.id}
              className="
              border-b
              border-white/5

              hover:bg-white/5
              "
            >
              <td className="p-5 text-white">
                {item.name}
              </td>

              <td className="p-5 text-slate-300">
                {item.quantity}
              </td>

              <td className="p-5 text-slate-300">
                ₹{item.price}
              </td>

              <td className="p-5 font-medium text-emerald-400">
                ₹
                {item.price *
                  item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Summary */}
    <div
      className="
      mt-6

      rounded-3xl
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10

      p-6
      "
    >
      <h2 className="text-xl font-semibold text-white mb-5">
        Order Summary
      </h2>

      <div className="space-y-3 text-slate-300">
        <p>
          <span className="font-medium text-white">
            Subtotal:
          </span>{" "}
          ₹{order.subtotal}
        </p>

        <p>
          <span className="font-medium text-white">
            Discount:
          </span>{" "}
          ₹{order.discount}
        </p>

        <p>
          <span className="font-medium text-white">
            Shipping:
          </span>{" "}
          ₹{order.shipping}
        </p>

        <p>
          <span className="font-medium text-white">
            Tax:
          </span>{" "}
          ₹{order.tax}
        </p>

        <div className="h-px bg-white/10 my-3" />

        <p className="text-2xl font-bold text-emerald-400">
          ₹{order.total}
        </p>

        <p>
          <span className="font-medium text-white">
            Payment Status:
          </span>{" "}
          <span className="text-cyan-400">
            {order.paymentStatus}
          </span>
        </p>

        <p>
          <span className="font-medium text-white">
            Order Status:
          </span>{" "}
          <span className="text-purple-400">
            {order.status}
          </span>
        </p>

        <div className="pt-4">
          <UpdateOrderStatus
            orderId={order.id}
            currentStatus={
              order.status
            }
          />
        </div>
      </div>
    </div>

    {/* Tracking */}
    <div
      className="
      mt-6

      rounded-3xl
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10

      p-6
      "
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        Tracking History
      </h2>

      <div className="space-y-5">
        {order.tracking.map(
          (track: any) => (
            <div
              key={track.id}
              className="
              border-l-4
              border-cyan-500

              pl-5
              "
            >
              <p className="font-semibold text-white">
                {track.status}
              </p>

              <p className="text-slate-300 mt-1">
                {track.message}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                {new Date(
                  track.createdAt
                ).toLocaleString()}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  </div>
);
}
