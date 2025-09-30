"use client";

import { Pin } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { type IUpcomingPaper } from "@/interface";
import Loader from "./ui/loader";
import UpcomingPaper from "./UpcomingPaper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "./ui/skeleton";
import AddPapers from "./AddPapers";
import Autoplay from "embla-carousel-autoplay";
import { chunkArray } from "@/util/utils";
import { StoredSubjects } from "@/interface";
import SkeletonPaperCard from "./SkeletonPaperCard";
import PinnedModal from "./ui/PinnedModal";
type PinnedPapersCarouselProps = {
  carouselType: "users" | "upcoming",
}

function PinnedPapersCarousel({
  carouselType = "upcoming",
} : PinnedPapersCarouselProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [chunkSize, setChunkSize] = useState<number>(4);
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth <= 540){
        setChunkSize(2);
      }
      else if (window.innerWidth <= 920) {
        setChunkSize(4);
      } else {
        setChunkSize(8);
      }
    };

    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkedPapers = chunkArray(displayPapers, chunkSize);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);

      const storedSubjects = JSON.parse(
        localStorage.getItem("userSubjects") ?? "[]",
      ) as StoredSubjects;

      const response = await axios.post<{ subject: string; slots: string[] }[]>(
        "/api/user-papers",
        storedSubjects,
      );

      const fetchedPapers = response.data;

      const fetchedSubjectsSet = new Set(
        fetchedPapers.map((paper) => paper.subject),
      );

      const storedSubjectsArray = Array.isArray(storedSubjects)
        ? storedSubjects
        : [];
      const missingSubjects = storedSubjectsArray
        .filter((subject: string) => !fetchedSubjectsSet.has(subject))
        .map((subject: string) => ({
          subject,
          slots: [],
        })) as { subject: string; slots: string[] }[];

      const allDisplayPapers = [...fetchedPapers, ...missingSubjects];

      setDisplayPapers(allDisplayPapers);
    } catch (error) {
      console.error("Failed to fetch papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPapers();
  }, []);

  useEffect(() => {
    const handleSubjectsChange = async() => {
      try {
        const storedSubjects = JSON.parse(
          localStorage.getItem("userSubjects") ?? "[]",
        ) as StoredSubjects;

        const response = await axios.post<{ subject: string; slots: string[] }[]>(
          "/api/user-papers",
          storedSubjects,
        );

        const fetchedPapers = response.data;

        const fetchedSubjectsSet = new Set(
          fetchedPapers.map((paper) => paper.subject),
        );

        const storedSubjectsArray = Array.isArray(storedSubjects)
          ? storedSubjects
          : [];
        const missingSubjects = storedSubjectsArray
          .filter((subject: string) => !fetchedSubjectsSet.has(subject))
          .map((subject: string) => ({
            subject,
            slots: [],
          })) as { subject: string; slots: string[] }[];

        const allDisplayPapers = [...fetchedPapers, ...missingSubjects];

        setDisplayPapers(allDisplayPapers);
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      }
    };

    window.addEventListener("userSubjectsChanged", handleSubjectsChange);

    return () => {
      window.removeEventListener("userSubjectsChanged", handleSubjectsChange);
    };
  }, []);

  const plugins = [Autoplay({ delay: 8000, stopOnInteraction: true })];

  return (
    <div className="px-4 mt-4">
      <div className="">
        {displayPapers.length > 0 ?
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={plugins}
          className="w-full"
        >
          {displayPapers.length > 8 &&
          <div
            className={`relative mt-4 flex justify-end gap-4`}
          >
            <CarouselPrevious className="relative" />
            <CarouselNext className="relative" />
          </div>}
          <CarouselContent>
            {isLoading ? (
              <CarouselItem
                className={`grid ${
                  chunkSize === 2 ? "grid-cols-1 grid-rows-2" : chunkSize === 4 ? "grid-cols-2 grid-rows-2" : "grid-cols-4"
                } gap-4 lg:auto-rows-fr`}
              >
                <SkeletonPaperCard length={chunkSize} />
              </CarouselItem>
            ) : (
              chunkedPapers.map((paperGroup, index) => {
                const isLastChunk = index === chunkedPapers.length - 1;

                return (
                  <CarouselItem
                    key={`carousel-item-${index}`}
                    className={`grid ${
                      chunkSize === 2 ? "grid-cols-1 grid-rows-2" : chunkSize === 4 ? "grid-cols-2 grid-rows-2" : "grid-cols-4"
                    } gap-4 lg:auto-rows-fr`}
                  >
                    {paperGroup.map((paper, subIndex) => (
                      <div key={subIndex} className="h-full">
                        <UpcomingPaper
                          subject={paper.subject}
                          slots={paper.slots}
                        />
                      </div>
                    ))}

                    {isLastChunk && displayPapers.length < 8 && (
                      <div
                        className="h-full"
                        onClick={() => {
                          window.dispatchEvent(new Event("addButtonClicked"));
                        }}
                      >
                      </div>
                    )}
                  </CarouselItem>
                );
              })
            )}
          </CarouselContent>
        </Carousel> : 
        <div className={`relative flex flex-col justify-center gap-4 items-center h-max text-center my-48 font-bold`}
        >
          Start pinning subjects for quick and easy access.
          <div className="flex h-8 items-center gap-1 rounded-full border border-[#3A3745] bg-[#e8e9ff] px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:bg-slate-50 dark:bg-black dark:text-white dark:hover:bg-[#1A1823] sm:h-9 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm md:h-10 md:px-4 md:py-2 md:text-base">
            <Pin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">
              <PinnedModal/>
            </span>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default PinnedPapersCarousel;
