// proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Matcher ini biar proxy GAK jalan di file statis (gambar, css, dll)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};