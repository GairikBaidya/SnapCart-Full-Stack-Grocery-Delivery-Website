"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-gradient-to-b from-green-50 to-white">
      
      {/* Success Icon Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className="relative"
      >
        <CheckCircle className="text-green-600 w-24 h-24 md:w-28 md:h-28" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.3, 0, 0.3], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-green-200 blur-2xl" />
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-green-700 mt-6"
      >
        Order Placed Successfully!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-gray-600 mt-3 text-sm md:text-base max-w-md"
      >
        Thank you for shopping with us! Your order has been placed and is being
        processed. You can track its progress in your <span className="font-semibold text-green-700">My Orders</span> section.
      </motion.p>

      {/* Animated delivery box */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-10"
      >
        <Package className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
      </motion.div>

      {/* Go to My Orders Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-12"
      >
        <Link href="/user/my-orders">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Go to My Orders
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      </motion.div>

      {/* Decorative Confetti Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 left-[30%] w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        <div className="absolute top-24 left-[50%] w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        <div className="absolute top-16 left-[70%] w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </motion.div>
    </div>
  );
}
