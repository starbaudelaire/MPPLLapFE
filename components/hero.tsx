import Image from "next/image";
import SearchFilter from "./home/search-filter";

const Hero = () => {
  return (
    // DIUBAH: h-screen menjadi h-[72vh] (Ini tetap)
    <div className="relative h-[72vh] text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/well-2.png"
          alt="hero image"
          fill
          className="object-cover object-center w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-2 capitalize drop-shadow-md">
          Secure Your Field
        </h1>
        <p className="text-xl md:text-3xl font-normal mb-8 drop-shadow-md max-w-2xl text-gray-100">
          A step closer to your perfect game.
        </p>

        {/* Search Filter Component */}
        <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SearchFilter transparent buttonLabel="Start Now" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
