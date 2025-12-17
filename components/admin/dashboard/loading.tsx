export default function DashboardLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* HEADER SECTION SKELETON */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
          <div className="h-5 w-64 bg-gray-100 rounded-lg"></div>
        </div>
        {/* Filter Bulan Skeleton */}
        <div className="h-12 w-40 bg-gray-200 rounded-full"></div>
      </div>

      {/* STATS CARDS SKELETON (3 Grid) */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden h-56"
          >
            <div className="absolute top-0 right-0 p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full opacity-50"></div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-48 bg-gray-300 rounded-lg"></div>
              <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION SKELETON */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="h-8 w-20 bg-gray-900/10 rounded-full"></div>
        </div>

        <div className="p-0">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center gap-6 p-6 border-b border-gray-50"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 