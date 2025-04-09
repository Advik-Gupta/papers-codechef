"use client";
import papers from "ongoing-papers";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { type IPaper } from "@/interface";
import Loader from "./ui/loader";

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
    <div className="h-min">
      <p className="play my-8 text-center text-lg font-semibold">
        Most Viewed Papers
      </p>

      <div className="grid grid-cols-2 justify-center gap-6 lg:grid-cols-4">
        {displayPapers.map((paper: IPaper) => (
          <Card
            key={paper._id}
            paper={paper}
            onSelect={() => {
              ("");
            }}
            isSelected={false}
          />
        ))}
      </div>
    </div>
  );
}

export default StoredPapers;
