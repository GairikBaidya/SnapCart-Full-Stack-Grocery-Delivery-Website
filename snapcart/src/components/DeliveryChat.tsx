"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { getSocket } from "@/lib/socket";

interface ChatMessage {
  _id?: string;
  sender: string;
  message: string;
  time: string;
  roomId: string;
}

interface Props {
  orderId: string;
  deliveryBoyId: string;
}

export default function DeliveryBoyChat({ orderId, deliveryBoyId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const defaultSuggestions = [
    "I'm reaching soon 🚀",
    "Your order is almost there ⏱️",
    "Please stay available 😊",
    "Call me if needed 📞",
  ];
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);

  /* ---------------- Load Old Messages ---------------- */
  useEffect(() => {
    async function loadOldMsgs() {
      try {
        const res = await fetch(`/api/chat/messages/${orderId}`);
        const data = await res.json();

        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((m: any) => ({
              _id: m._id,
              sender: String(m.sender),
              message: m.message,
              time: m.time,
              roomId: orderId,
            }))
          );
        }
      } catch (e) {
        console.log("Fetch old msg error:", e);
      }
    }
    loadOldMsgs();
  }, [orderId]);

  /* ---------------- Join Room + Listen ---------------- */
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);

    const onChat = (msg: ChatMessage) => {
      if (msg.roomId === orderId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("chat-message", onChat);

    return () => {
      socket.off("chat-message", onChat);
      socket.emit("leave-room", orderId);
    };
  }, [orderId]);

  /* ---------------- Scroll to Bottom ---------------- */
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMsg = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();

    const msg: ChatMessage = {
      sender: deliveryBoyId,
      message: newMessage,
      roomId: orderId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("chat-message", msg);
    setNewMessage("");
  };

  /* ---------------- AI Suggestions ---------------- */
  const generateAISuggestions = () => {
    const ai = [
      "I'm on your way 🚗",
      "Traffic is heavy but coming 🙏",
      "Call me if you can’t find address 📞",
      "Please stay near your phone",
      "Reached your area",
      "I will call in 1 minute",
    ];

    setSuggestions(ai.sort(() => 0.5 - Math.random()).slice(0, 4));
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">Quick Replies</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={generateAISuggestions}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200"
        >
          <Sparkles size={14} /> AI Suggest
        </motion.button>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            onClick={() => setNewMessage(s)}
            className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full"
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto chat-scroll p-2 space-y-3"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                msg.sender === deliveryBoyId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                  ${
                    msg.sender === deliveryBoyId
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
              >
                <p>{msg.message}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMsg}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
