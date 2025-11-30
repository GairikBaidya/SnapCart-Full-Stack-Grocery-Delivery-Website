import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

export async function POST(req: Request) {
  await connectDb();

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ active: false });
  }

  const activeAssignment = await DeliveryAssignment.findOne({
    assignedTo: userId,
    status: "assigned",
  })
    .populate({
      path: "order",
      populate: {
        path: "address",
      },
    })
    .lean();

  if (!activeAssignment) {
    return NextResponse.json({ active: false });
  }

  return NextResponse.json({
    active: true,
    assignment: activeAssignment,
  });
}
