"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
import DeliveryChat from "./DeliveryChat";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  YAxis,
} from "recharts";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function DeliveryBoyDashboard() {
  const user = useSelector((state: any) => state.user.userData);

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [userAddressLocation, setUserAddressLocation] = useState<any>(null);

  const [earnings, setEarnings] = useState<any>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // 🚀 LIVE GPS
  useEffect(() => { 
    if (!user?._id) return; 
    const watchId = navigator.geolocation.watchPosition((pos) => 
      { const lat = pos.coords.latitude; 
      const lon = pos.coords.longitude; 
      setDeliveryLocation({ latitude: lat, longitude: lon }); 
      const socket = getSocket(); 
      socket.emit("updateLocation", { userId: user._id, latitude: lat, longitude: lon, }); 
    }, 
    (err) => console.log("GPS Error:", err), { enableHighAccuracy: true }); return () => navigator.geolocation.clearWatch(watchId); }, [user?._id]);

  // 🚀 FETCH API DATA
  const fetchCurrentOrder = async () => {
    if (!user?._id) return;
    const res = await axios.post("/api/delivery-boy/current-order", { userId: user._id });

    if (res.data.active) {
      setActiveOrder(res.data.assignment);
      setUserAddressLocation({
        latitude: res.data.assignment.order.address.latitude,
        longitude: res.data.assignment.order.address.longitude,
      });
    } else {
      setActiveOrder(null);
    }
  };

  const fetchAssignments = async () => {
    const res = await axios.get("/api/delivery-boy/assignment");
    setAssignments(res.data.assignments || []);
  };

  const fetchEarnings = async () => {
    if (!user?._id) return;
    setEarningsLoading(true);
    try {
      const res = await axios.get(`/api/delivery-boy/earnings/${user._id}`);
      if (res.data.success) setEarnings(res.data.data);
    } catch { }
    setEarningsLoading(false);
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchCurrentOrder();
    fetchAssignments();
    fetchEarnings();
  }, [user?._id]);

  // 🚀 SOCKET EVENTS
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit("identity", { userId: user._id });
    socket.on("delivery-assignment", fetchAssignments);
    socket.on("earnings-refresh", fetchEarnings);

    return () => {
      socket.off("delivery-assignment");
      socket.off("earnings-refresh");
    };
  }, [user?._id]);

  // 🚀 ACTION: ACCEPT & REJECT
  const handleAccept = async (id: string) => {
    setLoadingId(id);
    await axios.get(`/api/delivery-boy/${id}/accept-order`);
    fetchCurrentOrder();
    fetchAssignments();
    setLoadingId(null);
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    await axios.get(`/api/delivery-boy/${id}/reject-order`);
    fetchAssignments();
    setLoadingId(null);
  };

  // 🚀 OTP VERIFY
  const verifyOtp = async () => {
    if (!otp.trim()) return setOtpError("Enter OTP");

    try {
      const res = await axios.post(`/api/order/${activeOrder.order._id}/verify-otp`, { otp });

      if (res.data.success) {
        setShowOtpBox(false);
        setOtp("");
        setActiveOrder(null);
        fetchAssignments();
        fetchCurrentOrder();
        fetchEarnings();
      } else {
        setOtpError("Incorrect OTP");
      }
    } catch {
      setOtpError("OTP Verification Error");
    }
  };

  // ===================== 🟢 CASE 1 → ACTIVE ORDER =====================
  if (activeOrder && userAddressLocation) {
    return (
      <section className="p-4 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">Active Delivery</h1>
          <p className="text-gray-600 text-sm mb-4">Order #{activeOrder.order._id.slice(-6)}</p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap userAddressLocation={userAddressLocation} deliveryLocation={deliveryLocation} />
          </div>

          {!activeOrder.order.deliveryOtpVerified && (
            <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={user._id} />
          )}

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {!activeOrder.order.deliveryOtpVerified && !showOtpBox && (
              <button
                onClick={async () => {
                  setShowOtpBox(true);
                  await axios.post(`/api/order/${activeOrder.order._id}/send-otp`);
                }}
                className="w-full py-4 bg-green-600 text-white rounded-lg"
              >
                Mark As Delivered
              </button>
            )}

            {showOtpBox && (
              <div className="mt-4">
                <input
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 border rounded-lg text-center"
                  placeholder="Enter OTP"
                />
                <button onClick={verifyOtp} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg">
                  Verify OTP
                </button>
                {otpError && <p className="text-red-600 mt-2">{otpError}</p>}
              </div>
            )}

            {activeOrder.order.deliveryOtpVerified && (
              <p className="text-green-700 text-center font-bold">✓ Delivery Completed!</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ===================== 🟡 CASE 2 → NO DELIVERY (SHOW BAR CHART ALWAYS) =====================
  if (!activeOrder && assignments.length === 0) {
    const todayData = [
      {
        name: "Today",
        earnings: earnings?.today?.earnings || 0,
        deliveries: earnings?.today?.deliveredCount || 0,
      },
    ];

    return (
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50 p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Active Deliveries 🚚</h2>
          <p className="text-gray-500 mb-5">Stay online to receive new orders</p>

          <div className="bg-white border rounded-xl shadow-xl p-6">
            <h3 className="font-medium text-green-700 mb-2">Today’s Performance</h3>

            {/* Always Visible Bar Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={todayData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" name="Earnings (₹)" />
                <Bar dataKey="deliveries" name="Deliveries" />
              </BarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-lg font-bold text-green-700">
              ₹{earnings?.today?.earnings || 0} Earned Today
            </p>

            <button
              onClick={fetchEarnings}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Refresh Earnings
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===================== 🔵 CASE 3 → ASSIGNMENTS LIST =====================
  return (
    <section className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Delivery Assignments</h2>
        {assignments.map((assign) => (
          <div key={assign._id} className="p-5 bg-white rounded-xl shadow mb-4 border">
            <p><b>Order:</b> #{assign.order._id.slice(-6)}</p>
            <p className="text-gray-600">{assign.order.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleAccept(assign._id)}
                disabled={loadingId === assign._id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(assign._id)}
                disabled={loadingId === assign._id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
