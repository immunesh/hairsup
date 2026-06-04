async function getStats() {
try {
const [
productsRes,
usersRes,
ordersRes,
] = await Promise.all([
fetch(
"http://localhost:5000/api/products",
{ cache: "no-store" }
),
fetch(
"http://localhost:5000/api/users",
{ cache: "no-store" }
),
fetch(
"http://localhost:5000/api/orders/admin/all",
{ cache: "no-store" }
),
]);


const productsData =
  await productsRes.json();

const usersData =
  await usersRes.json();

const ordersData =
  await ordersRes.json();

const products =
  productsData.data || [];

const users =
  usersData.data || [];

const orders =
  ordersData.data || [];

const revenue =
  orders.reduce(
    (
      sum: number,
      order: any
    ) => sum + order.total,
    0
  );

const pendingOrders =
  orders.filter(
    (order: any) =>
      order.status ===
      "PENDING"
  ).length;

const deliveredOrders =
  orders.filter(
    (order: any) =>
      order.status ===
      "DELIVERED"
  ).length;

return {
  products:
    products.length,
  users: users.length,
  orders: orders.length,
  revenue,
  pendingOrders,
  deliveredOrders,
};


} catch {
return {
products: 0,
users: 0,
orders: 0,
revenue: 0,
pendingOrders: 0,
deliveredOrders: 0,
};
}
}

export default async function AdminDashboard() {
const stats =
await getStats();

return ( <div className="p-8"> <h1 className="text-4xl font-bold mb-8">
Dashboard </h1>


  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Products
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {
          stats.products
        }
      </h2>
    </div>

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Orders
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {stats.orders}
      </h2>
    </div>

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Users
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {stats.users}
      </h2>
    </div>

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Revenue
      </p>

      <h2 className="text-4xl font-bold mt-2">
        ₹
        {stats.revenue.toLocaleString()}
      </h2>
    </div>

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Pending Orders
      </p>

      <h2 className="text-4xl font-bold text-yellow-600 mt-2">
        {
          stats.pendingOrders
        }
      </h2>
    </div>

    <div className="bg-white rounded-2xl shadow border p-6">
      <p className="text-gray-500">
        Delivered Orders
      </p>

      <h2 className="text-4xl font-bold text-green-600 mt-2">
        {
          stats.deliveredOrders
        }
      </h2>
    </div>

  </div>
</div>


);
}
