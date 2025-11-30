import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deliveryBoyId = session.user.id;

    // 🟢 Get all assignments broadcasted to this delivery boy
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    })
      .populate("order")
      .lean();

    return NextResponse.json({ assignments });
  } catch (err) {
    console.error("Assignment fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
