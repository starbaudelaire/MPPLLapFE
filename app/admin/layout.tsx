import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Cek Session
  const session = await auth();

  // 2. LOGIC SATPAM / BOUNCER 🛡️
  if (!session || session.user.role !== "admin") {
    redirect("/"); // Tendang user nakal
  }

  // 3. Render Halaman Admin dengan FIX PADDING
  return (
    // TAMBAHAN PENTING: pt-24 min-h-screen bg-gray-50
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
