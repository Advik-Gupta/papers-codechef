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

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await axios.get<Course[]>(`/api/course-list`);
        const courses: Course[] = response.data;
        const names = courses
          .map((course) => course.name ?? course.courseName ?? course.title)
          .filter(Boolean) as string[];

        setSubjects(names);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }
    void fetchSubjects();
  }, []);

  const fuse = useMemo(
    () => new Fuse(subjects, { includeScore: true, threshold: 0.3 }),
    [subjects],
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
    setSuggestions(results.map((r) => r.item).slice(0, 10));
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

        <div className="mx-auto mt-16 max-w-6xl text-center">
          <div className="relative mb-8 text-center">
            <h3 className="font-vipnabd text-2xl font-bold">Explore More</h3>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-[#303771]"
              >
                <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Paper"
                    alt={`Paper ${index}`}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover opacity-60"
                  />
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-[#4A55FF]/20 px-2 py-1 text-xs text-[#4A55FF] dark:bg-[#9EA8FF]/20 dark:text-[#9EA8FF]">
                      C1
                    </span>
                    <span className="rounded bg-[#4A55FF]/20 px-2 py-1 text-xs text-[#4A55FF] dark:bg-[#9EA8FF]/20 dark:text-[#9EA8FF]">
                      CAT-1
                    </span>
                    <span className="rounded bg-[#4A55FF]/20 px-2 py-1 text-xs text-[#4A55FF] dark:bg-[#9EA8FF]/20 dark:text-[#9EA8FF]">
                      2024
                    </span>
                    <span className="rounded bg-[#4A55FF]/20 px-2 py-1 text-xs text-[#4A55FF] dark:bg-[#9EA8FF]/20 dark:text-[#9EA8FF]">
                      Fall
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
