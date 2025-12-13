import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    // Validasi
    if (!file || file.size === 0) {
      return NextResponse.json({ message: "File is Required" }, { status: 400 });
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ message: "File size must be less than 4MB" }, { status: 400 });
    }
    // Cek Token (Biar ketauan kalo lupa)
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing in .env");
    }

    // Upload ke Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      multipart: true, // Biar support file agak gede
    });

    // Balikin JSON object blob (isinya ada url, pathname, dll)
    return NextResponse.json(blob);

  } catch (error) {
    console.error("❌ Vercel Blob Error:", error);
    return NextResponse.json(
      // Kirim pesan error aslinya ke frontend biar gak "{}" doang
      { message: error instanceof Error ? error.message : "Upload Failed" }, 
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
      return NextResponse.json({ message: "Image URL required" }, { status: 400 });
    }

    await del(imageUrl);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
};