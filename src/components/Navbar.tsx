"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ccLogo from "../assets/codechef_logo.svg";
import ModeToggle from "@/components/toggle-theme";
import { ArrowDownLeftIcon, StarIcon } from "lucide-react";
import NavDropdownButton from "./NavDropdownButton";
import FloatingNavbar from "./FloatingNavbar";
import PWAInstallButton from "./ui/PWAInstallButton";

function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-10 w-full bg-[#B2B8FF] px-4 py-4 dark:bg-[#130E1F] md:px-8 md:py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="https://www.codechefvit.com/">
            <Image
              src={ccLogo as HTMLImageElement}
              alt="codechef-logo"
              height={60}
              width={60}
            />
          </a>

          <Link
            href="/"
            className="bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text font-jost text-4xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8] md:text-6xl"
          >
            Papers
          </Link>

          <div className="hidden md:flex">
            <Link href="/pinned">
              <div className="ml-2 flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
                <StarIcon className="h-4 w-4" />
                Pinned Subjects
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="rounded-full border border-[#3A3745] p-1">
            <ModeToggle />
          </div>

          <div className="hidden md:block max-w-[200px]">
            <PWAInstallButton />
          </div>

          <Link href={pathname === "/upload" ? "/" : "/upload"}>
            <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
              <ArrowDownLeftIcon className="h-4 w-4 rotate-90" />
              <span>
                {pathname === "/upload" ? "Search Papers" : "Upload Papers"}
              </span>
            </div>
          </Link>
        </div>

        <div className="md:hidden" ref={dropdownContainerRef}>
          <NavDropdownButton
            isOpen={open}
            onClick={() => setOpen((prev) => !prev)}
          />
          <div
            className={`transition-all duration-300 ease-in-out ${
              open ? "block" : "hidden"
            }`}
          >
            <FloatingNavbar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
