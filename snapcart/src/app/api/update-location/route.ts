import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDb();

  const { userId, location } = await req.json();

  if (!userId || !location) {
    return NextResponse.json(
      { error: "Missing userId or location" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { location },
    { new: true }
  );

  return NextResponse.json({
    success: true,
    location: user.location,
  });
}
