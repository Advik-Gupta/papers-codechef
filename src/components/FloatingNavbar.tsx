"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Pin, UploadIcon, ChevronDown } from "lucide-react";
import ModeToggle from "./toggle-theme";

interface Props {
  onNavigate: () => void;
}

export default function FloatingNavbar({ onNavigate }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 top-0 z-50 flex flex-col items-end h-full pointer-events-none">
      {}
      <button
        className="mt-[1.25rem] flex h-10 w-10 items-center justify-center rounded-full bg-[#4B22D1] text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 pointer-events-auto"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {}
      {isOpen && (
        <div className="mt-2 flex flex-col items-center gap-4 rounded-3xl bg-[#110F18] px-6 py-6 shadow-xl ring-1 ring-white/5 pointer-events-auto">
          <Link
            href={pathname === "/upload" ? "/" : "/upload"}
            onClick={() => {
              setIsOpen(false);
              onNavigate();
            }}
          >
            <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
              <UploadIcon className="h-4 w-4" />
              <span>{pathname === "/upload" ? "Search Papers" : "Upload Papers"}</span>
            </div>
          </Link>

          <Link href="/pinned" onClick={() => { setIsOpen(false); onNavigate(); }}>
            <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
              <Pin className="h-4 w-4" />
              <span>Pinned Subjects</span>
            </div>
          </Link>

          <Link href="/request" onClick={() => { setIsOpen(false); onNavigate(); }}>
            <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823] w-full justify-center">
              <ArrowUpRight className="h-4 w-4" />
              <span>Paper Request</span>
            </div>
          </Link>

          <div className="rounded-full border border-[#3A3745] p-1">
            <ModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
