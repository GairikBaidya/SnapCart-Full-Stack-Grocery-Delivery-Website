import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDb();

    const { orderId } =await params; // 🔥 Correct way to get orderId from dynamic route
    const { otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json({
        success: false,
        message: "orderId and OTP are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }

    // ✔ Mark order as delivered
    order.status = "delivered";
    order.deliveryOtpVerified = true;
    order.deliveredAt = new Date();
    await order.save();

    // 🔥 Remove assigned delivery boy & complete assignment
    await DeliveryAssignment.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } }
    );

    return NextResponse.json({
      success: true,
      message: "Delivery Completed Successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json({ success: false, error });
  }
}
