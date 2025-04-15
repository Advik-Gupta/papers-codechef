"use client";

import React, { useEffect, useState } from "react";
import SearchBar, { fetchSubjects } from "./Searchbar/searchbar";
import { Button } from "./ui/button";
import Image from "next/image";
import { Search, XIcon } from "lucide-react";
import filterIcon from "../assets/filterIcon.svg";
import { type Filters, type IPaper } from "@/interface";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import closeIcon from "../assets/close.svg";
import { set } from "mongoose";
import toast from "react-hot-toast";
import SearchbarChild from "./Searchbar/searchbar-child";

function SideBar({
  loading,
  selectedExams,
  selectedSlots,
  selectedYears,
  selectedCampuses,
  selectedSemesters,
  selectedAnswerKeyIncluded,
  noAppliedFilters,
  filtersPulled,
  subject,
  filterOptions,
  handleSelectAll,
  handleDeselectAll,
  selectedPapers,
  handleDownloadAll,
  handleApplyFilters,
  closeFilters,
}: {
  loading: boolean;
  selectedExams: string[];
  selectedSlots: string[];
  selectedYears: string[];
  selectedCampuses: string[];
  selectedSemesters: string[];
  selectedAnswerKeyIncluded: boolean;
  noAppliedFilters: () => void;
  closeFilters: () => void;
  filtersPulled: boolean;
  subject: string | null;
  filterOptions: Filters | undefined;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  selectedPapers: IPaper[];
  handleDownloadAll: () => void;
  handleApplyFilters: (
    exams: string[],
    slots: string[],
    years: string[],
    campus: string[],
    semester: string[],
    anskey: boolean,
  ) => void;
}) {
  const exams = filterOptions?.uniqueExams.map((exam) => ({
    label: exam,
    value: exam,
  }));
  const slots = filterOptions?.uniqueSlots.map((slot) => ({
    label: slot,
    value: slot,
  }));
  const years = filterOptions?.uniqueYears.map((year) => ({
    label: year,
    value: year,
  }));
  const semesters = filterOptions?.uniqueSemesters.map((semester) => ({
    label: semester,
    value: semester,
  }));
  const campuses = filterOptions?.uniqueCampuses.map((campus) => ({
    label: campus,
    value: campus,
  }));
  const [subjects, setSubjects] = useState<string[]>([]);
  useEffect(() => {
    async function fetchSubjectsSidebar() {
      if(loading)
      {
        return;
      }
      const fetchedSubjects = await fetchSubjects();
      setSubjects(fetchedSubjects);
    }
    void fetchSubjectsSidebar();
  }, []);
  return (
    <div
      className={`no-scrollbar overflow-y-scroll sticky top-0 mb-0 h-[100vh] w-[100em] max-w-xs flex-col items-baseline border-r-2 border-[#36266d] bg-[#f3f5ff] py-[40px] dark:bg-[#070114] md:flex md:w-[30%] ${filtersPulled ? "flex" : "hidden"}`}
    >
      <div onClick={closeFilters} className="block md:hidden">
        <Image
          className="absolute right-[10px] top-[10px] w-[7%]"
          src={closeIcon as string}
          width={500}
          height={500}
          alt="Navbar trigger"
        />
      </div>
      <div className="px-[10px] md:w-[100%]">{/* <SearchBar /> */}
      <SearchbarChild initialSubjects={subjects ?? []}></SearchbarChild>

      </div>
      <div className="flex w-full gap-8 border-b-2 border-[#36266d] px-[10px] pb-4 pt-8">
        <div className="hidden flex-col items-baseline justify-center gap-2 md:flex md:justify-end 2xl:mr-4">
          <div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="mr-2 border-2 border-black play font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={handleDeselectAll}
              className="border-2 border-black play font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            >
              Deselect All
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={selectedPapers.length === 0}
            className="border-2 border-black play font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
          >
            Download All ({selectedPapers.length})
          </Button>
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div className="flex">
          <Image
            src={filterIcon as string}
            width={30}
            height={30}
            className="invert dark:invert-0"
            alt="Picture of the author"
          />
          <div className="play text-xl font-bold">Filters</div>
        </div>
        <div className="flex flex-col">
          <div
            className="cursor-pointer rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            onClick={() => {
              handleApplyFilters([], [], [], [], [], false);
            }}
          >
            Reset Filters
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div
          onClick={() => {
            handleApplyFilters(
              selectedExams,
              selectedSlots,
              selectedYears,
              selectedCampuses,
              selectedSemesters,
              !selectedAnswerKeyIncluded,
            );
          }}
          className={`flex cursor-pointer rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white ${selectedAnswerKeyIncluded ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
        >
          Answer Key Available
        </div>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible defaultValue="item-1"> 
          {/* keep exams open by default it looks good */}
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="play text-sm no-underline">Exams</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {exams?.map((exam) => (
                  <div
                    key={exam.value}
                    onClick={() => {
                      if (selectedExams.includes(exam.value)) {
                        handleApplyFilters(
                          selectedExams.filter((e) => e !== exam.value),
                          selectedSlots,
                          selectedYears,
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      } else {
                        handleApplyFilters(
                          [...selectedExams, exam.value],
                          selectedSlots,
                          selectedYears,
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      }
                    }}
                    className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedExams.includes(exam.value) ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
                  >
                    {exam.label}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="play text-sm no-underline">Slots</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {slots?.map((slot) => (
                  <div
                    key={slot.value}
                    onClick={() => {
                      if (selectedSlots.includes(slot.value)) {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots.filter((s) => s !== slot.value),
                          selectedYears,
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      } else {
                        handleApplyFilters(
                          selectedExams,
                          [...selectedSlots, slot.value],
                          selectedYears,
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      }
                    }}
                    className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedSlots.includes(slot.value) ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="play text-sm no-underline">Years</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {years?.map((year) => (
                  <div
                    key={year.value}
                    onClick={() => {
                      if (selectedYears.includes(year.value)) {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          selectedYears.filter((y) => y !== year.value),
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      } else {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          [...selectedYears, year.value],
                          selectedCampuses,
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      }
                    }}
                    className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedYears.includes(year.value) ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
                  >
                    {year.label}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="play text-sm no-underline">Semesters</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {semesters?.map((semester) => (
                  <div
                    key={semester.value}
                    onClick={() => {
                      if (selectedSemesters.includes(semester.value)) {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          selectedYears,
                          selectedCampuses,
                          selectedSemesters.filter((s) => s !== semester.value),
                          selectedAnswerKeyIncluded,
                        );
                      } else {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          selectedYears,
                          selectedCampuses,
                          [...selectedSemesters, semester.value],
                          selectedAnswerKeyIncluded,
                        );
                      }
                    }}
                    className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 play text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedSemesters.includes(semester.value) ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
                  >
                    {semester.label}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Campuses</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {campuses?.map((campus) => (
                  <div
                    key={campus.value}
                    onClick={() => {
                      if (selectedCampuses.includes(campus.value)) {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          selectedYears,
                          selectedCampuses.filter((c) => c !== campus.value),
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      } else {
                        handleApplyFilters(
                          selectedExams,
                          selectedSlots,
                          selectedYears,
                          [...selectedCampuses, campus.value],
                          selectedSemesters,
                          selectedAnswerKeyIncluded,
                        );
                      }
                    }}
                    className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedCampuses.includes(campus.value) ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]" : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"}`}
                  >
                    {campus.label}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div> */}
    </div>
  );
}

export default SideBar;
