import { NextResponse } from "next/server";
import Message from "@/models/message.model";
import ChatRoom from "@/models/chatRoom.model";
import connectDb from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();

    const { id } =await params; // FIXED (no await)

    // Find ChatRoom using orderId
    const room = await ChatRoom.findOne({ orderId: id });

    if (!room) {
      return NextResponse.json({ messages: [] });
    }

    // Fetch all messages
    const messages = await Message.find({ roomId: room._id })
      .sort({ createdAt: 1 })
      .lean();

    const formatted = messages.map((m: any) => {
      const msgTime = m.time || m.createdAt; // FIXED

      return {
        _id: m._id,
        sender: String(m.senderId),
        message: m.text || "", // FIXED
        time: msgTime
          ? new Date(msgTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        roomId: id,
      };
    });

    return NextResponse.json({ messages: formatted });
  } catch (err) {
    console.log("CHAT FETCH ERROR:", err);
    return NextResponse.json({ messages: [] });
  }
}
