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
import Welcome from "@/components/Welcome";
import EditRoleMobile from "@/components/EditRoleMobile";
import { useRouter } from "next/navigation";

function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
  const [loading, setLoading] = useState(false); // ✅ Loading state
const router=useRouter()
  
const handleGoogleLogin = () => {
  // role + mobile ko ek JSON string me encode karo

  signIn("google", {
    callbackUrl: "/" // 👈 yahan bhejna hai
  });
};

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/register",{
        name,email,password
      });
      router.push("/login")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 ? (
        /* ------------------- Step 1: Welcome Screen ------------------- */
       <Welcome step={setStep} />
      )  : (
        /* ------------------- Step 3: Register Form ------------------- */
        <main className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
          <div
            className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-green-700 mb-2"
          >
            Create Account
          </motion.h1>
          <p className="text-gray-600 mb-8">Join SnapCart today 🍃</p>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleRegister}
            className="flex flex-col gap-5 w-full max-w-sm"
          >
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
               onChange={(e) => setPassword(e.target.value)}
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

            {/* ✅ Register Button with Spinner */}
            {(() => {
              const isFormValid =
               name.trim() !== "" &&
                email.trim() !== "" &&
               password.trim() !== "";

              return (
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
                      Loading...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              );
            })()}

            {/* Divider */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
              <span className="flex-1 h-px bg-gray-200"></span>
              or
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
              onClick={handleGoogleLogin}
            >
              <Image src={googleImage} alt="Google logo" className="w-5 h-5" />
              Continue with Google
            </button>
          </motion.form>

          {/* Sign In Link */}
          <p className="text-gray-600 mt-6 text-sm flex items-center gap-1">
            Already have an account?
            <Link
              href="/login"
              className="text-green-700 font-semibold hover:underline flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          </p>
        </main>
      )}
    </div>
  );
}

export default Register;
