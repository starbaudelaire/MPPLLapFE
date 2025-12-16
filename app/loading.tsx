export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Logo Animation */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#f64e42] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">
          Loading Arena...
        </p>
      </div>
    </div>
  );
}
