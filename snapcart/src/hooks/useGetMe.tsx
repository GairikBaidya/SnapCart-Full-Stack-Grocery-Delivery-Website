"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { AppDispatch, RootState } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";



export const useGetMe = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {userData} = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me"); // 🔹 Replace with your API endpoint
        dispatch(setUserData(res.data));
        console.log(res.data)
      } catch (error) {
        console.log(error)
      }
    };

    if (!userData ) fetchUser();
  }, [dispatch, userData]);

  return userData;
};
