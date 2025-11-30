import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { id } =await params;
    if (!id)
      return NextResponse.json({
        success: false,
        message: "deliveryBoyId required",
      });

    // 🟢 Delivered orders only
    const deliveredOrders = await Order.find({
      assignedDeliveryBoy: id,
      deliveryOtpVerified: true,
    });

    // Today's Earnings
    const today = new Date();
    const todayDelivered = deliveredOrders.filter(
      (order) =>
        new Date(order.deliveredAt!).toDateString() === today.toDateString()
    );
    const todayEarnings = todayDelivered.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Monthly Earnings
    const month = today.getMonth();
    const year = today.getFullYear();
    const monthDelivered = deliveredOrders.filter(
      (order) =>
        new Date(order.deliveredAt!).getMonth() === month &&
        new Date(order.deliveredAt!).getFullYear() === year
    );
    const monthEarnings = monthDelivered.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Total Earnings — All Time
    const allTimeEarnings = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const earningsData = {
      today: {
        deliveredCount: todayDelivered.length,
        earnings: todayEarnings,
      },
      month: {
        deliveredCount: monthDelivered.length,
        earnings: monthEarnings,
      },
      allTime: {
        deliveredCount: deliveredOrders.length,
        earnings: allTimeEarnings,
      },
    };

    return NextResponse.json({ success: true, data: earningsData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error", err });
  }
}
