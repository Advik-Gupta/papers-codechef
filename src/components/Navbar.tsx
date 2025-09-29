"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ccLogo from "../assets/codechef_logo.svg";
import ModeToggle from "@/components/toggle-theme";
import {
  ArrowDownLeftIcon,
  Pin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import FloatingNavbar from "./FloatingNavbar";
import PWAInstallButton from "./ui/PWAInstallButton";
import SearchBarChild from "./Searchbar/searchbar-child";
import Banner from "@/components/bannerDismiss";
import type { ICourses } from "@/interface";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCourses } from "@/context/courseContext";
import CookoffBanner from "./CookoffBanner";

function Navbar() {
  const pathname: string = usePathname() ?? "/";

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { courses, loading, error, refetch } = useCourses();

  useEffect(() => {
    if (pathname !== "/catalogue") return;
  }, [pathname]);

  const renderHomePageButtons = () => (
    <>
      <Link href="/pinned" className="ml-2">
        <div className="flex h-8 items-center gap-1 rounded-full border border-[#3A3745] bg-[#e8e9ff] px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-slate-50 dark:bg-black dark:text-white dark:hover:bg-[#1A1823] sm:h-9 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm md:h-10 md:px-4 md:py-2 md:text-base">
          <Pin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">Pinned Subjects</span>
        </div>
      </Link>

      <Link href="/request" className="ml-2 mt-2 sm:mt-0">
        <div className="flex h-8 items-center gap-1 rounded-full border border-[#3A3745] bg-[#e8e9ff] px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-slate-50 dark:bg-black dark:text-white dark:hover:bg-[#1A1823] sm:h-9 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm md:h-10 md:px-4 md:py-2 md:text-base">
          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">Paper Request</span>
        </div>
      </Link>
    </>
  );

  return (
    <div className="sticky top-0 z-[50] w-full bg-[#B2B8FF] dark:bg-[#130E1F]">
      {/* <Banner
        bannerId="freshers"
        bgColor="#fef3c7"
        textColor="#5a3000"
        iconColor="#d97706"
        accentColor="#78350f"
        title="Attention Freshers!"
        message="If papers for your subject are not yet available, click on your subject and explore related subjects until papers become available, as these are newly introduced courses."
      /> */}
      <CookoffBanner />
      <div className="flex items-center justify-between bg-inherit px-4 py-4 md:px-8 md:py-5">
        {}
        <div className="relative flex items-center gap-4">
          <Link href="https://www.codechefvit.com/" target="_blank">
            <Image
              src={ccLogo as StaticImageData}
              alt="codechef-logo"
              height={60}
              width={60}
            />
          </Link>

          <Link
            href="/"
            className="bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text font-jost text-4xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8] md:text-6xl"
          >
            Papers
          </Link>

          {pathname === "/catalogue" ? (
            <div className="relative ml-4 hidden xl:block">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4B22D1] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label="Toggle dropdown"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#4B22D1] text-white shadow-2xl backdrop-blur-sm"
                  align="start"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/pinned" className="flex items-center gap-3">
                      <Pin className="h-4 w-4" />
                      <span className="font-medium">Pinned Subjects</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/request" className="flex items-center gap-3">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="font-medium">Paper Request</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <div className="relative ml-2 hidden lg:block xl:hidden">
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4B22D1] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                      aria-label="Toggle dropdown"
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#4B22D1] text-white shadow-2xl backdrop-blur-sm"
                    align="start"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/pinned" className="flex items-center gap-3">
                        <Pin className="h-4 w-4" />
                        <span className="font-medium">Pinned Subjects</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/request" className="flex items-center gap-3">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="font-medium">Paper Request</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden h-10 items-center xl:flex">
                {renderHomePageButtons()}
              </div>
            </>
          )}
        </div>

        {}
        {pathname === "/catalogue" && (
          <div className="ml-8 mr-12 hidden flex-1 justify-center md:flex">
            <div className="w-full max-w-[700px]">
              <SearchBarChild initialSubjects={courses} />
            </div>
          </div>
        )}

        {}
        <div
          className={`${pathname === "/catalogue" ? "xl:flex" : "lg:flex"} hidden items-center gap-4`}
        >
          <div className="rounded-full border border-[#3A3745] p-1">
            <ModeToggle />
          </div>
          <div className="hidden max-w-[200px] md:block">
            <PWAInstallButton />
          </div>
          <Link href={pathname === "/upload" ? "/" : "/upload"}>
            <div className="flex h-8 items-center gap-1 rounded-full border border-[#3A3745] bg-[#e8e9ff] px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-slate-50 dark:bg-black dark:text-white dark:hover:bg-[#1A1823] sm:h-9 sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-sm md:h-10 md:gap-2 md:px-4 md:py-2 md:text-base">
              <ArrowDownLeftIcon className="h-3.5 w-3.5 rotate-90 sm:h-4 sm:w-4" />
              <span className="truncate">
                {pathname === "/upload" ? "Search Papers" : "Upload Papers"}
              </span>
            </div>
          </Link>
        </div>

        {}
        <div
          className={`${pathname === "/catalogue" ? "xl:hidden" : "lg:hidden"}`}
        >
          <FloatingNavbar onNavigate={() => void 0} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
