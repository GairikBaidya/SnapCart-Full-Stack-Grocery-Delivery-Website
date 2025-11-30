import { NextResponse } from "next/server";
import Message from "@/models/message.model";
import ChatRoom from "@/models/chatRoom.model";
import connectDb from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { sender, message, roomId, time } = await req.json();

    // room find by orderId
    const room = await ChatRoom.findOne({ orderId: roomId });
    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" });
    }

    await Message.create({
      roomId: room._id,
      senderId: new mongoose.Types.ObjectId(sender), // ✔ FIX
      text: message,
      time,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error });
  }
}
