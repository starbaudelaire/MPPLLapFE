import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-screen text-white overflow-hidden">
      <div className="absoluter inset-0">
        <Image
          src="/well-2.png"
          alt="hero image"
          fill
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="relative flex flex-col justify-center items-center h-full text-center">
        <h1 className="text-6xl font-semibold leading-tight mb-2 capitalize">
          Secure Your Field
        </h1>
        <p className="text-3xl font-normal mb-6">
          A step closer to your perfect game.
        </p>
        <div className="flex gap-5">
          <Link
            href="/room"
            className="bg-[#f64e42] text-white hover:bg-[#f64e42]/90 py-2.5 px-6 md:px-7 text-lg font-normal hover:scale-105 hover:shadow-lg rounded-full"
          >
            Start Now
          </Link>
          <Link
            href="/contact"
            className="bg-transparent border border-white text-white hover:bg-white/10 py-2.5 px-6 md:px-7 text-lg font-normal hover:scale-105 hover:shadow-lg rounded-full"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
