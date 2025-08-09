"use client";

import { Pin, PinOff } from "lucide-react";

export default function PinButton({
  isPinned,
  onToggle,
  disabled,
}: {
  isPinned: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`ml-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
        isPinned ? "bg-purple-700 text-white" : "bg-[#2B2B30] text-white/80"
      } transition hover:bg-purple-600`}
      disabled={disabled}
    >
      {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
      <span className="hidden sm:inline">{isPinned ? "Pinned" : "Pin"}</span>
    </button>
  );
}
