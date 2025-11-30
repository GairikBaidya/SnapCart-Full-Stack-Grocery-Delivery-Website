import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  await connectDb();

  // Fetch in parallel
  const [orders, users, products] = await Promise.all([
    Order.find({}),
    User.find({ role: "user" }),
    Grocery.find({}),
  ]);

  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Dates
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  // Earnings filter calculations
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday
  );
  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const sevenDayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sevenDaysAgo
  );
  const sevenDayRevenue = sevenDayOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  // ✅ Generate chart data for last 7 days
  const recentOrders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo, $lte: today },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const found = recentOrders.find((r) => r._id === key);
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day,
      orders: found ? found.orderCount : 0,
    };
  });

  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Customers", value: totalCustomers },
    { title: "Pending Deliveries", value: pendingDeliveries },
  ];

  // 👇 pass all earnings data to client
  return (
    <AdminDashboardClient
      stats={stats}
      chartData={chartData}
      earnings={{
        today: todayRevenue,
        sevenDays: sevenDayRevenue,
        total: totalRevenue,
      }}
    />
  );
}
