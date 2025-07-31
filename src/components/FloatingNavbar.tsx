"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { StarIcon, UploadIcon } from "lucide-react";
import ModeToggle from "./toggle-theme";

interface Props {
  onNavigate: () => void;
}

export default function FloatingNavbar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <div className="fixed right-6 top-12 z-50 flex flex-col items-end">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-[#110F18] px-6 py-6 shadow-xl ring-1 ring-white/5">
        <Link
          href={pathname === "/upload" ? "/" : "/upload"}
          onClick={onNavigate}
        >
          <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
            <UploadIcon className="h-4 w-4" />
            <span>
              {pathname === "/upload" ? "Search Papers" : "Upload Papers"}
            </span>
          </div>
        </Link>

        <Link href="/pinned" onClick={onNavigate}>
          <div className="flex items-center gap-2 rounded-full border border-[#3A3745] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1A1823]">
            <StarIcon className="h-4 w-4" />
            <span>Pinned Subjects</span>
          </div>
        </Link>

        <div className="rounded-full border border-[#3A3745] p-1">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
