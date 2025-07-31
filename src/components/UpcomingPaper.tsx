import {
  capsule,
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PaperCardProps {
  subject: string;
  slots: string[];
}

export default function PaperCard({ subject, slots }: PaperCardProps) {
  const courseName = extractWithoutBracketContent(subject);
  const courseCode = extractBracketContent(subject);
  const [paperCount, setPaperCount] = useState<number | null>(0);

  useEffect(() => {
    const fetchPaperCount = async () => {
      try {
        const response = await axios.get<{ count: number }>(
          "/api/papers/count",
          {
            params: { subject },
          },
        );
        setPaperCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch paper count:", error);
      }
    };

    void fetchPaperCount();
  }, [subject]);

  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        if (!paperCount) return; // disable click if no papers
        e.preventDefault();
        const queryParams = new URLSearchParams({ subject });
        router.push(`/catalogue?${queryParams.toString()}`);
      }}
      className={`h-full rounded-sm border-2 border-[#734DFF] bg-[#FFFFFF] text-black shadow-lg transition duration-150 ease-in-out dark:border-[#36266D] dark:bg-[#171720] dark:text-white ${
        !paperCount
          ? "cursor-not-allowed opacity-60 hover:bg-[#FFFFFF] dark:hover:bg-[#171720]"
          : "cursor-pointer hover:bg-[#EFEAFF] hover:dark:bg-[#262635]"
      }`}
    >
      <div className="border-b-2 border-[#453D60] p-2">
        <h2 className="inline-block rounded-t-lg px-2 py-1 font-play text-base font-bold md:text-lg md:tracking-widest">
          {courseCode}
          <div className="text-sm">(Papers available: {paperCount})</div>
        </h2>
      </div>

      <div className="flex flex-col justify-between p-4">
        <h2 className="mt-2 font-play text-base font-bold md:text-xl">
          {courseName}
        </h2>

        {paperCount ? (
          <div className="mt-4 flex gap-2 font-play">
            {slots?.map((slotValue) => capsule(slotValue))}
          </div>
        ) : (
          <div className="mt-6 text-sm italic text-gray-500 dark:text-gray-400">
            We will have papers for this soon!
          </div>
        )}
      </div>
    </div>
  );
}
