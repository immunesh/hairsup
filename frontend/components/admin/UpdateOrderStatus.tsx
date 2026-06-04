"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateOrderStatus({
orderId,
currentStatus,
}: {
orderId: string;
currentStatus: string;
}) {
const router = useRouter();

const [status, setStatus] =
useState(currentStatus);

const [loading, setLoading] =
useState(false);

async function handleUpdate() {
try {
setLoading(true);


  const res = await fetch(
    `http://localhost:5000/api/orders/admin/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data =
    await res.json();

  if (!res.ok) {
    alert(
      data.message ||
        "Failed to update status"
    );
    return;
  }

  alert(
    "Order status updated"
  );

  router.refresh();
} catch (error) {
  console.error(error);

  alert(
    "Failed to update status"
  );
} finally {
  setLoading(false);
}


}

return ( <div className="flex gap-3 items-center">
<select
value={status}
onChange={(e) =>
setStatus(
e.target.value
)
}
className="border p-2 rounded"
> <option value="PENDING">
PENDING </option>


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

  <button
    onClick={handleUpdate}
    disabled={loading}
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
  >
    {loading
      ? "Updating..."
      : "Update"}
  </button>
</div>


);
}
