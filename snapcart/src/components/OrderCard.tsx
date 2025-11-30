"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Truck,
  ChevronDown,
  ChevronUp,
  Package,
  UserCheck,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface OrderCardProps {
  order: any;
}

export default function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleString();
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-gradient-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order&nbsp;
            <span className="text-green-700 font-bold">
              #{order._id.slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Placed on {date}</p>
        </div>

        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </motion.span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Payment */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <CreditCard size={16} className="text-green-600" />
          <span>
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Online Payment"}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-green-600" />
          <span className="truncate">
            {order.address?.fullAddress || "Address not available"}
          </span>
        </div>

        {/* Assigned Delivery Boy */}
        {order.assignedDeliveryBoy && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex justify-between items-center mt-2">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck className="text-blue-600" size={18} />
              <div>
                <p className="font-semibold text-gray-800">
                  Assigned To:{" "}
                  <span className="text-blue-700">
                    {order.assignedDeliveryBoy.name}
                  </span>
                </p>
                <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                  <Phone size={12} className="text-blue-600" /> +91{" "}
                  {order.assignedDeliveryBoy.mobile}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.assignedDeliveryBoy.mobile}`}
              className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Call
            </a>
          </div>
        )}

        {/* ⭐ Track Order Button (ONLY if Out of Delivery) */}
        {order.status === "out of delivery" && (
          <button
            onClick={() => router.push(`/user/track-order/${order._id}`)}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            <Truck size={18} />
            Track Order
          </button>
        )}

        {/* Items Section */}
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition"
          >
            <span className="flex items-center gap-2">
              <Package size={16} className="text-green-600" />
              {expanded
                ? "Hide ordered items"
                : `View ${order.items?.length || 0} items`}
            </span>
            {expanded ? (
              <ChevronUp size={16} className="text-green-600" />
            ) : (
              <ChevronDown size={16} className="text-green-600" />
            )}
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {item.unit}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    ₹{Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Total */}
        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-green-600" />
            <span>Delivery: {order.status}</span>
          </div>
          <div>
            Total:{" "}
            <span className="text-green-700 font-bold">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
