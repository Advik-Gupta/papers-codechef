import Navbar from "@/components/Navbar";
import StoredPapers from "@/components/StoredPapers";
import Footer from "@/components/Footer";
import SearchBar from "@/components/Searchbar/searchbar";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div>
        <Navbar />
      </div>
      <div className="mt-2 flex flex-grow flex-col items-center justify-center gap-y-10">
        <div className="w-full max-w-2xl space-y-10 text-center">
          <h1 className="phonk mx-auto text-2xl md:text-3xl">
            Built by Students for Students
          </h1>

          <p className="text-md mx-auto w-[90%] font-sans font-semibold md:w-full">
            Prepare to excel in your CATs and FATs with CodeChef-VIT&apos;s
            dedicated repository of past exam papers. Access key resources to
            review concepts, tackle challenging questions, and familiarize
            yourself with exam patterns. Boost your confidence, sharpen your
            strategy, and get ready to ace your exams!
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
            {[
              "NO SIGN UP REQUIRED",
              "FILTERED SEARCH",
              "FLEXIBLE DOWNLOAD",
            ].map((text) => (
              <div
                key={text}
                className="rounded-full bg-gradient-to-r from-[#562EE7] to-[#bd21b4] p-[2px]"
              >
                <div className="rounded-full bg-white px-6 py-3 font-sans tracking-wider text-black dark:bg-black dark:text-white">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="z-20 w-full max-w-xl">
          <SearchBar />
        </div>

        <div className="max-3xl w-full">
          <StoredPapers />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
