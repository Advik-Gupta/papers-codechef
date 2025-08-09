import {
  capsule,
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { StoredSubjects } from "@/interface";

interface PaperCardProps {
  subject: string;
  slots: string[];
}

export default function PaperCard({ subject, slots }: PaperCardProps) {
  const courseName = extractWithoutBracketContent(subject);
  const courseCode = extractBracketContent(subject);
  const [paperCount, setPaperCount] = useState<number | null>(0);
  const [pinned, setPinned] = useState<boolean>(false);

  const handlePinToggle = () => {
    const current = !pinned;
    setPinned(current);

    const saved = JSON.parse(
      localStorage.getItem("userSubjects") ?? "[]",
    ) as string[];
    const updated = current
      ? [...new Set([...saved, subject])]
      : saved.filter((s) => s !== subject);

    localStorage.setItem("userSubjects", JSON.stringify(updated));
    window.dispatchEvent(new Event("userSubjectsChanged"));
  };

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

    const currentPinnedSubjects = JSON.parse(
      localStorage.getItem("userSubjects") ?? "[]",
    ) as StoredSubjects;

    if (subject && Array.isArray(currentPinnedSubjects)) {
      if (currentPinnedSubjects.includes(subject)) {
        setPinned(true);
      } else {
        setPinned(false);
      }
    }

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
        <div className="flex items-start justify-between">
          <h2 className="rounded-t-lg px-2 py-1 font-play text-base font-bold md:text-lg md:tracking-widest">
            {courseCode}
            <div className="text-sm font-normal">
              (Papers available: {paperCount})
            </div>
          </h2>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePinToggle();
            }}
            className="group z-10 mt-1"
          >
            <Pin
              className={`h-6 w-6 transform stroke-white transition-all ${
                pinned ? "fill-[#A78BFA]" : "group-hover:fill-[#A78BFA]"
              } group-hover:scale-110`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between p-4">
        <h2 className="mt-2 font-play text-base font-bold md:text-xl">
          {courseName}
        </h2>

        {paperCount ? (
          <div className="mt-4 flex flex-wrap gap-2 font-play">
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
