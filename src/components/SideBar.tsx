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
  selectedExams,
  selectedSlots,
  selectedYears,
  selectedCampuses,
  selectedSemesters,
  selectedAnswerKeyIncluded,
  filterOptions,
  filtersNotPulled,
  handleApplyFilters,
  handleSelectAll,
  handleDeselectAll,
  handleDownloadSelected: handleDownloadAll,
}: {
  loading: boolean;
  selectedExams: string[];
  selectedSlots: string[];
  selectedYears: string[];
  selectedCampuses: string[];
  selectedSemesters: string[];
  selectedAnswerKeyIncluded: boolean;
  filtersNotPulled: () => void;
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
  handleDownloadSelected: () => void;
}) {
  const Button: React.FC<{
    onClick: () => void;
    selected?: boolean;
    className?: string;
    children: React.ReactNode;
  }> = ({ onClick, selected = false, className, children }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full border-2 px-2 py-1 font-play text-xs font-semibold ${
        selected
          ? "border-[#B2B8FF] bg-[#B2B8FF] text-black dark:border-[#434dba] dark:bg-[#434dba] dark:text-white"
          : "border-black hover:bg-[#B2B8FF] hover:text-black dark:border-white dark:hover:border-[#434dba] dark:hover:bg-[#434dba] dark:hover:text-white"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );

  const exams =
    filterOptions?.unique_exams.map((exam) => ({ label: exam, value: exam })) ?? [];
  const slots =
    filterOptions?.unique_slots.map((slot) => ({ label: slot, value: slot })) ?? [];
  const years =
    filterOptions?.unique_years.map((year) => ({ label: year, value: year })) ?? [];
  const semesters =
    filterOptions?.unique_semesters.map((semester) => ({
      label: semester,
      value: semester,
    })) ?? [];

  const filtersForSidebar = [
    {
      label: "Exams",
      data: exams,
      selected: selectedExams,
      updater: (newVal: string[]) =>
        handleApplyFilters(
          newVal,
          selectedSlots,
          selectedYears,
          selectedCampuses,
          selectedSemesters,
          selectedAnswerKeyIncluded
        ),
    },
    {
      label: "Slots",
      data: slots,
      selected: selectedSlots,
      updater: (newVal: string[]) =>
        handleApplyFilters(
          selectedExams,
          newVal,
          selectedYears,
          selectedCampuses,
          selectedSemesters,
          selectedAnswerKeyIncluded
        ),
    },
    {
      label: "Years",
      data: years,
      selected: selectedYears,
      updater: (newVal: string[]) =>
        handleApplyFilters(
          selectedExams,
          selectedSlots,
          newVal,
          selectedCampuses,
          selectedSemesters,
          selectedAnswerKeyIncluded
        ),
    },
    {
      label: "Semesters",
      data: semesters,
      selected: selectedSemesters,
      updater: (newVal: string[]) =>
        handleApplyFilters(
          selectedExams,
          selectedSlots,
          selectedYears,
          selectedCampuses,
          newVal,
          selectedAnswerKeyIncluded
        ),
    },
  ];

  return (
    <div className="no-scrollbar fixed sticky top-0 h-[100vh] flex-col items-baseline overflow-y-auto border-r-2 border-[#36266d] bg-[#f3f5ff] pt-[10px] dark:bg-[#070114] md:flex">
      {/* Header */}
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div className="flex items-center gap-1">
          <Filter size={24} />
          <div className="font-play text-xl font-bold">Filters</div>
        </div>
        <Button onClick={() => handleApplyFilters([], [], [], [], [], false)}>
          Reset Filters
        </Button>
      </div>

      {/* Answer Key Toggle */}
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <Button
          selected={selectedAnswerKeyIncluded}
          onClick={() =>
            handleApplyFilters(
              selectedExams,
              selectedSlots,
              selectedYears,
              selectedCampuses,
              selectedSemesters,
              !selectedAnswerKeyIncluded
            )
          }
        >
          Answer Key Available
        </Button>
      </div>

      {/* Select/Deselect/Download All Buttons */}
      <div className="flex w-full flex-wrap justify-between gap-2 border-b-2 border-[#36266d] px-[10px] py-4">
        <Button onClick={handleSelectAll}>Select All</Button>
        <Button onClick={handleDeselectAll}>Deselect All</Button>
        <Button onClick={handleDownloadAll}>Download Selected</Button>
      </div>

      {/* Filters */}
      {filtersForSidebar.map((section) => (
        <div
          key={section.label}
          className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]"
        >
          <Accordion className="w-full" type="single" collapsible>
            <AccordionItem className="border-none no-underline" value="item-1">
              <AccordionTrigger className="w-full no-underline">
                <div className="font-play text-sm no-underline">{section.label}</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="my-2 flex w-full flex-wrap items-center">
                  {section.data.map((item) => (
                    <Button
                      key={item.value}
                      selected={section.selected.includes(item.value)}
                      onClick={() => {
                        const newValues = section.selected.includes(item.value)
                          ? section.selected.filter((v) => v !== item.value)
                          : [...section.selected, item.value];
                        section.updater(newValues);
                      }}
                      className="mb-2 mr-2"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
