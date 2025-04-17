"use client";
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
    <footer className="w-full overflow-hidden bg-gradient-to-b from-[#F3F5FF] to-[#A599CE] px-12 py-12 font-sans text-white dark:from-[#070114] dark:to-[#1F0234]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-y-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4 lg:items-start lg:text-left">
          <h1 className="jost mb-5 bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text text-left text-7xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8]">
            Papers
          </h1>
          <p className="play text-lg text-black dark:text-white">
            Made with ❤️ by Codechef-VIT
          </p>
          <div className="-ml-2 flex flex-wrap gap-4 lg:justify-start">
            <Link href="https://www.instagram.com/codechefvit/" target="_blank">
              <Button variant="ghost" size="icon">
                <Instagram className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/company/codechefvit/"
              target="_blank"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/@CodeChefVIT" target="_blank">
              <Button variant="ghost" size="icon">
                <Youtube className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://github.com/CodeChefVIT" target="_blank">
              <Button variant="ghost" size="icon">
                <Github className="text-black dark:text-white" />
              </Button>
            </Link>
            <Link href="https://www.facebook.com/codechefvit/" target="_blank">
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
            <Link
              href="https://x.com/codechefvit"
              className="pb-1.5"
              target="_blank"
            >
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
        {/* <div className="flex flex-col items-center gap-2 text-center text-black dark:text-white lg:items-start lg:text-left">
          <h3 className="jost text-2xl font-semibold">Menu</h3>
          <Link href="/#search">Search</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#faq">FAQ</Link>
        </div> */}
        {/* <div className="flex flex-col items-center gap-2 text-center text-black dark:text-white lg:items-start lg:text-left">
          <h3 className="jost text-2xl font-semibold">Our Projects</h3>
          <Link href="/">Papers</Link>
          <Link href="/">FFCS-inator</Link>
          <Link href="/">Brainrot Arcade</Link>
        </div> */}
        <div className="flex flex-col gap-2 text-black dark:text-white lg:items-start lg:text-left">
          <h3 className="jost text-2xl font-semibold">Contact Us</h3>
          <Link href={`mailto:codechefvit@gmail.com`}>
            codechefvit@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
