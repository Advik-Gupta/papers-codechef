"use client";
import ccLogo from "../assets/codechef_logo.svg";
import Image from "next/image";
import ModeToggle from "@/components/toggle-theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownLeftIcon } from "lucide-react";

function Navbar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 flex h-[85px] w-full items-center justify-between gap-x-3 overflow-hidden bg-[#B2B8FF] px-2 py-6 dark:bg-[#130E1F] md:px-12">
      <div className="flex items-center gap-x-2 md:w-auto">
        <a href="https://www.codechefvit.com/" className="inline-block">
          <Image
            src={ccLogo as HTMLImageElement}
            alt="codechef-logo"
            height={60}
            width={60}
          />
        </a>
        <Link
          href="/"
          className="jost bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text text-left text-4xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8] md:text-6xl"
        >
          Papers
        </Link>
      </div>
      <div className="md:w/[20%] flex items-center justify-end gap-x-2">
        <div className="scale-75 sm:scale-100">
          <ModeToggle />
        </div>

        <Link href={pathname == "/upload" ? "/" : "/upload"}>
          <div className="scale-75 rounded-md bg-[#453D60] md:p-[2px]">
            <div className="flex items-center gap-2 whitespace-nowrap rounded-md bg-slate-200 py-2 text-[10px] font-bold tracking-tight text-black transition-all duration-150 hover:bg-white active:scale-95 dark:bg-[#171720] dark:text-white dark:hover:bg-slate-700 sm:px-4 sm:text-xs md:px-6 md:text-sm">
              <ArrowDownLeftIcon className="rotate-90" />
              <span>
                {pathname == "/upload" ? "SEARCH PAPERS" : "UPLOAD PAPERS"}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
