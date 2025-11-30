import { 
  getTodayRevenue, 
  getTotalBooking, 
  getTotalActiveFields,
  getAllReservations 
} from "@/lib/data";
import { updateReservationStatus } from "@/lib/action";

export default async function AdminDashboard() {
  // 1. Tarik semua data secara PARALEL (biar ngebut)
  const [todayRevenue, totalBooking, activeFields, reservations] = await Promise.all([
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
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Laporan performa Lapang.in hari ini. Semangat mantau, Admin! 🚀
        </p>
      </div>
      
      {/* STATS CARDS SECTION */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Revenue */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-medium text-gray-500">Pendapatan Hari Ini</div>
            <span className="text-green-500 text-xl">💰</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatRupiah(todayRevenue)}
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium">
            + Realtime update
          </p>
        </div>
        
        {/* Card 2: Total Booking */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-medium text-gray-500">Total Booking (Paid)</div>
            <span className="text-blue-500 text-xl">📅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalBooking}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Reservasi berhasil dibayar
          </p>
        </div>

        {/* Card 3: Active Fields */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-medium text-gray-500">Lapangan Aktif</div>
            <span className="text-orange-500 text-xl">🏟️</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {activeFields}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Siap digunakan
          </p>
        </div>
      </div>
      
      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Reservasi Masuk</h2>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
            Total: {reservations.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Lapangan</th>
                <th className="px-6 py-4">Jadwal Main</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status Bayar</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <p className="text-base">Belum ada bookingan masuk, Bro.</p>
                    <p className="text-xs mt-1">Sambil nunggu, ngopi dulu enak kali ya ☕</p>
                  </td>
                </tr>
              ) : (
                reservations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {item.User.name || "Guest"}
                      </div>
                      <div className="text-xs text-gray-500">{item.User.email}</div>
                    </td>

                    {/* Field Info */}
                    <td className="px-6 py-4 text-gray-700">
                      {item.Field.name}
                    </td>

                    {/* Date Info */}
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(item.startDate)}
                    </td>

                    {/* Price Info */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatRupiah(item.price)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.Payment?.status === "PAID" 
                          ? "bg-green-100 text-green-700 border border-green-200" 
                          : item.Payment?.status === "CANCELLED"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}>
                        {item.Payment?.status || "UNPAID"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        
                        {/* Tombol APPROVE */}
                        {item.Payment?.status !== "PAID" && item.Payment?.status !== "CANCELLED" && (
                          <form action={updateReservationStatus}>
                            <input type="hidden" name="reservationId" value={item.id} />
                            <input type="hidden" name="status" value="PAID" />
                            <button 
                              type="submit"
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 shadow-sm transition-all active:scale-95"
                            >
                              Approve
                            </button>
                          </form>
                        )}

                        {/* Tombol CANCEL */}
                        {item.Payment?.status !== "CANCELLED" && (
                          <form action={updateReservationStatus}>
                            <input type="hidden" name="reservationId" value={item.id} />
                            <input type="hidden" name="status" value="CANCELLED" />
                            <button 
                              type="submit"
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-white rounded-md hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
                            >
                              Cancel
                            </button>
                          </form>
                        )}

                        {/* Kalo udah PAID, kasih tanda Check */}
                        {item.Payment?.status === "PAID" && (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            ✅ Done
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