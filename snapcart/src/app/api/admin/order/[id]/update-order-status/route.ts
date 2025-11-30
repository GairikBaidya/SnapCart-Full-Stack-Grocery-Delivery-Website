import { emitSocketEvent } from "@/lib/emitSocketEvent";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }:{params:{id:string}}) {
  try {
    const { id } =await params;
    const { status } = await req.json();

    // Load order + user socket ID
    const order = await Order.findById(id).populate("user", "socketId");

    if (!order) {
      return NextResponse.json(
        { message: "order not found" },
        { status: 400 }
      );
    }

    order.status = status;

    let deliveryBoysPayload:any = [];

    // ⭐ Out for delivery logic (unchanged)
    if (status === "out of delivery" && !order.assignment) {
      const { longitude, latitude } = order.address;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();

        // ⭐ Real-time notify user
       if (order.user.socketId) {
        console.log(order.user.socketId)
  await emitSocketEvent(
    "order-status-updated",
    {
      orderId: order._id,
      status
    },
    order.user.socketId            // ⭐ TARGET THE USER
  );
}


        return NextResponse.json({
          message: "order updated but no delivery boys available",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });
  

// 🔥 Broadcast this assignment to all delivery boys
for (const boyId of candidates) {
  const boy = await User.findById(boyId);

  if (boy?.socketId) {
    await emitSocketEvent(
      "delivery-assignment",
      {
        assignmentId: deliveryAssignment._id,
        order: deliveryAssignment.order,
      },
      boy.socketId
    );
  }
}

      order.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      order.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        name: b.name,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));

      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("assignedDeliveryBoy", "name email mobile");
    await order.populate("user")
    // ⭐⭐⭐ REAL-TIME UPDATE USER
    console.log("socketid",order.user.socketId)
     if (order.user.socketId) {
  await emitSocketEvent(
    "order-status-updated",
    {
      orderId: order._id,
      status,
      assignedDeliveryBoy: order.assignedDeliveryBoy || null,
    },
    order.user.socketId            // ⭐ TARGET THE USER
  );
}

    return NextResponse.json(
      {
        assignedDeliveryBoy: order.assignedDeliveryBoy,
        availableBoys: deliveryBoysPayload,
        assignment: order.assignment?._id,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `order status error ${error}` },
      { status: 500 }
    );
  }
}
