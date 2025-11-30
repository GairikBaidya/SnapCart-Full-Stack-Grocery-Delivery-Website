"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Upload, PlusCircle, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

function AddGrocery() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [name,setName]=useState("")
  const [category,setCategory]=useState("")
  const [price,setPrice]=useState("")
  const [unit,setUnit]=useState("piece")
  const [image,setImage]=useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 const handleImage=(e:React.ChangeEvent<HTMLInputElement>)=>{
const files=e.target.files
if(!files || files.length==0) return
 const file=files[0]
 setImage(file)
setPreview(URL.createObjectURL(file))
   }

   const handleSubmit=async (e:FormEvent)=>{
    e.preventDefault()
    try {
      const formdata=new FormData()
      formdata.append("name",name)
      formdata.append("category",category)
      formdata.append("unit",unit)
      formdata.append("price",price)
      if(image){
        formdata.append("file",image)
      }

      
      const result=await axios.post("/api/admin/add-grocery",formdata)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
   }
 

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-16 px-4 relative">
      {/* 🔙 Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* 🌿 Add Grocery Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-green-600 w-8 h-8" />
            <h2 className="text-3xl font-extrabold text-green-700">
              Add Grocery Item
            </h2>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        {/* Form */}
        <form
        onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full animate-fadeIn"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Fresh Apples"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={category}
               onChange={(e)=>setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Unit
              </label>
              <select
                name="unit"
                value={unit}
               onChange={(e)=>setUnit(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                {["kg", "g", "liter", "ml", "piece", "pack"].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              placeholder="eg. 120"
              value={price}
            onChange={(e)=>setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <label className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto">
                <Upload className="w-5 h-5" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-xl shadow-md border border-gray-200 object-cover"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Add Grocery
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddGrocery;
