"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ccLogo from "../assets/codechef_logo.svg";
import ModeToggle from "@/components/toggle-theme";
import { ArrowDownLeftIcon, Pin, ArrowUpRight, ChevronDown } from "lucide-react";
import FloatingNavbar from "./FloatingNavbar";
import PWAInstallButton from "./ui/PWAInstallButton";
import SearchBarChild from "./Searchbar/searchbar-child";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const pathname = usePathname();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function getSubjects() {
      const res = await fetch("/api/course-list");
      const data = await res.json();
      setSubjects(data.map((course: { name: string }) => course.name));
    }
    if (pathname === "/catalogue") getSubjects();
  }, [pathname]);

  const renderHomePageButtons = () => (
    <>
      <Link href="/pinned">
        <div className="ml-2 flex items-center gap-2 rounded-full border bg-[#e8e9ff] dark:bg-black border-[#3A3745] px-4 py-2 text-sm font-semibold dark:text-white transition hover:bg-slate-50 text-gray-700 dark:hover:bg-[#1A1823] h-10">
          <Pin className="h-4 w-4" />
          Pinned Subjects
        </div>
      </Link>
      <Link href="/request">
        <div className="ml-2 flex items-center gap-2 rounded-full border bg-[#e8e9ff] dark:bg-black border-[#3A3745] px-4 py-2 text-sm font-semibold dark:text-white transition hover:bg-slate-50 text-gray-700 dark:hover:bg-[#1A1823] h-10">
          <ArrowUpRight className="h-4 w-4" />
          Paper Request
        </div>
      </Link>
    </>
  );

  return (
    <div className="sticky top-0 z-10 w-full bg-[#B2B8FF] px-4 py-4 dark:bg-[#130E1F] md:px-8 md:py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <Link href="https://www.codechefvit.com/" target="_blank">
            <Image
              src={ccLogo as HTMLImageElement}
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
            <div className="ml-4 hidden md:block relative">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4B22D1] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label="Toggle dropdown"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-2xl bg-[#4B22D1] text-white border border-[rgba(255,255,255,0.1)] shadow-2xl backdrop-blur-sm"
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
            <div className="hidden md:flex items-center h-10">
              {renderHomePageButtons()}
            </div>
          )}
        </div>

        {pathname === "/catalogue" && (
          <div className="hidden md:flex flex-1 justify-center mx-4">
            <div className="w-full max-w-[700px]">
              <SearchBarChild initialSubjects={subjects} />
            </div>
          </div>
        )}

        <div className="hidden items-center gap-4 md:flex">
          <div className="rounded-full border border-[#3A3745] p-1">
            <ModeToggle />
          </div>
          <div className="hidden max-w-[200px] md:block">
            <PWAInstallButton />
          </div>
          <Link href={pathname === "/upload" ? "/" : "/upload"}>
            <div className="flex items-center gap-2 rounded-full border bg-[#e8e9ff] dark:bg-black border-[#3A3745] px-4 py-2 text-sm font-semibold dark:text-white transition hover:bg-slate-50 text-gray-700 dark:hover:bg-[#1A1823] h-10">
              <ArrowDownLeftIcon className="h-4 w-4 rotate-90" />
              <span>
                {pathname === "/upload" ? "Search Papers" : "Upload Papers"}
              </span>
            </div>
          </Link>
        </div>

        <div className="md:hidden">
          <FloatingNavbar onNavigate={() => { }} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
