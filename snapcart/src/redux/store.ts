import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/redux/userSlice"
import cartSlice from "@/redux/cartSlice"

export const store = configureStore({
  reducer: {
    user:userSlice,
    cart:cartSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
