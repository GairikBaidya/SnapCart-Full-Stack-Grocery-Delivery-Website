import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const { id } =await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find assignment
    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    // ✅ Ensure it's still brodcasted
    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "Assignment is no longer available to reject" },
        { status: 400 }
      );
    }

    // ✅ Remove delivery boy’s ID from broadcasted list
    assignment.brodcastedTo = assignment.brodcastedTo.filter(
      (boyId: any) => boyId.toString() !== session.user.id
    );

    // ✅ Optional — if no one left, we can mark as “unassigned” again or leave as brodcasted
    if (assignment.brodcastedTo.length === 0) {
      // Optional: mark as expired or leave as broadcasted for admin review
      assignment.status = "brodcasted";
    }

    await assignment.save();

    return NextResponse.json(
      { message: "Assignment rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reject assignment error:", error);
    return NextResponse.json(
      { message: `Reject order error: ${error}` },
      { status: 500 }
    );
  }
}
