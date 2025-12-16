import CreateForm from "@/components/admin/field/create-form";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { getAllAmenities } from "@/lib/data"; // Import fungsi baru

export default async function CreateFieldPage() {
  // Fetch Data Fasilitas dari DB
  const amenities = await getAllAmenities();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link
          href="/admin/field"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to List
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Add New Arena
        </h1>
        <p className="text-gray-500 mt-1">
          Register a new sports venue to the platform.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Lempar data amenities ke Client Component */}
          <CreateForm amenities={amenities} />
        </div>
      </div>
    </div>
  );
}
