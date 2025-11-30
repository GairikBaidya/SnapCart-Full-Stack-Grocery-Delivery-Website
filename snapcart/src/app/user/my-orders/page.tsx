"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OrderCard from "@/components/OrderCard";
import { PackageSearch, ArrowLeftCircle } from "lucide-react";
import { getSocket } from "@/lib/socket";

function MyOrders() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.userData);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 1. Fetch All Orders Initially
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const { data } = await axios.get(`/api/user/order/${user._id}`);
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  // 🟢 2. Realtime Listeners — status + assigned delivery boy
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // --- Order Status Updated (Admin -> User)
    const statusHandler = (data: any) => {
      console.log("🔔 Order Updated Realtime:", data);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId
            ? {
                ...o,
                status: data.status,
                assignedDeliveryBoy: data.assignedDeliveryBoy || o.assignedDeliveryBoy,
              }
            : o
        )
      );
    };

    // --- Order Assigned (Admin -> User)
    const assignedHandler = (data: any) => {
      console.log("🟢 USER Real-time Boy Assigned:", data);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId
            ? { ...o, assignedDeliveryBoy: data.assignedDeliveryBoy }
            : o
        )
      );
    };

    socket.on("order-status-updated", statusHandler);
    socket.on("order-assigned", assignedHandler);

    return () => {
      socket.off("order-status-updated", statusHandler);
      socket.off("order-assigned", assignedHandler);
    };
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
        Loading your orders...
      </div>
    );
  }

 return (
  <section className="bg-gradient-to-b from-white to-gray-100 min-h-screen w-full">
    
    {/* Center Container */}
    <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">

      {/* ---- BEAUTIFUL STICKY TOP BAR ----- */}
      <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
          >
            <ArrowLeftCircle size={24} className="text-green-700" />
          </button>

          <h1 className="text-xl font-bold text-gray-800">
            My Orders
          </h1>
        </div>
      </div>

      {/* ---- WHEN LOADING ----- */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] text-gray-700 font-semibold">
          Loading Orders...
        </div>
      ) : orders.length === 0 ? (

        /* ---- EMPTY STATE ---- */
        <div className="pt-20 flex flex-col items-center text-center">
          <PackageSearch size={70} className="text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Orders Found
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Start shopping to view your orders here.
          </p>
        </div>

      ) : (

        /* ---- ORDER LIST ---- */
        <div className="mt-4 space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>

      )}
    </div>
  </section>
);

}

export default MyOrders;
