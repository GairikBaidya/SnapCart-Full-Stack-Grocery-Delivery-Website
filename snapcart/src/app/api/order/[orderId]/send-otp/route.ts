import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  try {
    await connectDb();

    // 🔥 Correct way — params is a Promise
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId required" });
    }

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    order.deliveryOtp = otp;
    await order.save();

    await sendMail(
      order.user.email,
      "Your Delivery OTP",
      `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`
    );

    return NextResponse.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP" });
  }
}
