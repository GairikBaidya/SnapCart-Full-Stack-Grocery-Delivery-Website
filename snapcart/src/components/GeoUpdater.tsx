"use client";

import { getSocket } from "@/lib/socket";
import { useEffect } from "react";


export default function GeoUpdater({ userId }: { userId: string }) {
  const socket=getSocket()
  useEffect(() => {
    if (!userId) return;

    socket.emit("identity", { userId });

    if (!("geolocation" in navigator)) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        socket.emit("updateLocation", {
          userId,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);

  return null;
}
