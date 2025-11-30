"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, Truck, IndianRupee } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";


interface AdminDashboardClientProps {
  stats: { title: string; value: string | number }[];
  chartData: { day: string; orders: number }[];
  earnings: {
    today: number;
    sevenDays: number;
    total: number;
  };
}

export default function AdminDashboardClient({
  stats,
  chartData,
  earnings,
}: AdminDashboardClientProps) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("today");
  const { data: session, status } = useSession();
  const currentEarning =
    filter === "today"
      ? earnings.today
      : filter === "sevenDays"
      ? earnings.sevenDays
      : earnings.total;

  const title =
    filter === "today"
      ? "Today's Earnings"
      : filter === "sevenDays"
      ? "Last 7 Days Earnings"
      : "Total Earnings";

 useEffect(() => {
    if (status !== "authenticated") return;

    const socket = getSocket();

    console.log("Emitting identity for:", session?.user?.id);

    socket.emit("identity", {
      userId: session.user.id,
    });

    return () => {
      socket.off("order-status-updated");
    };
  }, [status]);
  
  return (
    <section className="pt-28 w-[90%] md:w-[80%] mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-green-700"
        >
          🏪 Admin Dashboard
        </motion.h1>

        {/* Earning Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition w-full sm:w-auto"
        >
          <option value="today">Today</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="total">Total</option>
        </select>
      </div>

      {/* Earnings Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-green-50 border border-green-200 shadow-sm rounded-2xl p-6 text-center mb-10"
      >
        <h2 className="text-lg font-semibold text-green-700 mb-2">{title}</h2>
        <p className="text-4xl font-extrabold text-green-800">
          ₹{currentEarning.toLocaleString("en-IN")}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, i) => {
          const icons = [
            <Package key="p" className="text-green-700 w-6 h-6" />,
            <Users key="u" className="text-green-700 w-6 h-6" />,
            <Truck key="t" className="text-green-700 w-6 h-6" />,
            <IndianRupee key="r" className="text-green-700 w-6 h-6" />,
          ];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all"
            >
              <div className="bg-green-100 p-3 rounded-xl">{icons[i]}</div>
              <div>
                <p className="text-gray-600 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Orders Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          📈 Orders Overview (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="orders" fill="#16A34A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
