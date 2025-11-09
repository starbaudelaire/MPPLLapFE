import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react"; // <-- Tetep ada
import { auth } from "@/auth"; // <-- Tetep ada
import "./globals.css";

export const metadata: Metadata = {
  title: "Lapang.in - Booking Lapangan Olahraga", // <-- Ganti judul
  description: "Cari dan booking lapangan futsal, basket, badminton.", // <-- Ganti deskripsi
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        {/* Tambahin link font dari repo 'master' */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      {/* Ganti font dan background global */}
      <body className="font-sans antialiased">
        <SessionProvider session={session}>
          {" "}
          {/* <-- Wrapper-nya tetep aman */}
          <Navbar />
          {/* Ganti background main content */}
          <main className="bg-lapang-gray min-h-screen">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
