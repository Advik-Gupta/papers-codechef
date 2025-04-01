"use client";
import papers from "ongoing-papers";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { type IPaper } from "@/interface";
import Loader from "./ui/loader";
import Link from "next/link";

function StoredPapers() {
  const [displayPapers, setDisplayPapers] = useState<IPaper[]>([]);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const response = await axios.get("/api/selected-papers");
        setDisplayPapers(response.data as IPaper[]);
      } catch (error) {
        setDisplayPapers(papers);
        console.error("Failed to fetch papers:", error);
      }
    }

    void fetchPapers();
  }, []);

  if (displayPapers.length === 0) {
    return <Loader prop="m-10" />;
  }

  return (
    <>
      <p className="mt-2 mb-4 text-center play text-lg font-semibold">Most Viewed Papers</p>
      <div className="flex flex-wrap justify-center gap-6">
        {displayPapers.map((paper: IPaper) => (
          <Card
            key={paper._id}
            paper={paper}
            onSelect={() => { "" }}
            isSelected={false}
          />
        ))}
      </div>
      <h1 className="play text-md text-center mt-4">Learn More</h1>
      <Link href="#hero" className="play flex items-center justify-center text-center text-md dark:text-white text-black">▼</Link>
    </>
  );
}

export default StoredPapers;
