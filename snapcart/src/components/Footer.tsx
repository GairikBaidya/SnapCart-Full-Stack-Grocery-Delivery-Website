"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-green-500/40">
        {/* 🛒 Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Snapcart</h2>
          <p className="text-sm text-green-100 leading-relaxed">
            Your one-stop online grocery store delivering freshness to your doorstep.  
            Shop smart, eat fresh, and save more every day!
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Mumbai, India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 0000000000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@snapcart.in
            </li>
          </ul>
          {/* 🌐 Social Links */}
          <div className="flex gap-4 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-5 h-5 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* ⚖️ Bottom Bar */}
      <div className="text-center py-4 text-sm text-green-100 bg-green-800/40">
        © {new Date().getFullYear()} <span className="font-semibold">Snapcart</span>. All rights reserved.
      </div>
    </motion.footer>
  );
}
