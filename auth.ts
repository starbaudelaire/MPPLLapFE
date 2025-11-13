import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config"; // <-- IMPORT CONFIG LITE-NYA

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // <-- PAKE CONFIG LITE
  adapter: PrismaAdapter(prisma), // <-- TAMBAHIN ADAPTER DI SINI
  // providers-nya udah ada di authConfig
  // callbacks-nya juga udah di authConfig
});
