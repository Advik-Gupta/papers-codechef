"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Pin,
  UploadIcon,
} from "lucide-react";
import ModeToggle from "./toggle-theme";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  onNavigate: () => void;
}

export default function FloatingNavbar({ onNavigate }: Props) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-end h-full space-y-4 pointer-events-none">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4B22D1] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="xl:hidden mt-2 w-72 space-y-1 rounded-3xl border border-white/10 bg-[#110F18] px-4 py-4 text-white shadow-xl backdrop-blur-sm pointer-events-auto"
          align="end"
        >
          <DropdownMenuItem asChild>
            <Link
              href={pathname === "/upload" ? "/" : "/upload"}
              onClick={() => onNavigate()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-[#1A1823] transition"
            >
              <UploadIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pathname === "/upload" ? "Search Papers" : "Upload Papers"}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/pinned"
              onClick={() => onNavigate()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-[#1A1823] transition"
            >
              <Pin className="h-4 w-4" />
              <span className="text-sm font-medium">Pinned Subjects</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/request"
              onClick={() => onNavigate()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-[#1A1823] transition"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm font-medium">Paper Request</span>
            </Link>
          </DropdownMenuItem>

          <div className="pt-2 border-t border-[#3A3745] mt-2">
            <div className="flex justify-center pt-2">
              <div className="rounded-full border border-[#3A3745] p-1">
                <ModeToggle />
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
