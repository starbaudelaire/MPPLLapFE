import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // <-- IMPORT CONFIG LITE-NYA

// Ambil `auth` dari config lite, BUKAN DARI @/auth
const { auth } = NextAuth(authConfig);

// Langsung export auth-nya.
// NextAuth bakal otomatis pake callback `authorized` yg udah kita set.
export default auth;

// Matcher-nya tetep sama
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
