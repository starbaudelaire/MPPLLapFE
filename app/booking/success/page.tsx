import Link from "next/link";
import {
  CheckCircleIcon,
  HomeIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4 animate-bounce">
            <CheckCircleIcon className="w-20 h-20 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8">
          Hooray! Your booking has been secured.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
          <p className="text-xs text-gray-400 font-bold uppercase">
            Booking ID
          </p>
          <p className="text-xl font-mono font-bold text-gray-800">
            #{id?.slice(-6).toUpperCase() || "UNKNOWN"}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/myreservation"
            className="w-full flex items-center justify-center gap-2 bg-[#f64e42] text-white font-bold py-3 rounded-xl shadow-lg hover:-translate-y-1 transition-all"
          >
            <TicketIcon className="w-5 h-5" /> View Ticket
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <HomeIcon className="w-5 h-5" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
