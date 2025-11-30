import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import User from "@/models/user.model";

interface AssignmentWithUser {
  assignedTo?: string;
}

interface UserWithLocation {
  location?: {
    coordinates: [number, number];  // [lng, lat]
  };
}

export async function GET(req: Request, { params }: any) {
  await connectDb();

  const { orderId } =await params;

  const assignment = await DeliveryAssignment.findOne({
    order: orderId,
    status: "assigned",
  }).lean<AssignmentWithUser>();

  if (!assignment || !assignment.assignedTo) {
    return NextResponse.json({ location: null });
  }

  const boy = await User.findById(assignment.assignedTo).lean<UserWithLocation>();

  if (!boy?.location?.coordinates) {
    return NextResponse.json({ location: null });
  }

  return NextResponse.json({
    location: {
      latitude: boy.location.coordinates[1],
      longitude: boy.location.coordinates[0],
    },
  });
}
