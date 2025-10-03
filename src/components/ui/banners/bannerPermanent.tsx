"use client";

import { Info } from "lucide-react";

interface BannerProps {
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  title: string;
  message: string;
}

export default function Banner({
  bgColor = "#AA7AE7",
  textColor = "#ffffff",
  iconColor = "#ffffff",
  title,
  message,
}: BannerProps) {
  return (
    <div
      className="z-50 w-full px-6 py-3 shadow-sm md:sticky md:top-0"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5" style={{ color: iconColor }} />
          <span className="font-semibold tracking-wide text-base sm:text-lg">
            {title}
          </span>
        </div>

        <p className="text-center text-sm sm:text-base sm:text-right font-medium" style={{ color: textColor + "e6" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
