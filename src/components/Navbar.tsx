"use client";

import ccLogo from "../assets/codechef_logo.svg";
import Image from "next/image";
import ModeToggle from "@/components/toggle-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownLeftIcon } from "lucide-react";
import { StarIcon } from "lucide-react";

function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 flex h-[85px] w-full items-center justify-between gap-x-3 overflow-hidden bg-[#B2B8FF] px-2 py-6 dark:bg-[#130E1F] md:px-12">
      <div className="flex items-center gap-x-2 md:w-auto">
        <a
          href="https://www.codechefvit.com/"
          className="inline-block"
          title="CodeChef VIT Homepage"
        >
          <Image
            src={ccLogo as HTMLImageElement}
            alt="codechef-logo"
            height={60}
            width={60}
          />
        </a>
        <Link
          href="/"
          className="bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text text-left font-jost text-4xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8] md:text-6xl"
        >
          Papers
        </Link>
        <Link href="/pinned">
          <div className="ml-3 mt-4 flex items-center gap-1 rounded-full border border-white/20 bg-[#1A1921] px-4 py-[6px] text-xs font-semibold text-white shadow-sm transition hover:bg-[#2C2A36] dark:border-[#36266D] dark:bg-[#171720] dark:hover:bg-[#2A2635] sm:text-sm">
            <StarIcon className="h-4 w-4" />
            Pinned Subjects
          </div>
        </Link>
      </div>
      <div className="md:w/[20%] flex items-center justify-end gap-x-2">
        <div className="scale-75 sm:scale-100">
          <ModeToggle />
        </div>

        <Link href={pathname == "/upload" ? "/" : "/upload"}>
          <div className="rounded-md bg-[#453D60] p-[1.5px] md:p-[2px]">
            <div className="flex items-center gap-1 rounded-md bg-slate-200 px-2 py-1 text-[9px] font-bold tracking-tight text-black transition-all duration-150 hover:bg-white active:scale-95 dark:bg-[#171720] dark:text-white dark:hover:bg-slate-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-[10px] md:px-6 md:text-sm">
              <ArrowDownLeftIcon className="h-3 w-3 rotate-90 sm:h-4 sm:w-4" />
              <span className="text-center font-semibold">
                {pathname === "/upload" ? "SEARCH PAPERS" : "UPLOAD PAPERS"}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
