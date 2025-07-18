"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { type IUpcomingPaper } from "@/interface";
import UpcomingPaper from "./UpcomingPaper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { chunkArray } from "@/util/utils";
import { Skeleton } from "@/components/ui/skeleton";

function PapersCarousel({
  carouselType,
}: {
  carouselType: "users" | "default";
}) {
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chunkSize, setChunkSize] = useState<number>(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChunkSize(4);
      } else {
        setChunkSize(8);
      }
    };

    localStorage.setItem(
      "userSubjects",
      JSON.stringify([
        "Information Security [CBS3002]",
        "Foundations of Data Analytics [BCSE351E]",
        "Design and Analysis of Algorithms [MCSE502L]",
        "Complex Variables and Linear Algebra [BMAT201L]",
        "Differential Equations and Transforms [BMAT102L]",
      ])
    );

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkedPapers = chunkArray(displayPapers, chunkSize);

  useEffect(() => {
    async function fetchPapers() {
      try {
        setIsLoading(true);
        if (carouselType === "users") {
          const storedSubjects = JSON.parse(
            localStorage.getItem("userSubjects") ?? "[]"
          ) as string[];
          const response = await axios.post<IUpcomingPaper[]>(
            "/api/user-papers",
            storedSubjects
          );
          setDisplayPapers(response.data);
        } else {
          const response = await axios.get<IUpcomingPaper[]>(
            "/api/upcoming-papers"
          );
          setDisplayPapers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchPapers();
  }, []);

  if (isLoading) {
    return (
      <div className="px-4">
        <p className="my-8 text-center font-play text-lg font-semibold">
          {carouselType === "users" ? "Your Papers" : "Upcoming Papers"}
        </p>

        <div
          className={`${
            carouselType === "users"
              ? "grid grid-cols-4"
              : "grid grid-cols-2 grid-rows-2 md:grid-cols-4"
          } gap-4 lg:auto-rows-fr`}
        >
          {Array.from({ length: chunkSize }).map((_, index) => (
            <div
              key={index}
              className="h-full rounded-sm border-2 border-[#734DFF] bg-[#FFFFFF] shadow-lg dark:border-[#36266D] dark:bg-[#171720]"
            >
              <div className="border-b-2 border-[#453D60] p-2">
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
              <div className="flex flex-col justify-between p-4">
                <Skeleton className="mb-4 h-8 w-40 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const plugins = [Autoplay({ delay: 8000, stopOnInteraction: true })];

  return (
    <div className="px-4">
      <p className="my-8 text-center font-play text-lg font-semibold">
        {carouselType === "users" ? "Your Papers" : "Upcoming Papers"}
      </p>

      <div>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={plugins}
          className="w-full"
        >
          <div className="relative mt-4 flex justify-end gap-4">
            <CarouselPrevious className="relative" />
            <CarouselNext className="relative" />
          </div>
          <CarouselContent>
            {chunkedPapers.map((paperGroup, index) => (
              <CarouselItem
                key={`carousel-item-${index}`}
                className="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-4 lg:auto-rows-fr"
              >
                {paperGroup.map((paper, subIndex) => (
                  <div key={subIndex} className="h-full">
                    <UpcomingPaper
                      subject={paper.subject}
                      slots={paper.slots}
                    />
                  </div>
                ))}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default PapersCarousel;
