import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  quantity?: number; // 👈 for cart tracking
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subtotal: number;    // 🧮 price of items only
  deliveryFee: number; // 🚚 conditional delivery fee
  finalTotal: number;  // 💰 subtotal + deliveryFee
}

const initialState: ICartSlice = {
  cartData: [],
  subtotal: 0,
  deliveryFee: 40,
  finalTotal: 40, // initial fee
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    // 🟢 Add item to cart
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      const existingItem = state.cartData.find(
        (item) => item._id?.toString() === action.payload._id?.toString()
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.cartData.push({ ...action.payload, quantity: 1 });
      }

      // 🔄 Update totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    // 🔴 Remove item completely
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id?.toString() !== action.payload
      );
      cartSlice.caseReducers.calculateTotals(state);
    },

    // 🔼 Increase quantity
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(
        (item) => item._id?.toString() === action.payload
      );
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    // 🔽 Decrease quantity
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find(
        (item) => item._id?.toString() === action.payload
      );
      if (item && item.quantity && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter(
          (cartItem) => cartItem._id?.toString() !== action.payload
        );
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    // 🧹 Clear all items
    clearCart: (state) => {
      state.cartData = [];
      state.subtotal = 0;
      state.deliveryFee = 40;
      state.finalTotal = 40;
    },

    // 🧮 Calculate totals (subtotal, deliveryFee, finalTotal)
    calculateTotals: (state) => {
      // 🧾 Subtotal
      state.subtotal = state.cartData.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );

      // 🚚 Delivery Fee rule
      state.deliveryFee = state.subtotal >= 100 ? 0 : 40;

      // 💰 Final Total
      state.finalTotal = state.subtotal + state.deliveryFee;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
