
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
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  if (!showInstall) return null;

  return (
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
  );
};

export default PWAInstallButton;
