import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

// Helper function buat format tanggal
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ReviewList({ reviews }: any) {
  if (!reviews?.length) return (
    <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
      <p className="text-gray-500">Belum ada ulasan untuk lapangan ini.</p>
      <p className="text-sm text-gray-400">Jadilah yang pertama mereview!</p>
    </div>
  );

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-bold text-gray-900">Ulasan Pengguna ({reviews.length})</h3>
      
      <div className="grid gap-4">
        {reviews.map((r: any) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
               
               {/* Bagian Profil User */}
               <div className="flex items-center gap-3">
                 <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {/* Foto User atau Default Avatar */}
                    <Image 
                      src={r.user?.image || "/avatar.svg"} // Pastikan ada file avatar.svg di folder public ya!
                      alt={r.user?.name || "User"}
                      fill
                      className="object-cover"
                    />
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 text-sm">{r.user?.name || "Pengguna Tanpa Nama"}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                 </div>
               </div>

               {/* Bagian Bintang */}
               <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`h-4 w-4 ${i < r.rating ? "text-yellow-400" : "text-gray-200"}`} />
                  ))}
               </div>
             </div>

             {/* Komentar */}
             <div className="mt-3 pl-[52px]">
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{r.comment}"
                </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}