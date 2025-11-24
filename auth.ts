// auth.ts
import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig, // Ini ngambil logic middleware dari auth.config.ts

  // Cukup gini aja, dia otomatis baca AUTH_GOOGLE_ID dari .env lo
  providers: [Google],

  callbacks: {
    ...authConfig.callbacks, // Gabungin logic authorized

    // Nambahin ID & Role ke session
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
