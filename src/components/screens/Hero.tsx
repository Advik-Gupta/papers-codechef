import React from "react";
import SearchBar from "../Searchbar/searchbar";
import PapersCarousel from "../PapersCarousel";
import PinnedPapersCarousel from "../PinnedPapersCarousel";

const Hero = () => {
  return (
    <div id="hero" className="flex flex-col justify-between">
      <h1 className="mx-auto my-8 hidden text-center font-vipnabd text-3xl font-extrabold md:block">
        Built by Students for Students
      </h1>
      <div className="mt-5 px-6">
        <SearchBar />
      </div>
      <p className="my-8 hidden text-center font-play text-lg font-semibold md:block">
        Pinned Subjects
      </p>
      <PinnedPapersCarousel carouselType="users"/>
      <PapersCarousel />
    </div>
  );
};

export default Hero;
