// starbaudelaire/mppllapfe/MPPLLapFE-master/components/footer.tsx (FIXED)
import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 w-full py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="mb-5 block">
              <Image
                src="/lapang-in.png"
                width={39}
                height={39}
                alt="logo"
              ></Image>
            </Link>
            <p className="text-sm text-gray-400 pr-4">
              Lapang.in is your go-to platform for booking sports fields-fast,
              easy, and hassle-free.
            </p>
          </div>
          <div>
            <div className="flex gap-16">
              <div className="flex-1 md:flex-none">
                <h4 className="mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Explore
                </h4>
                <ul className="list-item space-y-3 text-sm text-gray-300">
                  <li>
                    <Link href="/" className="hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/lapangan" className="hover:text-white">
                      Fields
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get updates, new venues, and special promos.
            </p>
            <form action="" className="mt-4">
              <div className="mb-3">
                <input
                  type="text"
                  name="email"
                  className="w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-[#f64e42] focus:ring-0"
                  placeholder="lapang.in@example.com"
                />
              </div>
              <button
                className="bg-[#f64e42] p-2.5 font-semibold text-white w-full text-center text-sm
                            rounded-md hover:bg-[#f64e42]/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 border-t border-gray-800 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="mb-4 md:mb-0">
            &copy; Copyright 2025 | Lapang.in | All Right Reserved
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
