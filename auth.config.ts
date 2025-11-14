import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Daftar route yang mau lo proteksi
const ProtectedRoutes = ["/myreservation", "/checkout", "/admin"];

export const authConfig = {
  providers: [Google], // Provider aman di Edge
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" }, // WAJIB JWT buat middleware
  callbacks: {
    // Callbacks ini aman di Edge karena cuma mainin token
    jwt({ token, user }) {
      if (user) {
        // @ts-expect-error // Ini buat nambahin role ke token
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub; // Ambil ID dari token
      // @ts-expect-error // Ini buat nambahin role ke session
      session.user.role = token.role; // Ambil role dari token
      return session;
    },

    // INI PENGGANTI LOGIC MIDDLEWARE LO
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user.role;
      const { pathname } = nextUrl;

      const isProtectedRoute = ProtectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // 1. Kalo mau akses route terproteksi TAPI BELUM LOGIN
      if (isProtectedRoute && !isLoggedIn) {
        // Redirect ke /signin
        // `false` bakal otomatis redirect ke `pages.signIn`
        return false;
      }

      // 2. Kalo UDAH LOGIN, role BUKAN ADMIN, tapi maksa akses /admin
      if (isLoggedIn && role !== "admin" && pathname.startsWith("/admin")) {
        // Lempar ke homepage
        return Response.redirect(new URL("/", nextUrl));
      }

      // 3. Kalo UDAH LOGIN, tapi akses /signin
      if (isLoggedIn && pathname.startsWith("/signin")) {
        // Lempar ke homepage
        return Response.redirect(new URL("/", nextUrl));
      }

      // 4. Kalo lolos semua, gas!
      return true;
    },
  },
} satisfies NextAuthConfig;
