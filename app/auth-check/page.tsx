// app/auth-check/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthCheckPage() {
  // Kita intip dulu session-nya
  const session = await auth();

  // Kalo ternyata belom login tapi nyasar ke sini, tendang balik ke login
  if (!session?.user) {
    return redirect("/signin");
  }

  // LOGIKA UTAMA: Pisah jalur sesuai kasta (role)
  // Pastiin property .role ini udah ke-handle di auth.ts lu (lu udah bener kok di auth.ts)
  
  if (session.user.role === "admin") {
    // Jalur VIP buat Admin
    return redirect("/admin/dashboard");
  } else {
    // Jalur Warga Biasa
    // Gue arahin ke /field karena itu halaman utama app lu (List Lapangan)
    return redirect("/field");
  }
}