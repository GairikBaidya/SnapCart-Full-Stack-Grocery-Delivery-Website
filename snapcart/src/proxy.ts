import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Allow public routes
  const publicRoutes = ["/login", "/register", "/api/auth", "/favicon.ico", "/_next"];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Get token (includes role)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
console.log(token)
  // 3️⃣ If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Extract role from token instead of session
  const role = token.role;
console.log( role)
  // 4️⃣ Role-based route protection
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 5️⃣ Allow access
  return NextResponse.next();
}

// 6️⃣ Run middleware for all app routes except static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
