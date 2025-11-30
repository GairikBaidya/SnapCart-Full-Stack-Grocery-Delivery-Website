import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const { id } =await params;
    const session = await auth();
    const deliveryBoyId = session?.user.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json({ message: "assignment not found" }, { status: 400 });
    }

    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "assignment is expired" },
        { status: 400 }
      );
    }

    // ❗ Already assigned check
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "You are already assigned to another order" },
        { status: 400 }
      );
    }

    // ------------------------------
    // ⭐ ASSIGN THIS ORDER
    // ------------------------------
    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    // Assign delivery boy to order
    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    // ----------------------------------------------------------
    // ⭐ REMOVE THIS DELIVERY BOY FROM ALL OTHER ASSIGNMENTS
    // ----------------------------------------------------------
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id }, // except accepted assignment
        brodcastedTo: deliveryBoyId,  // where delivery boy exists in array
        status: "brodcasted"
      },
      {
        $pull: { brodcastedTo: deliveryBoyId }
      }
    );
    await emitSocketEvent("order-assigned", {
  orderId: order._id,
  assignedDeliveryBoy: {
    id: session?.user.id,
    name: session?.user.name,
    mobile: session?.user.mobile
  }
});
await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/create`, {
  orderId:order._id,
  userId:order.user._id,
  deliveryBoyId,
});

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: `accept order error ${error}` },
      { status: 500 }
    );
  }
}
