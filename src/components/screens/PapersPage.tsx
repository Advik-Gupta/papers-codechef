"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exams, slots, years } from "@/components/select_options";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Fuse from "fuse.js";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { IUpcomingPaper } from "@/interface";
import { Skeleton } from "../ui/skeleton";
import { CarouselItem } from "@/components/ui/carousel";
import UpcomingPaper from "../UpcomingPaper";
import { useCourses } from "@/context/courseContext";

type Course = {
  name?: string | null;
  courseName?: string | null;
  title?: string | null;
};

export default function PapersPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { courses, loading, error, refetch } = useCourses();

  useEffect(() => {
    async function fetchPapers() {
      try {
        setIsLoading(true);
        const response = await axios.get<IUpcomingPaper[]>(
          "/api/upcoming-papers",
        );

        const randomPapers = [...response.data]
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        setDisplayPapers(randomPapers);
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchPapers();
  }, []);

  const fuse = useMemo(
    () => new Fuse(courses, { includeScore: true, threshold: 0.3 }),
    [courses],
  );

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    if (selectedSubject && searchText === selectedSubject) {
      setSuggestions([]);
      return;
    }

    const results = fuse.search(searchText);
    setSuggestions(results.map((r) => r.item.name).slice(0, 10));
  }, [searchText, fuse, selectedSubject]);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setSearchText(subject);
    setSuggestions([]);
    setSelectedExam(null);
    setSelectedSlot(null);
    setSelectedYear(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!selectedSubject || !selectedExam || !selectedSlot || !selectedYear) {
      alert("⚠️ Please fill all fields before submitting.");
      return;
    }

    try {
      await axios.post("/api/request", {
        subject: selectedSubject,
        exam: selectedExam,
        slot: selectedSlot,
        year: selectedYear,
      });

      alert("✅ Your paper request was submitted successfully 🎉");

      setSearchText("");
      setSelectedSubject(null);
      setSelectedExam(null);
      setSelectedSlot(null);
      setSelectedYear(null);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("❌ Failed to submit your request. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5FF] px-6 py-12 text-black dark:bg-[#070114] dark:text-white">
      <main>
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="mb-12 font-vipnabd text-3xl font-extrabold md:text-4xl">
            Specific Paper Request
          </h2>

          <div className="relative mx-auto mb-8 max-w-xl font-play">
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by subject..."
              className={`text-md rounded-lg bg-[#B2B8FF] px-4 py-6 pr-10 font-play tracking-wider text-black shadow-sm ring-0 placeholder:text-black focus:outline-none focus:ring-0 dark:bg-[#7480FF66] dark:text-white placeholder:dark:text-white ${suggestions.length > 0 ? "rounded-b-none" : ""}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>
            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute z-20 max-h-[250px] w-full max-w-xl overflow-y-auto rounded-md rounded-t-none border border-t-0 bg-white text-center shadow-lg dark:bg-[#303771]"
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSubject(s)}
                    className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-8 flex justify-center gap-4">
            <Select
              onValueChange={setSelectedExam}
              disabled={!selectedSubject}
              value={selectedExam ?? undefined}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={setSelectedSlot}
              disabled={!selectedSubject}
              value={selectedSlot ?? undefined}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Slot" />
              </SelectTrigger>
              <SelectContent>
                {slots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={setSelectedYear}
              disabled={!selectedSubject}
              value={selectedYear ?? undefined}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[...years]
                  .sort((a, b) => Number(b) - Number(a))
                  .map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="rounded-lg bg-[#4A55FF] px-8 py-3 text-base text-white hover:bg-[#3A44CC] dark:bg-[#9EA8FF] dark:text-black dark:hover:bg-[#7D86E5]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        <p className="my-8 hidden text-center font-play text-lg font-semibold md:block">
          Upcoming Exams
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer rounded-md border border-[#734DFF] bg-[#171720] text-white shadow-lg transition duration-150 ease-in-out hover:bg-[#262635]"
                >
                  {/* Top section */}
                  <div className="flex items-center justify-between border-b border-[#453D60] p-3">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>

                  {/* Middle section */}
                  <div className="flex flex-col justify-between p-4">
                    <Skeleton className="mb-4 h-6 w-36 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-12 rounded-md" />
                      <Skeleton className="h-7 w-12 rounded-md" />
                    </div>
                  </div>
                </div>
              ))
            : displayPapers.map((paper, subIndex) => (
                <div key={subIndex} className="h-full">
                  <UpcomingPaper subject={paper.subject} slots={paper.slots} />
                </div>
              ))}
        </div>
      </main>
    </div>
  );
}
