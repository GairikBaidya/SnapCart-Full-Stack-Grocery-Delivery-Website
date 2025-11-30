"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { motion } from "framer-motion";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  MapPin,
  LocateFixed,
  CreditCard,
  Truck,
  User,
  Phone,
  Building,
  Navigation,
  Search,
  Home,
  ArrowLeftCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface Address {
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.userData);

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>("cod");
  const {subtotal,deliveryFee,finalTotal,cartData}=useSelector((state:RootState)=>state.cart)

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || "",
    phone: user?.mobile || "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  // 📍 Accurate Current Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // 🗺️ Reverse Geocode (Get City, State, Pincode)
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        );
        const data = await res.json();
        if (data?.address) {
          setAddress((prev) => ({
            ...prev,
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "",
            state: data.address.state || "",
            pincode: data.address.postcode || "",
            fullAddress: data.display_name || prev.fullAddress,
          }));
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [position]);

  // 🔍 Search Location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results.length > 0) {
      setPosition([results[0].y, results[0].x]);
    }
  };

  // 📍 Draggable Marker Component (Type-Safe)
  const DraggableMarker: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position as LatLngExpression, 15, { animate: true });
      }
    }, [position, map]);

    if (!position) return null;

    return (
      <Marker
        position={position}
        draggable={true}
        icon={markerIcon}
        eventHandlers={{
          dragend: (event: L.LeafletEvent) => {
            const marker = event.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };

  // 🧭 Handle Current Location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const handlePlaceOrder=async ()=>{
     if (!position) {
    alert("📍 Please allow location access or select your delivery location on the map!");
    return;
  }

  if (!paymentMethod) {
    alert("💳 Please select a payment method!");
    return;
  }
    try {
      const {data}=await axios.post("/api/user/order",{
        userId: user?._id,
        items: cartData.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        paymentMethod,
        address: {
          fullName: address.fullName,
          phone: address.phone,
          fullAddress: address.fullAddress,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          latitude:position[0],
          longitude:position[1],
        },
      })
      router.push("/user/order-success")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      {/* 🔙 Back to Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/user/cart")}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
      >
        <ArrowLeftCircle size={28} />
        <span>Back to Cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 🏠 Address + Map */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-600" /> Delivery Address
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                value={address.fullName}
                readOnly
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                value={address.phone}
                readOnly
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            {/* Full Address */}
            <div className="relative">
              <Home className="absolute left-3 top-3 text-green-600" size={18} />
              <textarea
                placeholder="Full Address (Building, Street, Area, etc.)"
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 h-20 resize-none"
              />
            </div>

            {/* City / State / Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building className="absolute left-3 top-3 text-green-600" size={18} />
                <input
                  type="text"
                  placeholder="City"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address.city}
                  readOnly
                />
              </div>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 text-green-600" size={18} />
                <input
                  type="text"
                  placeholder="State"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address.state}
                  readOnly
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-green-600" size={18} />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  value={address.pincode}
                  readOnly
                />
              </div>
            </div>

            {/* 🔍 Search Bar */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* 🌍 Map */}
          <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            {position && (
              <MapContainer
                center={position as LatLngExpression}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
              </MapContainer>
            )}

            {/* 📍 Floating Location Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCurrentLocation}
              className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-[999]"
              title="Use Current Location"
            >
              <LocateFixed size={22} />
            </motion.button>
          </div>

          {/* 🧭 Coordinates */}
          {position && (
            <p className="mt-3 text-center text-sm text-gray-700">
              <span className="font-medium">Latitude:</span> {position[0].toFixed(7)}{" "}
              | <span className="font-medium">Longitude:</span> {position[1].toFixed(7)}
            </p>
          )}
        </motion.div>

        {/* 💳 Payment Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-600" /> Payment Method
          </h2>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "online"
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <CreditCard className="text-green-600" />
              <span className="font-medium text-gray-700">
                Pay Online (Stripe)
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "cod"
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <Truck className="text-green-600" />
              <span className="font-medium text-gray-700">
                Cash on Delivery
              </span>
            </button>
          </div>

          {/* 💰 Summary */}
          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-green-700 font-semibold">{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span className="text-green-700">₹ {finalTotal}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold"
            onClick={handlePlaceOrder}
          >
            Place Order
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
