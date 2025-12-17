export default function RevenueLoading() {
  return (
    <div className="space-y-8 pb-20 animate-pulse">
      {/* HEADER SECTION SKELETON */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          {/* Title: Revenue Report */}
          <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
          {/* Subtitle */}
          <div className="h-5 w-32 bg-gray-100 rounded-lg"></div>
        </div>
        {/* Date Filter Pill Skeleton */}
        <div className="h-12 w-64 bg-gray-200 rounded-full"></div>
      </div>

      {/* BIG CARDS (2 Column) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Platform Revenue (Black Card mimic) */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-300 h-64 shadow-sm border border-gray-200">
          <div className="absolute top-0 right-0 p-8">
            <div className="w-32 h-32 bg-gray-400/20 rounded-full blur-xl"></div>
          </div>
          <div className="p-8 space-y-4 relative z-10">
            <div className="h-5 w-40 bg-gray-400 rounded-full"></div>
            <div className="h-12 w-56 bg-gray-400 rounded-xl"></div>
            <div className="h-4 w-48 bg-gray-400/50 rounded-lg"></div>
            <div className="pt-6 border-t border-gray-400/30 w-32">
              <div className="h-4 w-full bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Card 2: Partner Revenue (White Card mimic) */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 h-64 shadow-sm">
          <div className="p-8 space-y-4">
            <div className="h-5 w-40 bg-gray-100 rounded-full"></div>
            <div className="h-12 w-56 bg-gray-200 rounded-xl"></div>
            <div className="h-4 w-48 bg-gray-100 rounded-lg"></div>
            <div className="pt-6 border-t border-gray-50 w-full">
              <div className="h-4 w-24 bg-green-50 rounded px-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* PARTNER BREAKDOWN GRID */}
      <div>
        {/* Section Title */}
        <div className="h-6 w-48 bg-gray-200 rounded-lg mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full"
            >
              {/* Image Area */}
              <div className="h-32 w-full bg-gray-200"></div>
              {/* Content Area */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-end">
                  <div className="h-3 w-16 bg-gray-100 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 w-3/4 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
