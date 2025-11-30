import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // -----------------------------
  // Providers
  // -----------------------------
  providers: [
    // 1️⃣ Credentials Login
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Email and password are required");

        await connectDb();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password!
        );
        if (!isValid) throw new Error("Invalid password");

        // ✅ Return essential data (NextAuth uses this in jwt callback)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),

    // 2️⃣ Google Login
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // -----------------------------
  // Callbacks
  // -----------------------------
  callbacks: {
    // 1️⃣ Ensure Google users have a role
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await connectDb();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user with default role
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role:user?.role || "user", // ✅ default role
          });
        }

        // Inject DB info into NextAuth's user object
        user.id = dbUser._id.toString();
        user.role = dbUser.role; // ✅ attach role manually
      }

      return true;
    },

    // 2️⃣ Store everything into JWT
    async jwt({ token, user,trigger,session }) {
      // when logging in (first time), merge user data into token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role; // ✅ make sure role persists
      }
      if(trigger==="update"){
        token.role=session.role
      }

      return token;
    },

    // 3️⃣ Make role available in session for client
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },

  // -----------------------------
  // Settings
  // -----------------------------
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
});
