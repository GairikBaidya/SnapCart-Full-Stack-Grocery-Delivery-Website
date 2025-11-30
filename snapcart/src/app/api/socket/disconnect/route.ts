import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDb();

  const { socketId } = await req.json();

  await User.findOneAndUpdate(
    { socketId },
    { socketId: null, isOnline: false }
 ,{new:true} );

  return NextResponse.json({ success: true });
}
