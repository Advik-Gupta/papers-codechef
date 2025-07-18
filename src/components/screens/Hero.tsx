import React from "react";
import SearchBar from "../Searchbar/searchbar";
import PapersCarousel from "../PapersCarousel";

const Hero = () => {
  return (
    <div id="hero" className="flex flex-col justify-between">
      <h1 className="mx-auto my-8 text-center font-vipnabd text-3xl font-extrabold">
        Built by Students for Students
      </h1>
      <div className="px-6">
        <SearchBar />
      </div>
      <PapersCarousel carouselType="default" />
      {/* <div className="hidden lg:flex flex-col items-center whitespace-nowrap text-center">
        <h1 className="font-play text-md">Learn More</h1>
        <Link
          href="#hero"
          className="font-play text-md flex items-center justify-center text-black dark:text-white"
        >
          ▼
        </Link>
      </div> */}
    </div>
  );
};

export default Hero;
