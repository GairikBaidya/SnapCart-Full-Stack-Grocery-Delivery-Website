"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMap({
  userAddressLocation,
  deliveryLocation,
}: {
  userAddressLocation: { latitude: number; longitude: number };
  deliveryLocation: { latitude: number; longitude: number } | null;
}) {
  const userIcon = L.icon({
    iconUrl: `/home.png`,
    iconSize: [45, 45],
  });

  const deliveryIcon = L.icon({
    iconUrl: '/deliveryBoy.png',
    iconSize: [45, 45],
  });

  const center = deliveryLocation
    ? [deliveryLocation.latitude, deliveryLocation.longitude]
    : [userAddressLocation.latitude, userAddressLocation.longitude];

  const linePoints =
    deliveryLocation && userAddressLocation
      ? [
          [userAddressLocation.latitude, userAddressLocation.longitude],
          [deliveryLocation.latitude, deliveryLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative ">
      <MapContainer
        center={center as any}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* USER ADDRESS MARKER */}
        <Marker
          position={[
            userAddressLocation.latitude,
            userAddressLocation.longitude,
          ]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {/* DELIVERY BOY MARKER */}
        {deliveryLocation && (
          <Marker
            position={[deliveryLocation.latitude, deliveryLocation.longitude]}
            icon={deliveryIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        {/* POLYLINE FIX */}
        {linePoints.length > 0 && (
          <Polyline positions={linePoints as [number, number][]} color="green"/>
        )}
      </MapContainer>
    </div>
  );
}
