"use client";

import { Star, StarOff } from "lucide-react";

export default function PinButton({
  isPinned,
  onToggle,
}: {
  isPinned: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`ml-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
        isPinned ? "bg-purple-700 text-white" : "bg-[#2B2B30] text-white/80"
      } transition hover:bg-purple-600`}
    >
      {isPinned ? (
        <Star className="h-4 w-4" />
      ) : (
        <StarOff className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{isPinned ? "Pinned" : "Pin"}</span>
    </button>
  );
}
