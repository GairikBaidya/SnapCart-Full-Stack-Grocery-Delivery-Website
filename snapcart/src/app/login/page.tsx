"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import googleImage from "@/assets/google.svg";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Google from "next-auth/providers/google";
import { useRouter } from "next/navigation";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
const router=useRouter()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
       await signIn("credentials",{
        email:form.email,
        password:form.password,
        redirectTo:"/"
       })
   
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      {/* Back Button (Optional) */}
     

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>
      <p className="text-gray-600 mb-8">Login to continue shopping 🍃</p>

      {/* Login Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleLogin}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {showPassword ? (
            <EyeOff
              onClick={() => setShowPassword(false)}
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(true)}
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
            />
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
            isFormValid && !loading
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" /> Login
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          or
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
          onClick={()=>signIn("google",{callbackUrl:"/"})}
        >
          <Image src={googleImage} alt="Google logo" className="w-5 h-5" />
          Continue with Google
        </button>
      </motion.form>

      {/* Register Link */}
      <p className="text-gray-600 mt-6 text-sm flex items-center gap-1">
        Don’t have an account?
        <Link
          href="/register"
          className="text-green-700 font-semibold hover:underline flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" /> Register
        </Link>
      </p>
    </main>
  );
}

export default Login;

