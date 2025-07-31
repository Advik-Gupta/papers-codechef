import React from "react";
import SearchBar from "@/components/Searchbar/searchbar";
import PinnedPapersCarousel from "@/components/PinnedPapersCarousel";

const Pinned = () => {
  return (
    <div id="pinned" className="mt-5 flex flex-col justify-between">
      <h1 className="mx-auto my-8 hidden text-center font-vipnabd text-3xl font-extrabold md:block">
        Pinned Papers
      </h1>

      <div className="mb-3 flex w-full flex-col items-center gap-2 px-6">
        <div className="w-full">
          <SearchBar type="pinned" />
        </div>
      </div>
      <PinnedPapersCarousel carouselType="users" />
      <div className="mt-6 flex w-full items-center justify-center">
        <p>You can pin upto 8 Subjects</p>
      </div>
    </div>
  );
};

export default Pinned;
