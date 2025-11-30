import mongoose from "mongoose";

interface IGrocery{
_id?:mongoose.Types.ObjectId  
name:string,
category:string,
price:string,
unit:string,
image:string
createdAt?:Date
updatedAt?:Date
}
const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
   category: {
  type: String,
  required: true,
  enum: [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Spices & Masalas",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Packaged Food",
    "Baby & Pet Care"
  ],
},
    price: {
      type: String,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    
    unit: {
      type: String,
      enum: ["kg", "g", "liter", "ml", "piece", "pack"],
      default: "piece",
    },
    image: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

// Avoid recompiling model during hot reloads
const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
export default Grocery;
