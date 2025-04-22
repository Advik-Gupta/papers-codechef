import {
  capsule,
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface PaperCardProps {
  subject: string;
  slots: string[];
}

export default function PaperCard({ subject, slots }: PaperCardProps) {
  const courseName = extractWithoutBracketContent(subject);
  const courseCode = extractBracketContent(subject);

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
      <div className="border-b-2 border-[#453D60] p-2">
        <h3 className="font-play inline-block rounded-t-lg px-2 py-1 text-base font-bold md:text-lg md:tracking-widest">
          {courseCode}
        </h3>
      </div>

      <div className="flex flex-col justify-between p-4">
        <h2 className="font-play mt-2 text-base font-bold md:text-xl">
          {courseName}
        </h2>
        <div className="font-play mt-4 flex gap-2">
          {slots?.map((slotValue) => capsule(slotValue))}
        </div>
      </div>
    </div>
  );
}
