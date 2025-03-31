"use client"
import ccLogo from "../assets/codechef_logo.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/toggle-theme";
import { ArrowUpToLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-x-3 w-full h-[86px] overflow-hidden px-2 py-6 md:px-12 bg-[#B2B8FF] dark:bg-[#130E1F]">
      <div className="flex items-center gap-x-2 w-[20%] md:w-auto">
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
          className="jost tracking-wide bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text text-4xl font-bold text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8] text-left md:text-6xl"
        >
          Papers
        </Link>
      </div>
      <div className="flex items-center justify-end gap-x-2 md:w/[20%]">
        <div className="hidden md:block">
          <ModeToggle />
        </div>

        <Link href={pathname == "/upload" ? "/" : "/upload"}>
          <div className="md:p-[2px] bg-[#453D60] rounded-md">
            <div className="whitespace-nowrap rounded-md font-bold text-xs md:text-sm mt-2 md:mt-0 bg-slate-200 dark:bg-[#171720] px-4 md:px-6 py-3 tracking-wider text-black dark:text-white font-sans hover:bg-white dark:hover:bg-slate-700">
              {pathname == "/upload" ? "⇱ SEARCH PAPERS" : "⇱ UPLOAD PAPERS"}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
