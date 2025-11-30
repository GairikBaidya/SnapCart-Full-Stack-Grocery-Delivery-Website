"use client";

import { useEffect } from "react";
import { useGetMe } from "./hooks/useGetMe";





export default function InitUser() {
 
  useGetMe(); // run globally once
  return null;
}
