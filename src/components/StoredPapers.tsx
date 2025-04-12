"use client";
import papers from "ongoing-papers";
import { useEffect, useState } from "react";
import axios from "axios";
import { type IUpcomingPaper } from "@/interface";
import Loader from "./ui/loader";
import UpcomingPaper from "./UpcomingPaper";

function StoredPapers() {
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const response = await axios.get<IUpcomingPaper[]>(
          "/api/upcoming-papers",
        );
        setDisplayPapers(response.data);
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      }
    }

    void fetchPapers();
  }, []);

  if (displayPapers.length === 0) {
    return <Loader prop="m-10" />;
  }

  return (
    <div className="h-min">
      <p className="play my-8 text-center text-lg font-semibold">
        Upcoming Papers
      </p>

      <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {displayPapers.map((paper: IUpcomingPaper) => (
          <UpcomingPaper
            key={paper.subject}
            subject={paper.subject}
            slots={paper.slots}
          />
        ))}
      </div>
    </div>
  );
}

export default StoredPapers;
