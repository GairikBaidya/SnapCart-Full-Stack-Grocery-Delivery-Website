
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
import { useEffect, useState } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";




function EditRoleMobile() {
  const { update}=useSession()
   const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);
  const [selectedRole,setSelectedRole]=useState("")
  const [mobile,setMobile]=useState("")
const router=useRouter()
  const handleEditRoleMobile=async ()=>{
    try {
      const result=await axios.post("/api/user/edit-role-mobile",{
        role:selectedRole,
        mobile
      })
      await update({ role: selectedRole });
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
   const checkForAdmin=async ()=>{
    try {
      const result=await axios.get("/api/user/check-for-admin")
      console.log(result)
      if(result.data.adminExist){
       setRoles((prev) => prev.filter((r) => r.id !== "admin"));
      }
    } catch (error) {
      console.log(error)
    }
   }
   checkForAdmin()
  },[])

  return (
    <main className="flex flex-col min-h-screen p-6">


          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
          >
            Select Your Role
          </motion.h1>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <motion.button
                  key={role.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-green-600 bg-green-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-green-400"
                  }`}
                >
                  <Icon
                    className={`w-12 h-12 mb-3 ${
                      isSelected ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-lg font-semibold ${
                      isSelected ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {role.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-10"
          >
            <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
              Enter Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center mt-10"
          >
            <button
              disabled={!selectedRole || mobile.length !== 10}
             onClick={handleEditRoleMobile}
              className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 ${
                selectedRole && mobile.length === 10
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Go to home
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </main>
  )
}

export default EditRoleMobile
