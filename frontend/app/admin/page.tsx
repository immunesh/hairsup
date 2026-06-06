async function getStats() {
  try {
    const [productsRes, usersRes, ordersRes] = await Promise.all([
      fetch("http://localhost:5000/api/products", {
        cache: "no-store",
      }),
      fetch("http://localhost:5000/api/users", {
        cache: "no-store",
      }),
      fetch("http://localhost:5000/api/orders/admin/all", {
        cache: "no-store",
      }),
    ]);

    const productsData = await productsRes.json();
    const usersData = await usersRes.json();
    const ordersData = await ordersRes.json();

    const products = productsData.data || [];
    const users = usersData.data || [];
    const orders = ordersData.data || [];

    const revenue = orders.reduce(
      (sum: number, order: any) =>
        sum + Number(order.total || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order: any) => order.status === "PENDING"
    ).length;

    const deliveredOrders = orders.filter(
      (order: any) => order.status === "DELIVERED"
    ).length;

    return {
      products: products.length,
      users: users.length,
      orders: orders.length,
      revenue,
      pendingOrders,
      deliveredOrders,
    };
  } catch (error) {
    console.error(error);

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

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-6

      transition-all
      duration-300

      hover:-translate-y-1
      hover:border-white/20
      hover:shadow-2xl
      "
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-4 text-5xl font-bold text-white">
        {value}
      </h2>

      <div
        className={`mt-5 h-1 w-16 rounded-full ${color}`}
      />
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div
      className="
      min-h-screen
      p-8

      bg-gradient-to-br
      from-[#0b1020]
      via-[#131827]
      to-[#1b1634]
      "
    >
      {/* Header */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stats Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Products"
          value={stats.products}
          color="bg-cyan-400"
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          color="bg-purple-400"
        />

        <StatCard
          title="Users"
          value={stats.users}
          color="bg-pink-400"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          color="bg-emerald-400"
        />

        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          color="bg-yellow-400"
        />

        <StatCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          color="bg-green-400"
        />
      </div>

      {/* Analytics Section */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-6
          "
        >
          <h3 className="text-lg font-semibold text-white">
            Revenue Analytics
          </h3>

          <div className="mt-6 flex h-64 items-center justify-center text-slate-500">
            Revenue Chart Coming Soon
          </div>
        </div>

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-6
          "
        >
          <h3 className="text-lg font-semibold text-white">
            Order Analytics
          </h3>

          <div className="mt-6 flex h-64 items-center justify-center text-slate-500">
            Orders Chart Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}