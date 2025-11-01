import Link from "next/link";
import Image from "next/image";
import Navlink from "@/components/navbar/navlink";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-white shadow-sm z-20">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            width={128}
            height={49}
            alt="logo"
            priority
          />
        </Link>

        <Navlink />
      </div>
    </div>
  );
};

export default Navbar;