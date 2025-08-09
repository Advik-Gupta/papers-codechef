"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import {
  FaFacebook,
  FaGithub,
  FaSquareInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
export default function Footer() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(true);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (theme) {
      setIsDarkMode(theme === "dark");
    }
  }, [theme]);
  const handleSubscribe = async () => {
    if (!email?.includes("@")) {
      toast.error("Please Enter A Valid Email.");
      return;
    }

    await toast.promise(
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json();
      }),
      {
        loading: "Subscribing...",
        success: "You've Successfully Subscribed!",
        error: "Something went wrong. Try again later.",
      },
    );

    setEmail("");
  };

  return (
    <footer className="w-full overflow-hidden bg-gradient-to-b from-[#F3F5FF] to-[#A599CE] px-6 py-10 text-white dark:from-[#070114] dark:to-[#1F0234]">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-y-10 text-center sm:text-left">
        {/* Branding & Socials */}
        <div className="flex w-full flex-col gap-4 sm:w-[45%] lg:w-[30%]">
          <h1 className="bg-gradient-to-r from-[#562EE7] to-[rgba(116,128,255,0.8)] bg-clip-text font-jost text-5xl font-bold text-transparent dark:to-[#FFC6E8]">
            Papers
          </h1>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {[
              [
                "https://www.instagram.com/codechefvit/",
                <FaSquareInstagram size={18} key="instagram" />,
              ],
              [
                "https://www.linkedin.com/company/codechefvit/",
                <FaLinkedin size={18} key="linkedin" />,
              ],
              [
                "https://www.youtube.com/@CodeChefVIT",
                <FaYoutube size={18} key="youtube" />,
              ],
              [
                "https://github.com/CodeChefVIT",
                <FaGithub size={18} key="github" />,
              ],
              [
                "https://www.facebook.com/codechefvit/",
                <FaFacebook size={18} key="facebook" />,
              ],
              [
                "https://x.com/codechefvit",
                <FaXTwitter size={18} key="twitter" />,
              ],
            ].map(([href, icon], index) => (
              <Link href={href as string} key={index} target="_blank">
                <Button variant="ghost" className="aspect-square h-10 w-10 p-0">
                  <span className="text-black dark:text-white">{icon}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="flex w-full flex-col gap-2 text-black dark:text-white sm:w-[45%] lg:w-[15%]">
          <h3 className="font-jost text-xl font-semibold">Events</h3>
          <Link href="https://devsoc25.codechefvit.com">DevSoc</Link>
          <Link href="https://gravitas.codechefvit.com">CookOff</Link>
          <Link href="https://gravitas.codechefvit.com">Clueminati</Link>
        </div>

        {/* Projects */}
        <div className="flex w-full flex-col gap-2 text-black dark:text-white sm:w-[45%] lg:w-[20%]">
          <h3 className="font-jost text-xl font-semibold">Our Projects</h3>
          <Link href="https://papers.codechefvit.com">Papers</Link>
          <Link href="https://contactify.codechefvit.com">Contactify</Link>
          <Link href="https://ffcs.codechefvit.com">FFCS-inator</Link>
        </div>

        {/* Suggestions */}
        <div className="flex w-full flex-col gap-2 text-black dark:text-white sm:w-[45%] lg:w-[25%]">
          <h3 className="font-jost text-xl font-semibold">
            Drop Your Suggestions:
          </h3>
          <Link
            href={`mailto:codechefvit@gmail.com`}
            className="mx-auto flex items-center center gap-2 sm:mx-0"
          >
            <Mail size={18} />
            <span>codechefvit@gmail.com</span>
          </Link>

          <div className="mt-4 flex w-full max-w-xs flex-col gap-2">
            <h3 className="font-jost text-2xl font-semibold">
              Subscribe For Updates:
            </h3>
            <div className="relative w-full">
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                className="pr-24"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleSubscribe}
                className="absolute right-0 top-0 h-full rounded-l-none rounded-r-md bg-[#562EE7] px-4 text-white hover:bg-[#4531b3]"
              >
                Subscribe!
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-[#130E1F] pt-12 text-center font-play text-lg text-black dark:border-white/10 dark:text-white">
        Made with ❤️ by Codechef-VIT
      </p>
    </footer>
  );
}
