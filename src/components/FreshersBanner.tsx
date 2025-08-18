"use client";

import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Banner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const bannerStatus = localStorage.getItem("banner");
    if (bannerStatus === "freshers") {
      setVisible(false);
    }
  }, []);

  const closeBanner = () => {
    localStorage.setItem("banner", "freshers");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="z-[60] w-full bg-[#fef3c7] text-[#5a3000] shadow-sm">
      <div className="relative mx-auto flex max-w-screen-2xl flex-col items-start justify-between gap-3 px-4 py-3 sm:justify-center sm:flex-row sm:items-center sm:gap-4 md:px-8 md:py-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-[#d97706]" />
          <span className="font-semibold text-base tracking-wide text-[#78350f]">
            Attention Freshers!
          </span>
        </div>

        <p className="text-sm text-[#5a3000] sm:text-right flex-1">
          If papers for your subject are not yet available, click on your subject and explore related subjects until papers become available, as these are newly introduced courses.
        </p>

        <button
          onClick={closeBanner}
          className="absolute right-4 top-4 text-[#78350f] hover:text-[#a84b0f] transition sm:static sm:self-start"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
