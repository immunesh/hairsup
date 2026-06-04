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

return ( <div> <div className="flex justify-between items-center mb-6"> <div> <h1 className="text-4xl font-bold">
Order Details </h1>


      <p className="text-gray-500 mt-1">
        {
          order.orderNumber
        }
      </p>
    </div>

    <Link
      href="/admin/orders"
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Back
    </Link>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-4">
        Customer Information
      </h2>

      <p>
        <strong>Name:</strong>{" "}
        {order.user.firstName}{" "}
        {order.user.lastName}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {order.user.email}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {order.user.phone ||
          "-"}
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-4">
        Shipping Address
      </h2>

      <p>
        {
          order.address
            .fullName
        }
      </p>

      <p>
        {
          order.address
            .line1
        }
      </p>

      {order.address
        .line2 && (
        <p>
          {
            order.address
              .line2
          }
        </p>
      )}

      <p>
        {
          order.address
            .city
        }
        ,{" "}
        {
          order.address
            .state
        }
      </p>

      <p>
        {
          order.address
            .pincode
        }
      </p>

      <p>
        {
          order.address
            .country
        }
      </p>
    </div>
  </div>

  <div className="bg-white p-6 rounded-xl shadow border mt-6">
    <h2 className="text-xl font-semibold mb-4">
      Ordered Products
    </h2>

    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-3">
            Product
          </th>

          <th className="text-left p-3">
            Qty
          </th>

          <th className="text-left p-3">
            Price
          </th>

          <th className="text-left p-3">
            Total
          </th>
        </tr>
      </thead>

      <tbody>
        {order.items.map(
          (item: any) => (
            <tr
              key={item.id}
              className="border-b"
            >
              <td className="p-3">
                {item.name}
              </td>

              <td className="p-3">
                {
                  item.quantity
                }
              </td>

              <td className="p-3">
                ₹{item.price}
              </td>

              <td className="p-3">
                ₹
                {item.price *
                  item.quantity}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  </div>

  <div className="bg-white p-6 rounded-xl shadow border mt-6">
    <h2 className="text-xl font-semibold mb-4">
      Order Summary
    </h2>

    <div className="space-y-2">
      <p>
        <strong>
          Subtotal:
        </strong>{" "}
        ₹
        {
          order.subtotal
        }
      </p>

      <p>
        <strong>
          Discount:
        </strong>{" "}
        ₹
        {
          order.discount
        }
      </p>

      <p>
        <strong>
          Shipping:
        </strong>{" "}
        ₹
        {
          order.shipping
        }
      </p>

      <p>
        <strong>
          Tax:
        </strong>{" "}
        ₹{order.tax}
      </p>

      <p className="text-lg font-bold">
        Total: ₹
        {order.total}
      </p>

      <p>
        <strong>
          Payment Status:
        </strong>{" "}
        {
          order.paymentStatus
        }
      </p>

      <p>
        <strong>
          Order Status:
        </strong>{" "}
        {order.status}
      </p>
      <div className="mt-4">
  <UpdateOrderStatus
    orderId={order.id}
    currentStatus={
      order.status
    }
  />
</div>
    </div>
  </div>

  <div className="bg-white p-6 rounded-xl shadow border mt-6">
    <h2 className="text-xl font-semibold mb-4">
      Tracking History
    </h2>

    <div className="space-y-4">
      {order.tracking.map(
        (track: any) => (
          <div
            key={
              track.id
            }
            className="border-l-4 border-purple-500 pl-4"
          >
            <p className="font-semibold">
              {
                track.status
              }
            </p>

            <p className="text-gray-600">
              {
                track.message
              }
            </p>

            <p className="text-sm text-gray-400">
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
