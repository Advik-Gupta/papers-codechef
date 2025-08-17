"use client";

import React from "react";
import SearchBar from "@/components/Searchbar/searchbar";
import PinnedPapersCarousel from "@/components/PinnedPapersCarousel";
import { type IUpcomingPaper } from "@/interface";
import { useState } from "react";

const Pinned = () => {
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);
  return (
    <div id="pinned" className="mt-5 flex flex-col justify-between">
      <h1 className="mx-auto my-8 hidden text-center font-vipnabd text-3xl font-extrabold md:block">
        Pinned Subjects
      </h1>
      <div className="mb-3 flex w-full flex-col items-center gap-2 px-6">
        <div className="w-full">
          <SearchBar type="pinned" displayPapers = {displayPapers} />
        </div>
      </div>
      <div className="min-h-[40vh]">
        <PinnedPapersCarousel carouselType="users" displayPapers = {displayPapers} setDisplayPapers = {setDisplayPapers} />
      </div>
      <div className="mt-6 flex w-full items-center justify-center">
        <p>You can pin upto 8 Subjects here</p>
      </div>
    </div>
  );
};

export default Pinned;
