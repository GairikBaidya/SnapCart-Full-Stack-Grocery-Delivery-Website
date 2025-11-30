
"use client";

import { motion } from "framer-motion";
import {
  ShoppingBasket,
  ArrowRight,
  Bike,
  UserCog,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  ArrowLeft,
  LogIn,
  Loader2, // ✅ Spinner icon
} from "lucide-react";
import Image from "next/image";
import googleImage from "@/assets/google.svg";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { auth } from "@/auth";

type propType={
    step:(num:number)=>void
}
function Welcome({step}:propType) {
  return (
     <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <ShoppingBasket className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
              SnapCart
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
          >
            Your one-stop destination for fresh groceries, organic produce, and
            daily essentials delivered right to your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-10 mt-10"
          >
            <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md" />
            <Bike className="w-24 h-24 md:w-32 md:h-32 text-orange-500 drop-shadow-md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={() => step(2)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </main>
  )
}

export default Welcome
