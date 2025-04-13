"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "./Searchbar/searchbar";
import { Button } from "./ui/button";
import Image from "next/image";
import { XIcon } from "lucide-react";
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

function SideBar({
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
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [answerKey, setAnswerKey] = useState<boolean>(false);
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

  const handleResetFilters = () => {
    setSelectedExams([]);
    setSelectedSlots([]);
    setSelectedYears([]);
    setSelectedCampuses([]);
    setSelectedSemesters([]);
    setAnswerKey(false);
    noAppliedFilters();
  };
  useEffect(() => {
    handleResetFilters();
  }, []);
  function handleXClick<T>(
    event: React.MouseEvent,
    mainStuff: T,
    selectedStuff: T[],
    setSelectedStuff: React.Dispatch<React.SetStateAction<T[]>>,
  ) {
    event.stopPropagation();
    if (selectedStuff.includes(mainStuff)) {
      setSelectedStuff(
        selectedStuff.filter((el) => {
          return el != mainStuff;
        }),
      );
    }
  }

  function handleFilterClick<T>(
    event: React.MouseEvent,
    mainstuff: T,
    selectedStuff: T[],
    setSelectedStuff: React.Dispatch<React.SetStateAction<T[]>>,
  ) {
    event.stopPropagation();
    if (!selectedStuff.includes(mainstuff)) {
      setSelectedStuff((prevItems) => [...prevItems, mainstuff]);
    }
  }
  useEffect(() => {
    //this is to check if any of the filters is clicked and if clicked then apply the filter without using the applyfilter button
    if (
      selectedExams.length > 0 ||
      selectedSlots.length > 0 ||
      selectedYears.length > 0 ||
      selectedCampuses.length > 0 ||
      selectedSemesters.length > 0 ||
      answerKey === true
    )
      handleApplyFilters(
        selectedExams,
        selectedSlots,
        selectedYears,
        selectedCampuses,
        selectedSemesters,
        answerKey,
      );
    else {
      noAppliedFilters();
    }
  }, [
    //dont listen to eslint here if ya dont want to have an infinite loop
    selectedExams,
    selectedSlots,
    selectedYears,
    selectedCampuses,
    selectedSemesters,
    answerKey,
  ]);

  return (
    <div
      className={`sticky top-0 mb-0 h-full w-[100em] max-w-xs flex-col items-baseline border-r-2 border-[#36266d] bg-[#f3f5ff] py-[40px] dark:bg-[#070114] md:flex md:w-[30%] ${filtersPulled ? "flex" : "hidden"}`}
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
      <div className="px-[10px] md:w-[100%]">{/* <SearchBar /> */}</div>
      <div className="flex w-full gap-8 border-b-2 border-[#36266d] px-[10px] pb-4 pt-8">
        <div className="hidden flex-col items-baseline justify-center gap-2 md:flex md:justify-end 2xl:mr-4">
          <div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="mr-2 border-2 border-black font-sans font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={handleDeselectAll}
              className="border-2 border-black font-sans font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            >
              Deselect All
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={selectedPapers.length === 0}
            className="border-2 border-black font-sans font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
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
          <div className="font-sans text-xl font-bold">Filters</div>
        </div>
        <div className="flex flex-col">
          <div
            className="cursor-pointer rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            onClick={handleResetFilters}
          >
            Reset Filters
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between border-b-2 border-[#36266d] px-[10px] py-4">
        <div
          onClick={() => {
            setAnswerKey(true);
          }}
          className={`flex cursor-pointer rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white ${answerKey ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
        >
          Answer Key Available
          {answerKey && (
            <XIcon
              className="h-4 cursor-pointer text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                setAnswerKey(false);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion
          className="w-full"
          type="single"
          collapsible
          defaultValue="item-1"
        >
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Exams</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {exams?.map((exam) => {
                  return (
                    <>
                      <div
                        onClick={(event) => {
                          handleFilterClick(
                            event,
                            exam.value,
                            selectedExams,
                            setSelectedExams,
                          );
                        }}
                        className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedExams.includes(exam.value) ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
                      >
                        {exam.label}
                        {selectedExams.includes(exam.value) && (
                          <XIcon
                            className="h-4 cursor-pointer text-muted-foreground"
                            onClick={(event) => {
                              handleXClick(
                                event,
                                exam.value,
                                selectedExams,
                                setSelectedExams,
                              );
                            }}
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Slots</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {slots?.map((slot) => {
                  return (
                    <>
                      <div
                        onClick={(event) => {
                          handleFilterClick(
                            event,
                            slot.value,
                            selectedSlots,
                            setSelectedSlots,
                          );
                        }}
                        className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedSlots.includes(slot.value) ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
                      >
                        {slot.label}
                        {selectedSlots.includes(slot.value) && (
                          <XIcon
                            className="h-4 cursor-pointer text-muted-foreground"
                            onClick={(event) => {
                              handleXClick(
                                event,
                                slot.value,
                                selectedSlots,
                                setSelectedSlots,
                              );
                            }}
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Years</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {years?.map((year) => {
                  return (
                    <>
                      <div
                        onClick={(event) => {
                          handleFilterClick(
                            event,
                            year.value,
                            selectedYears,
                            setSelectedYears,
                          );
                        }}
                        className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedYears.includes(year.value) ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
                      >
                        {year.label}
                        {selectedYears.includes(year.value) && (
                          <XIcon
                            className="h-4 cursor-pointer text-muted-foreground"
                            onClick={(event) => {
                              handleXClick(
                                event,
                                year.value,
                                selectedYears,
                                setSelectedYears,
                              );
                            }}
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Semesters</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {semesters?.map((semester) => {
                  return (
                    <>
                      <div
                        onClick={(event) => {
                          handleFilterClick(
                            event,
                            semester.value,
                            selectedSemesters,
                            setSelectedSemesters,
                          );
                        }}
                        className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedSemesters.includes(semester.value) ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
                      >
                        {semester.label}
                        {selectedSemesters.includes(semester.value) && (
                          <XIcon
                            className="h-4 cursor-pointer text-muted-foreground"
                            onClick={(event) => {
                              handleXClick(
                                event,
                                semester.value,
                                selectedSemesters,
                                setSelectedSemesters,
                              );
                            }}
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between border-b-2 border-[#36266d] px-[10px]">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem className="border-none no-underline" value="item-1">
            <AccordionTrigger className="w-full no-underline">
              <div className="font-sans text-sm no-underline">Campuses</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="my-2 flex w-full flex-wrap items-center">
                {campuses?.map((campus) => {
                  return (
                    <>
                      <div
                        onClick={(event) => {
                          handleFilterClick(
                            event,
                            campus.value,
                            selectedCampuses,
                            setSelectedCampuses,
                          );
                        }}
                        className={`mb-2 mr-2 flex h-fit cursor-pointer items-center rounded-full border-2 border-black px-2 py-1 font-sans text-xs font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900 ${selectedCampuses.includes(campus.value) ? "dark:border-[#434dba] dark:hover:border-[white] dark:hover:bg-[#434dba] dark:bg-[#434dba] bg-[#B2B8FF]  border-[#B2B8FF] hover:bg-[#B2B8FF] hover:border-black" : "dark:border-white dark:hover:border-[#434dba] hover:bg-[#B2B8FF] bg-none"}`}
                      >
                        {campus.label}
                        {selectedCampuses.includes(campus.value) && (
                          <XIcon
                            className="h-4 cursor-pointer text-muted-foreground"
                            onClick={(event) => {
                              handleXClick(
                                event,
                                campus.value,
                                selectedCampuses,
                                setSelectedCampuses,
                              );
                            }}
                          />
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default SideBar;
