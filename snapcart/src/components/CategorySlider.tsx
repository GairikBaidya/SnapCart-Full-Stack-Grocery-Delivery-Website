"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Flame,
  Coffee,
  Heart,
  Home,
  Box,
  Baby,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
  { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
  { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
  { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
  { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
  { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
  { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
  { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
  { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
  { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
];

export default function CategorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) slider.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => slider?.removeEventListener("scroll", checkScroll);
  }, []);

  // Auto-scroll when not hovered
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.section
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.5 }} // 👈 Trigger when 30% visible
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop by Category
      </h2>

      {/* Left Button */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>
      )}

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth"
      >
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1, // ✨ Stagger effect
              }}
              viewport={{ once: true }}
              className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex flex-col items-center justify-center p-5">
                <Icon className="w-10 h-10 text-green-700 mb-3" />
                <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                  {cat.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Button */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>
      )}
    </motion.section>
  );
}
