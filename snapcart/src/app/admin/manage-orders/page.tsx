import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import ManageOrdersClient from "@/components/ManageOrdersClient";

export const dynamic = "force-dynamic";

export default async function ManageOrders() {
  await connectDb();

  // ✅ Fetch all orders with user populated
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("assignedDeliveryBoy")
    .sort({ createdAt: -1 })
    .lean();

  const plainOrders = JSON.parse(JSON.stringify(orders));

  return <ManageOrdersClient orders={plainOrders} />;
}
