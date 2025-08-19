"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface EventBannerProps {
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
  mobileText?: string;
  desktopText?: string;
  buttonText?: string;
  link: string;
  icon: string;
}

export default function EventBanner({
  bgColor = "#ba4343",
  textColor = "#ffffff",
  buttonColor = "#AA7AE7",
  mobileText = "Join the biggest hackathon of the year!",
  desktopText = "DevSOC'25 registrations are now LIVE! Don't miss out 🚀",
  buttonText = "Register Now",
  link,
  icon,
}: EventBannerProps) {
  return (
    <div
      className="z-50 flex h-fit w-full items-center justify-center px-6 py-3 text-center sm:h-14 sm:py-0 md:sticky md:top-0 md:justify-between md:text-left"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex items-center gap-x-2">
        <Image
          src={icon}
          alt="event logo"
          height={40}
          width={40}
          className="md:hidden"
        />
        <span className="hidden text-sm font-medium md:block">
          {desktopText}
        </span>
        <Link
          href={link}
          className="block text-sm font-medium md:hidden underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {mobileText}
        </Link>
      </div>
      <div className="hidden md:block">
        <Button style={{ backgroundColor: buttonColor }}>
          <Link
            className="flex items-center gap-x-2"
            href={link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src={icon} alt="icon" height={20} width={20} />
            <span className="font-yerk text-xs">{buttonText}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
