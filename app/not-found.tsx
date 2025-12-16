import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          404 - Offside!
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          Not Found - The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex w-full justify-center items-center px-6 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-[#f64e42] hover:bg-[#d93d32] shadow-lg hover:-translate-y-1 transition-all"
        >
          Go Back To Your Mama
        </Link>
      </div>
    </div>
  );
}
