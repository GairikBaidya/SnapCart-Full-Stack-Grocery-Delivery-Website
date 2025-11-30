"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  ArrowLeft,
  Truck,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import { getSocket } from "@/lib/socket";

interface Order {
  _id: string;
  user?: { name: string; email: string };
  totalAmount: number;
  paymentMethod: "cod" | "online";
  status: "pending" | "out of delivery" | "delivered" | "cancelled";
  createdAt: string;
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    name: string;
    price: string;
    unit: string;
    quantity: number;
    image?: string;
  }[];
  assignedDeliveryBoy?: {
    name: string;
    mobile: string;
  };
}

interface DeliveryBoy {
  id: string;
  name: string;
  mobile: string;
  latitude: number;
  longitude: number;
}

const statusOptions = ["pending", "out of delivery", "delivered", "cancelled"];

export default function ManageOrdersClient({ orders }: { orders: Order[] }) {
  const [orderList, setOrderList] = useState<Order[]>(orders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [orderStatusMap, setOrderStatusMap] = useState<Record<string, string>>(
    () => Object.fromEntries(orders.map((o) => [o._id, o.status]))
  );
  const [availableBoysMap, setAvailableBoysMap] = useState<
    Record<string, DeliveryBoy[]>
  >({});
  const [noBoysMessage, setNoBoysMessage] = useState<Record<string, string>>({});

  // 🔥 REALTIME ORDER LISTENERS
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // NEW ORDER event
    socket.on("new-order", (newOrder: Order) => {
      setOrderList((prev) => [newOrder, ...prev]);
      setOrderStatusMap((prev) => ({
        ...prev,
        [newOrder._id]: newOrder.status,
      }));
    });

    // DELIVERY BOY ACCEPTED EVENT
    socket.on("order-assigned", (data: any) => {
      setOrderList((prev) =>
        prev.map((o) =>
          o._id === data.orderId
            ? { ...o, assignedDeliveryBoy: data.assignedDeliveryBoy }
            : o
        )
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-assigned");
    };
  }, []);

  // 📌 Handle admin status update
  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await axios.post(`/api/admin/order/${id}/update-order-status`, {
        status: newStatus,
      });

      const availableBoys =
        res.data.availableBoys || res.data?.data?.availableBoys || [];

      setOrderStatusMap((prev) => ({ ...prev, [id]: newStatus }));
      setAvailableBoysMap((prev) => ({ ...prev, [id]: availableBoys }));

      if (availableBoys.length === 0 && newStatus === "out of delivery") {
        setNoBoysMessage((prev) => ({
          ...prev,
          [id]: "🚫 No delivery boys available nearby right now.",
        }));
      } else {
        setNoBoysMessage((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
  <section className="min-h-screen bg-gray-50 w-full">
    
    {/* -------- Sticky Top Admin Header -------- */}
    <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg border-b shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition"
        >
          <ArrowLeft size={20} className="text-green-700" />
        </button>

        <h1 className="text-xl font-bold text-gray-800">
          Manage Orders
        </h1>
      </div>
    </div>

    {/* ---------- Main Content ---------- */}
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8">

      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-green-700">Orders Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Track, update, and manage all orders in real-time.
        </p>
      </div>

      {/* ---------- ORDERS LIST ---------- */}
      <div className="space-y-6">
        {orderList.map((order) => {
          const availableBoys = availableBoysMap[order._id] || [];
          const currentStatus = orderStatusMap[order._id];
          const noBoys = noBoysMessage[order._id];

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
            >
              
              {/* ---- Order Header ---- */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-lg font-bold flex items-center gap-2 text-green-700">
                    <Package size={20} /> Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* Customer */}
                  <div className="mt-3 space-y-1 text-gray-700 text-sm">
                    <p className="flex items-center gap-2 font-semibold">
                      <User size={16} className="text-green-700" />
                      {order.address.fullName}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-green-700" /> +91{" "}
                      {order.address.phone}
                    </p>

                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="text-green-700 mt-1" />
                      <span>
                        {order.address.fullAddress}, {order.address.city},{" "}
                        {order.address.state} - {order.address.pincode}
                      </span>
                    </p>
                  </div>

                  {/* Payment */}
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    <CreditCard size={15} className="text-green-600" />
                    Payment:{" "}
                    <span className="font-semibold capitalize ml-1">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </span>
                  </p>
                </div>

                {/* --- Status Dropdown --- */}
                <div className="flex flex-col items-start md:items-end gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      currentStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : currentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : currentStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {currentStatus}
                  </span>

                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={loadingId === order._id}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ---- Assigned Delivery Boy ---- */}
              {order.assignedDeliveryBoy && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <UserCheck className="text-blue-600" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Assigned To:{" "}
                        <span className="text-blue-800">
                          {order.assignedDeliveryBoy.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600">
                        📞 +91 {order.assignedDeliveryBoy.mobile}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.assignedDeliveryBoy.mobile}`}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Call
                  </a>
                </div>
              )}

              {/* ---- Delivery Boys List ---- */}
              {currentStatus === "out of delivery" &&
                !order.assignedDeliveryBoy && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-green-700 font-bold mb-3">
                      <Truck size={18} /> Available Delivery Boys Nearby
                    </h3>

                    {noBoys ? (
                      <div className="text-center py-3 text-sm text-gray-600">
                        {noBoys}
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "out of delivery")
                          }
                          className="mt-2 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg flex gap-1 items-center mx-auto hover:bg-green-700 transition"
                        >
                          <RotateCcw size={14} /> Retry
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {availableBoys.map((boy) => (
                          <li
                            key={boy.id}
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                          >
                            <div>
                              <p className="font-semibold text-gray-800">
                                {boy.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                📍 {boy.latitude.toFixed(4)},{" "}
                                {boy.longitude.toFixed(4)}
                              </p>
                            </div>

                            <a
                              href={`tel:${boy.mobile}`}
                              className="text-green-700 text-sm font-semibold hover:underline"
                            >
                              Call
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

              {/* ---- Toggle Items ---- */}
              <button
                onClick={() =>
                  setExpanded(expanded === order._id ? null : order._id)
                }
                className="mt-5 text-green-700 font-semibold flex items-center gap-1 hover:underline"
              >
                View Items
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expanded === order._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ---- Items List ---- */}
              {expanded === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 border-t border-gray-200 pt-3"
                >
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-white border rounded-lg overflow-hidden relative">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center text-xs text-gray-500 w-full h-full bg-gray-200">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>

                      <p className="text-green-700 font-semibold">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}

                  <p className="text-right text-lg font-bold text-green-700 mt-3">
                    Total: ₹{order.totalAmount}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

}
