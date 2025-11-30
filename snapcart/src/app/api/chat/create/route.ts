import { NextResponse } from "next/server";
import ChatRoom from "@/models/chatRoom.model";
import connectDb from "@/lib/db";


export async function POST(req: Request) {
  await connectDb();
  const { orderId, userId, deliveryBoyId } = await req.json();

  let room = await ChatRoom.findOne({ orderId });
  if (!room) {
    room = await ChatRoom.create({ orderId, userId, deliveryBoyId });
  }

  return NextResponse.json({ success: true, room });
}
