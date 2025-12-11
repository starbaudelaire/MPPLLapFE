// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/signin");

      // 1. Proteksi Dashboard Admin
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Tendang ke login
      }

      // 2. Redirect user login yang nyasar ke halaman signin
      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Biarin kosong di sini
} satisfies NextAuthConfig;