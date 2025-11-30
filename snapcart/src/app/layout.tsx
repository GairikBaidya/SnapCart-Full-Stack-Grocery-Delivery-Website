import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/ClientProvider";
import InitUser from "@/InitUser";
import { ReduxProviders } from "@/redux/ReduxProviders";
import "leaflet/dist/leaflet.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snap Cart",
  description: "10 minuets grocery delivery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-gradient-to-b from-white to-green-50`}
      >
        <ClientProvider>
          <ReduxProviders>
          <InitUser/>
          
        {children}
        </ReduxProviders>
        </ClientProvider>
      </body>
    </html>
  );
}
