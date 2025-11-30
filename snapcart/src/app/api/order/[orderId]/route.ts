import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await connectDb();
  
  const { orderId } =await params;

  try {
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address: {
        latitude: order.address.latitude,
        longitude: order.address.longitude,
        fullAddress: order.address.fullAddress,
      },
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message },
      { status: 500 }
    );
  }
}
