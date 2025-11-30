import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-[85vh] text-white overflow-hidden">
      {/* Background Image dengan Overlay Gradient agar teks terbaca */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg" // Pastikan gambar ini ada di folder public Anda atau gunakan yang ada
          alt="Sports Field Hero"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlay: Penting untuk keterbacaan teks di atas gambar apapun */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 max-w-5xl mx-auto pb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
          Temukan Lapangan,<br />
          <span className="text-[#f64e42]">Mulai Permainan.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl drop-shadow-sm font-light">
          Booking lapangan futsal, basket, hingga mini soccer dengan mudah dan cepat.
        </p>
      </div>
    </div>
  );
};

export default Hero;