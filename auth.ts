<<<<<<< HEAD
// auth.ts

import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma), // <-- INI YANG PENTING
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // <-- DAN INI
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
  },
=======
import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config"; // <-- IMPORT CONFIG LITE-NYA

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // <-- PAKE CONFIG LITE
  adapter: PrismaAdapter(prisma), // <-- TAMBAHIN ADAPTER DI SINI
  // providers-nya udah ada di authConfig
  // callbacks-nya juga udah di authConfig
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
});
