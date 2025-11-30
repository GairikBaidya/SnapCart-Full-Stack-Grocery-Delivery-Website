import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDb();

    const { orderId } =await params;

    const order: any = await Order.findById(orderId)
      .populate("assignedDeliveryBoy", "name mobile location")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const addressLocation = {
      latitude: Number(order.address?.latitude),
      longitude: Number(order.address?.longitude),
    };

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          status: order.status,
          totalAmount: order.totalAmount,

          address: {
            ...order.address,
            latitude: addressLocation.latitude,
            longitude: addressLocation.longitude,
          },

          assignedDeliveryBoy: order.assignedDeliveryBoy
            ? {
                name: order.assignedDeliveryBoy.name,
                mobile: order.assignedDeliveryBoy.mobile,
                location: order.assignedDeliveryBoy.location || null,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Track order API error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
