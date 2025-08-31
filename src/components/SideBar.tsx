"use client";

import React from "react";
import { Filter } from "lucide-react";
import { type Filters, type IPaper } from "@/interface";
import SidebarButton from "./SidebarButton";
import SidebarSection from "./SidebarSection";

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
  handleDownloadSelected 
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
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div className="flex items-center gap-1">
          <Filter size={24} />
          <div className="font-play text-xl font-bold">Filters</div>
        </div>
        <SidebarButton onClick={() => handleApplyFilters([], [], [], [], [], false)}>
          Reset Filters
        </SidebarButton>
      </div>

      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <SidebarButton
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
        </SidebarButton>
</div>
<div className="flex w-full flex-wrap justify-between gap-2 border-b-2 border-[#36266d] px-[10px] py-4">
  <SidebarButton onClick={handleSelectAll}>Select All</SidebarButton>
  <SidebarButton onClick={handleDeselectAll}>Deselect All</SidebarButton>
  <SidebarButton onClick={handleDownloadSelected}>Download Selected</SidebarButton>
</div>

{filtersForSidebar.map((section) => (
        <SidebarSection
          key={section.label}
          label={section.label}
          data={section.data}
          selected={section.selected}
          updater={section.updater}
        />
      ))}
    </div>
  );
}

export default SideBar;
