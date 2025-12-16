import {
  getTodayRevenue,
  getTotalBooking,
  getTotalActiveFields,
  getAllReservations,
} from "@/lib/data";
import { updateReservationStatus } from "@/lib/action";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default async function AdminDashboard() {
  // 1. Tarik semua data secara PARALEL (biar ngebut)
  const [todayRevenue, totalBooking, activeFields, reservations] =
    await Promise.all([
      getTodayRevenue(),
      getTotalBooking(),
      getTotalActiveFields(),
      getAllReservations(),
    ]);

  // Helper: Format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Helper: Format Tanggal
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION - Steve Jobs Vibe */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Control Center
        </h1>
        <p className="text-gray-500 text-lg font-light tracking-wide">
          Dear Admin, How is life btw?
        </p>
      </div>

      {/* STATS CARDS SECTION - Glassmorphism & Gradient */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Revenue (Premium Green) */}
        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BanknotesIcon className="w-24 h-24 text-emerald-600 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Total Revenue
            </div>
            <div className="text-4xl font-bold text-gray-900 tracking-tight">
              {formatRupiah(todayRevenue)}
            </div>
            <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
              <SparklesIcon className="w-3 h-3 mr-1" /> Realtime Update
            </div>
          </div>
        </div>

        {/* Card 2: Total Booking (Deep Blue) */}
        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <CalendarDaysIcon className="w-24 h-24 text-blue-600 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Bookings Secured
            </div>
            <div className="text-4xl font-bold text-gray-900 tracking-tight">
              {totalBooking}
            </div>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              Confirmed reservations so far.
            </p>
          </div>
        </div>

        {/* Card 3: Active Fields (Vibrant Orange) */}
        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircleIcon className="w-24 h-24 text-orange-600 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Active Courts
            </div>
            <div className="text-4xl font-bold text-gray-900 tracking-tight">
              {activeFields}
            </div>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              Ready for action.
            </p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION - Modern List */}
      <div className="bg-white/50 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="p-8 border-b border-gray-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Incoming Reservations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and approve bookings.
            </p>
          </div>
          <span className="text-xs font-bold px-4 py-2 rounded-full bg-gray-900 text-white shadow-lg">
            Total: {reservations.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 font-semibold uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 tracking-wider">Player</th>
                <th className="px-6 py-5 tracking-wider">Arena</th>
                <th className="px-6 py-5 tracking-wider">Schedule</th>
                <th className="px-6 py-5 tracking-wider">Amount</th>
                <th className="px-6 py-5 tracking-wider">Status</th>
                <th className="px-6 py-5 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="bg-gray-100/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SparklesIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-bold text-lg">
                      All caught up!
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      No pending bookings. Time for a coffee break? ☕
                    </p>
                  </td>
                </tr>
              ) : (
                reservations.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white/60 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900 text-base mb-0.5">
                        {item.User.name || "Guest Player"}
                      </div>
                      <div className="text-xs text-gray-500 font-mono tracking-wide opacity-70 group-hover:opacity-100 transition-opacity">
                        {item.User.email}
                      </div>
                    </td>

                    {/* Field Info */}
                    <td className="px-6 py-6">
                      <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-xs">
                        {item.Field.name}
                      </span>
                    </td>

                    {/* Date Info */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {new Date(item.startDate).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.startDate).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Price Info */}
                    <td className="px-6 py-6 font-bold text-gray-900 tracking-tight">
                      {formatRupiah(item.price)}
                    </td>

                    {/* Status Badge - Modern Pills */}
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                          item.Payment?.status === "PAID"
                            ? "bg-emerald-100/80 text-emerald-700 border-emerald-200"
                            : item.Payment?.status === "CANCELLED"
                            ? "bg-rose-100/80 text-rose-700 border-rose-200"
                            : "bg-amber-100/80 text-amber-700 border-amber-200 animate-pulse"
                        }`}
                      >
                        {item.Payment?.status === "PAID"
                          ? "COMPLETED"
                          : item.Payment?.status || "UNPAID"}
                      </span>
                    </td>

                    {/* Action Buttons - Minimalist */}
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* APPROVE */}
                        {item.Payment?.status !== "PAID" &&
                          item.Payment?.status !== "CANCELLED" && (
                            <form action={updateReservationStatus}>
                              <input
                                type="hidden"
                                name="reservationId"
                                value={item.id}
                              />
                              <input type="hidden" name="status" value="PAID" />
                              <button
                                type="submit"
                                className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-emerald-200"
                                title="Approve Payment"
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                              </button>
                            </form>
                          )}

                        {/* CANCEL */}
                        {item.Payment?.status !== "CANCELLED" && (
                          <form action={updateReservationStatus}>
                            <input
                              type="hidden"
                              name="reservationId"
                              value={item.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="CANCELLED"
                            />
                            <button
                              type="submit"
                              className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-rose-200"
                              title="Reject & Cancel"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </form>
                        )}

                        {/* DONE STATUS */}
                        {item.Payment?.status === "PAID" && (
                          <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                            <CheckCircleIcon className="w-3 h-3" /> VERIFIED
                          </span>
                        )}

                        {item.Payment?.status === "CANCELLED" && (
                          <span className="text-gray-400 text-xs font-bold flex items-center gap-1 px-3 py-1">
                            VOID
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
