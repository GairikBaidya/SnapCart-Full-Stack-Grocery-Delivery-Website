import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDb();

  const { userId, socketId } = await req.json();

  await User.findByIdAndUpdate(userId, {
    socketId,
    isOnline: true,
  },{new:true});

  return NextResponse.json({ success: true });
}
