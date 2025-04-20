import React from "react";
import SearchBar from "../Searchbar/searchbar";
import StoredPapers from "../StoredPapers";

const Hero = () => {
  return (
    <div id="hero" className="flex flex-col justify-between">
      <h1 className="vipnabd mx-auto my-8 text-center text-3xl font-extrabold">
        Built by Students for Students
      </h1>
      <div className="px-6">
        <SearchBar />
      </div>
      <StoredPapers />
      {/* <div className="hidden lg:flex flex-col items-center whitespace-nowrap text-center">
        <h1 className="play text-md">Learn More</h1>
        <Link
          href="#hero"
          className="play text-md flex items-center justify-center text-black dark:text-white"
        >
          ▼
        </Link>
      </div> */}
    </div>
  );
};

export default Hero;
