"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

interface ChatMessage {
  _id?: string;
  clientId?: string;
  sender: string;
  message: string;
  time: string;
  roomId: string;
  pending?: boolean;
}

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : (params.orderId as string);

  const { userData } = useSelector((state: RootState) => state.user);
  const userId = String(userData?._id || "");

  const [order, setOrder] = useState<any>(null);
  const [userAddressLocation, setUserAddressLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([
    "Where is my order?",
    "How long will it take?",
    "Call me when you arrive",
    "Please deliver fast 🙏",
  ]);

  const regenerateSuggestions = useCallback(() => {
    const all = [
      "Are you close?",
      "Drive safe 🙏",
      "Call me instead of ringing bell",
      "Is traffic heavy?",
      "How far are you?",
      "Let me know when outside",
      "I'm waiting outside",
      "Thank you 😊",
    ];
    setSuggestions(all.sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

  /* Auto Scroll */
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* FETCH ORDER DETAILS */
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/order/${orderId}`);
      const data = await res.json();

      setOrder(data.order);
      setUserAddressLocation({
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      });
    }
    load();
  }, [orderId]);

  /* FETCH LOCATIONS */
  useEffect(() => {
    async function loadLoc() {
      const res = await fetch(`/api/order/${orderId}/deliveryBoy-location`);
      const data = await res.json();

      if (data.location) {
        setDeliveryLocation({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        });
      }
    }
    loadLoc();
  }, [orderId]);

  /* FETCH CHAT HISTORY */
  useEffect(() => {
    async function loadHistory() {
      const res = await fetch(`/api/chat/messages/${orderId}`);
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
    }
    loadHistory();
  }, [orderId]);

  /* SOCKET SETUP */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join-room", orderId);

    socket.on("update-delivery-location", (data: any) => {
      setDeliveryLocation({
        latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,
      });
    });

    socket.on("chat-message", (msg: any) => {
      if (msg.roomId !== orderId) return;

      const incomingTime =
        typeof msg.time === "string"
          ? msg.time
          : new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (msg.clientId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.clientId === msg.clientId ? { ...m, _id: msg._id, pending: false } : m
          )
        );
        return;
      }

      setMessages((prev) => [...prev, { ...msg, time: incomingTime }]);
    });

    return () => {
      socket.off("chat-message");
      socket.emit("leave-room", orderId);
    };
  }, [orderId]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();
    if (!socket) return;

    const clientId = Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    const newMsg: ChatMessage = {
      clientId,
      sender: userId,
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      roomId: orderId,
      pending: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    socket.emit("chat-message", newMsg);
    setNewMessage("");
  };

  /* LOADING */
  if (!order || !userAddressLocation) {
    return <div className="flex items-center justify-center min-h-screen text-green-700 text-lg">Loading...</div>;
  }

  const isDelivered = order.status === "delivered";

  /* ========== 🎯 DELIVERY COMPLETED MODE ========== */
  if (isDelivered) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 flex justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-6 text-center">

          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Order Delivered Successfully! 🎉
          </h1>

          <p className="text-gray-600 mb-4">
            Order #{String(order._id).slice(-6)}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left text-gray-700">
            <p><b>Customer:</b> {order.address.fullName}</p>
            <p><b>Phone:</b> +91 {order.address.phone}</p>
            <p><b>Address:</b> {order.address.fullAddress}</p>
            <p><b>City:</b> {order.address.city}</p>
            <p><b>Pincode:</b> {order.address.pincode}</p>
            <hr className="my-3" />
            <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
            <p><b>Payment Method:</b> {order.paymentMethod}</p>
            <p><b>Delivered At:</b> {new Date(order.deliveredAt).toLocaleString()}</p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow active:scale-95 transition"
          >
            Go to Home
          </button>
        </div>
      </section>
    );
  }

  /* ========== 🛠 ORIGINAL TRACKING UI ========== */
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">

        {/* HEADER */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999">
          <button onClick={() => router.back()} className="p-2 bg-green-100 rounded-full">
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Track Order</h1>
            <p className="text-sm text-gray-600">
              #{String(order._id).slice(-6)} •{" "}
              <span className="text-green-700 font-semibold">{order.status}</span>
            </p>
          </div>
        </header>

        {/* MAP */}
        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap userAddressLocation={userAddressLocation} deliveryLocation={deliveryLocation} />
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="p-4 mt-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold">Chat with Delivery Partner</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1"
              onClick={regenerateSuggestions}
            >
              <Sparkles size={14} /> AI Help
            </motion.button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.92 }}
                onClick={() => setNewMessage(s)}
                className="px-3 py-1 text-xs bg-white border border-green-200 text-green-700 rounded-full"
              >
                {s}
              </motion.button>
            ))}
          </div>

          {/* CHAT BOX */}
          <div className="bg-white rounded-3xl border shadow flex flex-col h-[450px]">

            {/* Messages */}
            <div
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto chat-scroll space-y-4 p-2"
              style={{ maxHeight: "380px" }}
            >
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div
                    key={m._id || m.clientId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.sender === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[70%] shadow ${
                        m.sender === userId
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p>{m.message}</p>
                      <p className="text-[10px] opacity-70 text-right mt-1">{m.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Box */}
            <div className="flex gap-2 p-3 border-t bg-white">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={sendMessage}
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
