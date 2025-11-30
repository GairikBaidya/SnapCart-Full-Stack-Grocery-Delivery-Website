import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { emitSocketEvent } from "@/lib/emitSocketEvent";




export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();
    const { userId, items, totalAmount, paymentMethod, address } = body;

    if (!userId || !items?.length || !paymentMethod || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create new Order
    const newOrder = await Order.create({
      user: new mongoose.Types.ObjectId(userId),
      items: items.map((item: any) => ({
        product: new mongoose.Types.ObjectId(item.product),
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      paymentMethod,
      address,
    });

    // ✅ Push order to user’s myOrders array
    await User.findByIdAndUpdate(userId, {
      $push: { myOrders: newOrder._id },
    });
   await newOrder.populate("assignedDeliveryBoy", "name email mobile")
  await emitSocketEvent("new-order", newOrder);
        

    return NextResponse.json(
      { success: true, message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}