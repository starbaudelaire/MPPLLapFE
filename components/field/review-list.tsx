import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewList({ reviews }: any) {
  if (!reviews?.length) return <div className="p-4 border border-dashed rounded text-center text-gray-500">Belum ada review.</div>;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-bold">Apa Kata Mereka?</h3>
      {reviews.map((r: any) => (
        <div key={r.id} className="bg-white p-4 rounded-xl border shadow-sm">
           <div className="flex justify-between">
             <span className="font-bold">User</span>
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`h-4 w-4 ${i < r.rating ? "" : "text-gray-200"}`} />
                ))}
             </div>
           </div>
           <p className="text-gray-600 mt-2">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}