import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // 👤 Extend the built-in `User` type
  interface User extends DefaultUser {
    id: string;
    role?: string;
    mobile?: string;
  }

  // 🧠 Extend the session to include your custom fields
  interface Session {
    user: {
      id: string;
      role?: string;
      mobile?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 💾 Extend the JWT token type
  interface JWT extends DefaultJWT {
    id: string;
    role?: string;
    mobile?: string;
  }
}
