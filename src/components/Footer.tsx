"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  FaFacebook,
  FaGithub,
  FaSquareInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Mail } from "lucide-react";

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
      <div className="mx-auto flex max-w-[1440px] flex-col gap-y-4 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4 md:items-start lg:text-left">
          <h1 className="font-jost mb-5 bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text text-left text-7xl font-bold tracking-wide text-transparent dark:from-[#562EE7] dark:to-[#FFC6E8]">
            Papers
          </h1>

          <div className="-ml-2 flex flex-wrap gap-2 lg:justify-start">
            <Link href="https://www.instagram.com/codechefvit/" target="_blank">
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaSquareInstagram
                  className="text-black dark:text-white"
                  size={18}
                />
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/company/codechefvit/"
              target="_blank"
            >
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaLinkedin className="text-black dark:text-white" size={18} />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/@CodeChefVIT" target="_blank">
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaYoutube className="text-black dark:text-white" size={18} />
              </Button>
            </Link>
            <Link href="https://github.com/CodeChefVIT" target="_blank">
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaGithub className="text-black dark:text-white" size={18} />
              </Button>
            </Link>
            <Link href="https://www.facebook.com/codechefvit/" target="_blank">
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaFacebook className="text-black dark:text-white" size={18} />
              </Button>
            </Link>
            <Link
              href="https://x.com/codechefvit"
              className="pb-1.5"
              target="_blank"
            >
              <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                <FaXTwitter className="text-black dark:text-white" size={18} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-black dark:text-white md:items-start lg:text-left">
          <h3 className="font-jost text-2xl font-semibold">Events</h3>
          <Link href="https://devsoc25.codechefvit.com">DevSoc</Link>
          <Link href="https://gravitas.codechefvit.com">CookOff</Link>
          <Link href="https://gravitas.codechefvit.com">Clueminati</Link>
        </div>
        <div className="flex flex-col gap-2 text-black dark:text-white md:items-start lg:text-left">
          <h3 className="font-jost text-2xl font-semibold">Our Projects</h3>
          <Link href="https://papers.codechefvit.com">Papers</Link>
          <Link href="https://contactify.codechefvit.com">Contactify</Link>
          <Link href="https://ffcs.codechefvit.com">FFCS Combogen</Link>
        </div>
        <div className="flex flex-col gap-2 text-black dark:text-white md:items-start lg:text-left">
          <h3 className="font-jost text-2xl font-semibold">Drop Your Suggestions:</h3>
          <Link
            href={`mailto:codechefvit@gmail.com`}
            className="flex flex-row items-center gap-2"
          >
            <Mail /> codechefvit@gmail.com
          </Link>

          <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
            <h3 htmlFor="email" className="font-jost text-2xl font-semibold">
              Subscribe For Updates:
            </h3>
            <div className="relative w-full">
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-24 text-black focus:outline-none focus:ring-2 focus:ring-[#562EE7] dark:bg-white dark:text-black"
              />
              <Button
                className="absolute right-0 top-0 h-full rounded-l-none rounded-r-md bg-[#562EE7] px-4 text-white hover:bg-[#4531b3]"
              >
                Subscribe!
              </Button>
            </div>
          </div>
        </div>
      </div>
      <p className="font-play mt-4 border-t border-[#130E1F] pt-12 text-center text-lg text-black dark:border-white/10 dark:text-white">
        Made with ❤️ by Codechef-VIT
      </p>
    </footer>
  );
}
