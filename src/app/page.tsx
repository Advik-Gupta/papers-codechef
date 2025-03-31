import SearchBar from "@/components/searchbar";
import Navbar from "@/components/Navbar";
import StoredPapers from "@/components/StoredPapers";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";

const HomePage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col vipna dark:bg-[#070114] bg-[#F3F5FF]">
      <div>
        <Navbar />
      </div>
      <div className="mt-2 flex flex-grow flex-col items-center justify-center gap-y-10">
        <div className="w-full max-w-2xl space-y-10 text-center">
          <h1 className="vipnabd font-extrabold text-3xl md:text-3xl mx-auto mt-14 mb-6">
            Built by Students for Students
          </h1>
        </div>
        <div className="z-20 w-full max-w-xl mb-6">
          <SearchBar />
        </div>
        <div className="w-full max-w-7xl">
          <StoredPapers />
        </div>
        <div className="w-full max-w-7xl">
          <Hero />
        </div>
        <div className="w-full max-w-7xl mb-10">
          <Faq />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
