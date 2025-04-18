// src/components/PaperCard.tsx
import {
  capsule,
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface PaperCardProps {
  subject: string;
  slots: string[]; // Single slot value, split into buttons if needed
}

export default function PaperCard({ subject, slots }: PaperCardProps) {
  // Extract course code and name from subject

  const courseName = extractWithoutBracketContent(subject); // Join the rest as course name
  const courseCode = extractBracketContent(subject); // Assuming the first part is the course code
  // Split slot into multiple values if provided as a comma-separated string (e.g., "C1,CAT-1")
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
          subject,
        });

        router.push(`/catalogue?${queryParams.toString()}`);
      }}
      className="h-full cursor-pointer rounded-sm border-2 border-[#734DFF] bg-[#FFFFFF] text-black shadow-lg transition duration-150 ease-in-out hover:bg-[#EFEAFF] dark:border-[#36266D] dark:bg-[#171720] dark:text-white hover:dark:bg-[#262635]"
    >
      {/* Course Code */}
      <div className="border-b-2 border-[#453D60] p-2">
        <h3 className="vipnabd inline-block rounded-t-lg px-2 py-1 text-base md:text-lg md:tracking-widest">
          {courseCode} {/* Replace with dynamic code if needed */}
        </h3>
      </div>

      {/* Subject Name */}
      <div className="flex flex-col justify-between p-4">
        <h2 className="mt-2 text-base font-bold md:text-xl">{courseName}</h2>
        {/* Slot Buttons */}
        <div className="mt-4 flex gap-2">
          {slots?.map((slotValue, index) => capsule(slotValue))}
        </div>
        {/* See Papers Link */}
      </div>
    </div>
  );
}
