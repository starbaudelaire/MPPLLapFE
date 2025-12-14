// app/admin/layout.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Kita tarik data session user yang lagi login
  const session = await auth();

  // 2. LOGIC SATPAM / BOUNCER 🛡️
  // Kalo user belom login (session null) ATAU role-nya bukan 'admin'
  if (!session || session.user.role !== "admin") {
    // "Sorry bro, this area is restricted." -> Tendang ke Home
    redirect("/"); 
  }

  // 3. Kalo aman (dia admin), silakan lanjut render halaman admin-nya
  return (
    <>
      {children}
    </>
  );
}