import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  role: "admin" | "user" | "deliveryBoy";
  image?: string;
  email: string;
  mobile: string;
  myOrders?: mongoose.Types.ObjectId[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // ADD THIS
  location?: {
    type: string;
    coordinates: [number, number];  // [longitude, latitude]
  }
}



interface IUserSlice {
  userData:IUser | null
}

const initialState:IUserSlice={
userData:null
}


const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserData:(state,action)=>{
        state.userData=action.payload
    }
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
