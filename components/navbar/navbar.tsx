// components/navbar/navbar.tsx (FIXED LAGI)

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoClose, IoMenu, IoPersonOutline } from "react-icons/io5";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [open, setOpen] = useState(false); // Mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  return (
    <div className="fixed top-0 w-full z-20 bg-black/40 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto p-4">
        {/* --- Versi Desktop --- */}
        <div className="hidden md:flex justify-center items-center space-x-6">
          <Link href="/">
            <Image
              src="/lapang-in.png"
              width={27}
              height={27}
              alt="logo"
              priority
            />
          </Link>
          <Link
            href="/"
            className="font-light text-sm text-white hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/lapangan"
            className="font-light text-sm text-white hover:text-primary"
          >
            Fields
          </Link>

          {session && (
            <>
              <Link
                href="/myreservation"
                className="font-light text-sm text-white hover:text-primary"
              >
                Schedule
              </Link>
              {session.user.role === "admin" && (
                <>
                  {/* === INI YANG DIGANTI (DESKTOP) === */}
                  <Link
                    href="/field"
                    className="font-light text-sm text-white hover:text-primary"
                  >
                    Manage
                  </Link>
                  {/* Link Dashboard kita arahin ke /field juga sementara, karena halamannya blm ada */}
                  <Link
                    href="/field"
                    className="font-light text-sm text-white hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  {/* === BATAS === */}
                </>
              )}
            </>
          )}
          <Link
            href="/about"
            className="font-light text-sm text-white hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="font-light text-sm text-white hover:text-primary"
          >
            Contact
          </Link>

          <div className="relative" ref={profileMenuRef}>
            {session ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300/50"
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="size-8 rounded-full"
                    src={session.user.image || "/avatar.svg"}
                    width={32}
                    height={32}
                    alt="avatar"
                  />
                </button>

                <div
                  className={clsx(
                    "absolute right-0 z-50 my-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow",
                    { hidden: !isProfileOpen }
                  )}
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">
                      {session.user.name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      {session.user.email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link href="/signin">
                <IoPersonOutline className="size-5 text-white hover:text-primary" />
              </Link>
            )}
          </div>
        </div>

        {/* --- Versi Mobile (Logo + Tombol Menu) --- */}
        <div className="flex md:hidden justify-between items-center">
          <Link href="/">
            <Image
              src="/lapang-in.png"
              width={32}
              height={32}
              alt="logo"
              priority
            />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center p-2 justify-center text-sm rounded-md text-white hover:bg-black/10"
          >
            {!open ? (
              <IoMenu className="size-8" />
            ) : (
              <IoClose className="size-8" />
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      <div
        className={clsx("md:hidden", {
          "block absolute top-full left-0 w-full bg-white shadow-md": open,
          hidden: !open,
        })}
      >
        <ul className="flex flex-col font-normal p-4 mt-0 text-gray-800">
          <li>
            <Link
              href="/"
              className="block py-2 px-3 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/lapangan"
              className="block py-2 px-3 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Fields
            </Link>
          </li>

          {session && (
            <>
              <li>
                <Link
                  href="/myreservation"
                  className="block py-2 px-3 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Schedule
                </Link>
              </li>
              {session.user.role === "admin" && (
                <>
                  <li className="border-t border-gray-200 my-2"></li>
                  {/* === INI YANG DIGANTI (MOBILE) === */}
                  <li>
                    <Link
                      href="/field"
                      className="block py-2 px-3 hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      Manage Fields
                    </Link>
                  </li>
                  {/* Link Dashboard kita arahin ke /field juga sementara */}
                  <li>
                    <Link
                      href="/field"
                      className="block py-2 px-3 hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  {/* === BATAS === */}
                </>
              )}
            </>
          )}
          <li>
            <Link
              href="/about"
              className="block py-2 px-3 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block py-2 px-3 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </li>

          <li className="border-t border-gray-200 my-2"></li>
          {session ? (
            <>
              <li>
                <div className="px-3 py-2">
                  <span className="block text-sm font-semibold text-gray-900">
                    {session.user.name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate">
                    {session.user.email}
                  </span>
                </div>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="block w-full text-left py-2 px-3 text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="pt-2">
              <Link
                href="/signin"
                className="py-2.5 px-6 bg-primary text-white text-center block hover:bg-primary/90 rounded-sm"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
