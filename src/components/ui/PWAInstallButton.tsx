"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
      setDeferredPrompt(null);
    }
  };

  if (!canInstall) return null;

  return (
    <>
      
      <div className="md:hidden flex items-center justify-between rounded-full bg-[#2b2343] px-4 py-2 shadow-md text-white w-fit">
        <div className="flex items-center gap-3">
          <Image src="/papers_logo.png" alt="Papers App" width={32} height={32} />
          <span className="font-semibold text-lg">Papers App</span>
        </div>
        <button
          onClick={handleInstall}
          className="ml-6 flex items-center gap-2 rounded-full border border-gray-500 bg-[#1e1e24] px-4 py-1 text-sm font-semibold transition hover:bg-[#2b2b30]"
        >
          <Download className="h-4 w-4" />
          Install
        </button>
      </div>

      
      <div
  onClick={handleInstall}
  className="hidden md:flex items-center gap-3 rounded-full px-5 py-2 text-white cursor-pointer bg-[#130e1f] border border-[#FFFFFF26] border-[1.5px]"
>

        <Image
          src="/papers_logo.png"
          alt="Papers App"
          width={28}
          height={28}
        />
        <span className="font-semibold text-sm">Papers App</span>
      </div>
    </>
  );
};

export default PWAInstallButton;
