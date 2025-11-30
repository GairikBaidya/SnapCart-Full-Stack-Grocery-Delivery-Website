"use client";

import {
  ShoppingCart,
  LogOut,
  User,
  Package,
  Search,
  PlusCircle,
  ClipboardList,
  Menu,
  Truck,
  Boxes,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import mongoose from "mongoose";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createPortal } from "react-dom";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  role: "admin" | "user" | "deliveryBoy";
  image?: string;
  email: string;
  mobile?: string;
  myOrders?: mongoose.Types.ObjectId[];
}

function Nav({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cartData } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(search)}`;
      setMobileSearchOpen(false);
    }
  };

  const isUser = user.role === "user";
  const isAdmin = user.role === "admin";
  const isDelivery = user.role === "deliveryBoy";

  // Sidebar rendered in a Portal
  const SidebarPortal = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-[9999]
              bg-gradient-to-b from-green-800/90 via-green-700/80 to-green-900/90
              backdrop-blur-xl border-r border-green-400/20
              shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)]
              flex flex-col p-6 text-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-extrabold text-2xl tracking-wide text-white/90">
                Admin Panel
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-red-400 text-2xl font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg">
                {user.image ? (
                  <Image src={user.image} alt="user" fill className="object-cover" />
                ) : (
                  <User className="w-7 h-7 text-green-200 m-auto absolute inset-0" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {user.name || "Admin User"}
                </h3>
                <p className="text-xs text-green-200 capitalize tracking-wide">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-medium mt-6">
              <Link
                href="/admin/add-grocery"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle className="w-5 h-5 text-green-200" />
                Add Grocery
              </Link>

              <Link
                href="/admin/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes className="w-5 h-5 text-green-200" />
                View Products
              </Link>

              <Link
                href="/admin/manage-orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardList className="w-5 h-5 text-green-200" />
                Manage Orders
              </Link>
            </div>

            <div className="my-5 border-t border-white/20"></div>

            <button
              onClick={() => {
                setMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5 text-red-300" />
              Logout
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <nav className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-999">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
        >
          SnapCart
        </Link>

        {/* Search (User - Desktop) */}
        {isUser && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md"
          >
            <Search className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groceries..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-6 relative">
          {/* Mobile Search Toggle */}
          {isUser && (
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden"
            >
              {mobileSearchOpen ? (
                <X className="text-green-600 w-6 h-6" />
              ) : (
                <Search className="text-green-600 w-6 h-6" />
              )}
            </button>
          )}

          {/* Cart (User only) */}
          {isUser && (
            <Link
              href="/user/cart"
              className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <ShoppingCart className="text-green-600 w-6 h-6" />
              {cartData.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
                  {cartData.length}
                </span>
              )}
            </Link>
          )}

          {/* Admin Links */}
          {isAdmin && (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin/add-grocery"
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <PlusCircle className="w-5 h-5" /> Add Grocery
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <Boxes className="w-5 h-5" /> View Products
                </Link>
                <Link
                  href="/admin/manage-orders"
                  className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
                >
                  <ClipboardList className="w-5 h-5" /> Manage Orders
                </Link>
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
              >
                <Menu className="text-green-600 w-6 h-6" />
              </button>
            </>
          )}

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform"
            >
              {user.image ? (
                <Image src={user.image} alt="user" fill className="object-cover rounded-full" />
              ) : (
                <User className="text-green-600 w-6 h-6" />
              )}
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-[999]"
                >
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <Image src={user.image} alt="user" width={40} height={40} className="rounded-full" />
                      ) : (
                        <User className="text-green-600 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>

                  {isUser && (
                    <Link
                      href="/user/my-orders"
                      className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <Package className="w-5 h-5 text-green-600" />
                      My Orders
                    </Link>
                  )}

                  {isDelivery && (
                    <Link
                      href="/delivery/orders"
                      className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <Truck className="w-5 h-5 text-green-600" />
                      Assigned Orders
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Search Bar (Slide Down) */}
      <AnimatePresence>
        {mobileSearchOpen && isUser && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
          >
            <Search className="text-gray-500 w-5 h-5 mr-2" />
            <form onSubmit={handleSearch} className="flex-grow">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groceries..."
                className="w-full outline-none text-gray-700"
              />
            </form>
            <button onClick={() => setMobileSearchOpen(false)}>
              <X className="text-gray-500 w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {SidebarPortal}
    </>
  );
}

export default Nav;
