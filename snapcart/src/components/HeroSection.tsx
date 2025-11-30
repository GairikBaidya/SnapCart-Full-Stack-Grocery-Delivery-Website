"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBasket,
  Leaf,
  Truck,
  Smartphone,
} from "lucide-react";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";


const slides = [
  {
    id: 1,
    icon: <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
    title: "Fresh Organic Groceries 🥦",
    subtitle: "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
    btnText: "Shop Now",
    bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1770",
  },
  {
    id: 2,
    icon: <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />,
    title: "Fast & Reliable Delivery 🚚",
    subtitle: "We ensure your groceries reach your doorstep in no time.",
    btnText: "Order Now",
    bg: "https://images.unsplash.com/photo-1616915939238-2a7a363d45c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1769",
  },
  {
    id: 3,
    icon: <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />,
    title: "Shop Anytime, Anywhere 📱",
    subtitle: "Easy and seamless online grocery shopping experience.",
    btnText: "Get Started",
    bg: "https://plus.unsplash.com/premium_photo-1663091378026-7bee6e1c7247?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1771",
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);
 const { data: session, status } = useSession();

  
  
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
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].bg}
            alt="Grocery background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* Foreground Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div
          key={slides[current].title}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-6 max-w-3xl"
        >
          {/* Icon */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">
            {slides[current].icon}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl">
            {slides[current].subtitle}
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingBasket className="w-5 h-5" />
            {slides[current].btnText}
          </motion.button>
        </motion.div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
