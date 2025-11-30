import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import HeroSection from "@/components/HeroSection";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  await connectDb();

  if (!session?.user?.email) {
    redirect("/login");
  }



  const user = await User.findOne({ email: session.user.email });
  if (!user) redirect("/login");

  
  const isIncomplete =
    !user.mobile ||
    !user.role ||
    (user.mobile === "0000000000" && user.role === "user");

  if (isIncomplete) return <EditRoleMobile />;

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ✅ Fixed Navbar */}
      <Nav user={plainUser} />
 <GeoUpdater userId={plainUser._id} />
      {/* ✅ Page Content */}
      <main className="flex-grow pt-24 w-full">
        {user.role === "user" ? (
          <UserDashboard />
        ) : user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <DeliveryBoy />
        )}
      </main>

      {/* ✅ Sticky Footer */}
      <Footer />
    </div>
  );
}
