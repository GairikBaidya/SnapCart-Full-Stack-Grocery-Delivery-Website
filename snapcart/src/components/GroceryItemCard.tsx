"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/redux/cartSlice";
import mongoose from "mongoose";

interface GroceryItemCardProps {
  _id: mongoose.Types.ObjectId
  name: string;
  price: number;
  image: string;
  category?: string;
  unit?: string;
}

export default function GroceryItemCard({
  _id,
  name,
  price,
  image,
  category,
  unit,
}: GroceryItemCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  // 🧠 Get cart data from Redux
  const cart = useSelector((state: RootState) => state.cart.cartData);
  const cartItem = cart.find((item) => item._id === _id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* 🖼 Product Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {/* 📄 Details */}
      <div className="p-4 flex flex-col flex-1">
        {category && (
          <p className="text-xs text-gray-500 font-medium mb-1">{category}</p>
        )}

        <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1 line-clamp-1">
          {name}
        </h3>

        {/* Price & Unit */}
        <div className="flex items-center justify-between mt-2">
          {unit && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {unit}
            </span>
          )}
          <span className="text-green-700 font-bold text-lg">₹{price}</span>
        </div>

        {/* 🛒 Add / Quantity Controls */}
        {!cartItem ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              dispatch(addToCart({ _id, name, price, image, category, unit }))
            }
            className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 text-sm font-medium transition-all"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center justify-center bg-green-50 border border-green-200 rounded-full py-2 px-4 gap-4"
          >
            <button
              onClick={() => dispatch(decreaseQuantity(_id))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all"
            >
              <Minus size={16} className="text-green-700" />
            </button>

            <span className="text-sm font-semibold text-gray-800">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => dispatch(increaseQuantity(_id))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all"
            >
              <Plus size={16} className="text-green-700" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
