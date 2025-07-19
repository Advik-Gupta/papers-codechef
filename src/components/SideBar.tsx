"use client";

import React from "react";
import { Filter } from "lucide-react";
import { type Filters, type IPaper } from "@/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function SideBar({
  loading,
  selectedExams,
  selectedSlots,
  selectedYears,
  selectedCampuses,
  selectedSemesters,
  selectedAnswerKeyIncluded,
  filterOptions,
  handleApplyFilters,
  noAppliedFilters,
  closeFilters,
  subject,
  selectedPapers,
  handleSelectAll,
  handleDeselectAll,
  handleDownloadAll,
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
  subject: string | null;
  filterOptions: Filters | undefined;
  selectedPapers: IPaper[];
  handleApplyFilters: (
    exams: string[],
    slots: string[],
    years: string[],
    campus: string[],
    semester: string[],
    anskey: boolean
  ) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleDownloadAll: () => void;
}) {
  const exams =
    filterOptions?.uniqueExams.map((exam) => ({
      label: exam,
      value: exam,
    })) ?? [];
  const slots =
    filterOptions?.uniqueSlots.map((slot) => ({
      label: slot,
      value: slot,
    })) ?? [];
  const years =
    filterOptions?.uniqueYears.map((year) => ({
      label: year,
      value: year,
    })) ?? [];
  const semesters =
    filterOptions?.uniqueSemesters.map((semester) => ({
      label: semester,
      value: semester,
    })) ?? [];

  return (
    <div className="no-scrollbar mb-0 h-[100vh] min-w-fit flex-col items-baseline overflow-y-scroll border-r-2 border-[#36266d] bg-[#f3f5ff] pt-[10px] dark:bg-[#070114] md:flex">
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div className="flex items-center gap-1">
          <Filter size={24} />
          <div className="font-play text-xl font-bold">Filters</div>
        </div>
        <div className="flex flex-col">
          <div
            className="font-play cursor-pointer rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
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
              !selectedAnswerKeyIncluded
            );
          }}
          className={`font-play flex cursor-pointer rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white ${
            selectedAnswerKeyIncluded
              ? "border-[#B2B8FF] bg-[#B2B8FF] hover:border-black hover:bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba]"
              : "bg-none hover:bg-[#B2B8FF] dark:border-white dark:hover:border-[#434dba]"
          }`}
        >
          Answer Key Available
        </div>
      </div>

      {/* Select/Deselect/Download All Buttons */}
      <div className="flex w-full flex-wrap justify-between border-b-2 border-[#36266d] px-[10px] py-4 gap-2">
        <div
          onClick={handleSelectAll}
          className="font-play cursor-pointer rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-[#B2B8FF] hover:text-black dark:border-white dark:hover:border-[#434dba] dark:hover:bg-[#434dba] dark:hover:text-white"
        >
          Select All
        </div>
        <div
          onClick={handleDeselectAll}
          className="font-play cursor-pointer rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-[#B2B8FF] hover:text-black dark:border-white dark:hover:border-[#434dba] dark:hover:bg-[#434dba] dark:hover:text-white"
        >
          Deselect All
        </div>
        <div
          onClick={handleDownloadAll}
          className="font-play cursor-pointer rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-[#B2B8FF] hover:text-black dark:border-white dark:hover:border-[#434dba] dark:hover:bg-[#434dba] dark:hover:text-white"
        >
          Download All
        </div>
      </div>

      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible defaultValue="item-1">
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-play text-sm no-underline">Exams</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {exams.map((exam) => (
                  <div
                    key={exam.value}
                    onClick={() => {
                      const newExams = selectedExams.includes(exam.value)
                        ? selectedExams.filter((e) => e !== exam.value)
                        : [...selectedExams, exam.value];
                      handleApplyFilters(
                        newExams,
                        selectedSlots,
                        selectedYears,
                        selectedCampuses,
                        selectedSemesters,
                        selectedAnswerKeyIncluded
                      );
                    }}
                    className={`font-play mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white ${
                      selectedExams.includes(exam.value)
                        ? "border-[#B2B8FF] bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba]"
                        : "bg-none dark:border-white"
                    }`}
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
              <div className="font-play text-sm no-underline">Slots</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {slots.map((slot) => (
                  <div
                    key={slot.value}
                    onClick={() => {
                      const newSlots = selectedSlots.includes(slot.value)
                        ? selectedSlots.filter((s) => s !== slot.value)
                        : [...selectedSlots, slot.value];
                      handleApplyFilters(
                        selectedExams,
                        newSlots,
                        selectedYears,
                        selectedCampuses,
                        selectedSemesters,
                        selectedAnswerKeyIncluded
                      );
                    }}
                    className={`font-play mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white ${
                      selectedSlots.includes(slot.value)
                        ? "border-[#B2B8FF] bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba]"
                        : "bg-none dark:border-white"
                    }`}
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
              <div className="font-play text-sm no-underline">Years</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {years.map((year) => (
                  <div
                    key={year.value}
                    onClick={() => {
                      const newYears = selectedYears.includes(year.value)
                        ? selectedYears.filter((y) => y !== year.value)
                        : [...selectedYears, year.value];
                      handleApplyFilters(
                        selectedExams,
                        selectedSlots,
                        newYears,
                        selectedCampuses,
                        selectedSemesters,
                        selectedAnswerKeyIncluded
                      );
                    }}
                    className={`font-play mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white ${
                      selectedYears.includes(year.value)
                        ? "border-[#B2B8FF] bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba]"
                        : "bg-none dark:border-white"
                    }`}
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
              <div className="font-play text-sm no-underline">Semesters</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {semesters.map((semester) => (
                  <div
                    key={semester.value}
                    onClick={() => {
                      const newSems = selectedSemesters.includes(semester.value)
                        ? selectedSemesters.filter((s) => s !== semester.value)
                        : [...selectedSemesters, semester.value];
                      handleApplyFilters(
                        selectedExams,
                        selectedSlots,
                        selectedYears,
                        selectedCampuses,
                        newSems,
                        selectedAnswerKeyIncluded
                      );
                    }}
                    className={`font-play mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 text-xs font-semibold hover:bg-slate-800 hover:text-white ${
                      selectedSemesters.includes(semester.value)
                        ? "border-[#B2B8FF] bg-[#B2B8FF] dark:border-[#434dba] dark:bg-[#434dba]"
                        : "bg-none dark:border-white"
                    }`}
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