"use client";
import { Separator } from "./ui/separator";
import ccLogo from "../assets/codechef_logo.svg";
import Image from "next/image";
import { Instagram, Linkedin, Youtube, Github } from "lucide-react";
import meta_icon from "../assets/meta_icon.svg";
import x_twitter_icon from "../assets/x_twitter_icon.svg";
import meta_icon_dark from "../assets/meta_icon_dark.svg";
import x_twitter_icon_dark from "../assets/x_twitter_icon_dark.svg";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Footer() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(true);

  useEffect(() => {
    if (theme) {
      setIsDarkMode(theme === "dark");
    }
  }, [theme]);

  return (
    <footer className="w-full overflow-hidden font-sans bg-gradient-to-b dark:from-[#070114] dark:to-[#1F0234] from-[#F3F5FF] to-[#A599CE] px-6 py-12 text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-y-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
          <h1 className="jost tracking-wide bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text font-bold text-xl text-transparent mb-5 dark:from-[#562EE7] dark:to-[#FFC6E8] text-left md:text-7xl">
            Papers
          </h1>
          <p className="text-md text-black dark:text-white">Made with ❤️ by Codechef-VIT</p>
          <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
            <Link href="https://www.instagram.com/codechefvit/">
              <Button variant="ghost" size="icon">
                <Instagram className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/company/codechefvit/">
              <Button variant="ghost" size="icon">
                <Linkedin className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/@CodeChefVIT">
              <Button variant="ghost" size="icon">
                <Youtube className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://github.com/CodeChefVIT">
              <Button variant="ghost" size="icon">
                <Github className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://www.facebook.com/codechefvit/">
              <Button variant="ghost" size="icon">
                <Image
                  src={
                    isDarkMode
                      ? (meta_icon_dark as HTMLInputElement)
                      : (meta_icon as HTMLInputElement)
                  }
                  alt="meta-icon"
                  height={24}
                  width={24}
                />
              </Button>
            </Link>
            <Link href="https://x.com/codechefvit" className="pb-1.5">
              <Button variant="ghost" size="icon">
                <Image
                  src={
                    isDarkMode
                      ? (x_twitter_icon_dark as HTMLInputElement)
                      : (x_twitter_icon as HTMLInputElement)
                  }
                  alt="x_twitter_icon"
                  height={24}
                  width={24}
                />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center dark:text-white text-black lg:items-start text-center lg:text-left gap-2">
          <h3 className="text-xl font-semibold">Menu</h3>
          <Link href="/search">Search</Link>
          <Link href="/features">Features</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="flex flex-col items-center dark:text-white text-black lg:items-start text-center lg:text-left gap-2">
          <h3 className="text-xl font-semibold">Our Projects</h3>
          <Link href="/">Papers</Link>
          <Link href="/">FFCS-inator</Link>
          <Link href="/">Brainrot Arcade</Link>
        </div>
        <div className="flex flex-col items-center dark:text-white text-black lg:items-start text-center lg:text-left gap-2">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p>contact@codechefvit.com</p>
        </div>
      </div>
    </footer>
  );
}
