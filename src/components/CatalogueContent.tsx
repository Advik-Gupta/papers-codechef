"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { type IPaper, type Filters } from "@/interface";
import Card from "./Card";
import { extractBracketContent } from "@/util/utils";
import { useRouter } from "next/navigation";
import Loader from "./ui/loader";
import SideBar from "../components/SideBar";
import Error from "./Error";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export async function downloadFile(url: string, filename: string) {
  try {
    const response = await axios.get(url, { responseType: "blob" });
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {}
}

const CatalogueContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize state with defaults, set later in useEffect
  const [subject, setSubject] = useState<string | null>(null);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedAnswerKeyIncluded, setSelectedAnswerKeyIncluded] =
    useState<boolean>(false);
  const [papers, setPapers] = useState<IPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<IPaper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<IPaper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<Filters>();
  const [filtersPulled, setFiltersPulled] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);

  // Set initial state from searchParams on client-side mount
  useEffect(() => {
    setIsMounted(true);
    if (searchParams) {
      setSubject(searchParams.get("subject"));
      setSelectedExams(searchParams.get("exams")?.split(",") ?? []);
      setSelectedSlots(searchParams.get("slots")?.split(",") ?? []);
      setSelectedYears(searchParams.get("years")?.split(",") ?? []);
      setSelectedCampuses(searchParams.get("campus")?.split(",") ?? []);
      setSelectedSemesters(searchParams.get("semester")?.split(",") ?? []);
      setSelectedAnswerKeyIncluded(searchParams.get("answerkey") === "true");
    }
  }, [searchParams]);

  const filtersNotPulled = () => {
    setFiltersPulled(false);
  };

  // Fetch papers and apply filters
  useEffect(() => {
    if (!subject || !isMounted) return;

    const fetchPapers = async () => {
      setLoading(true);
      try {
        const papersResponse = await axios.get<Filters>("/api/papers", {
          params: { subject },
        });
        const data: Filters = papersResponse.data;
        const papersData = data.papers;
        setFilterOptions(data);
        setPapers(papersData);
        // Apply filters from URL params
        const filtered = papersData.filter((paper) => {
          const examCondition = selectedExams.length
            ? selectedExams.includes(paper.exam)
            : true;
          const slotCondition = selectedSlots.length
            ? selectedSlots.includes(paper.slot)
            : true;
          const yearCondition = selectedYears.length
            ? selectedYears.includes(paper.year)
            : true;
          const semesterCondition = selectedSemesters.length
            ? selectedSemesters.includes(paper.semester)
            : true;
          const campusCondition = selectedCampuses.length
            ? selectedCampuses.includes(paper.campus)
            : true;
          const answerkeyCondition = selectedAnswerKeyIncluded
            ? paper.answerKeyIncluded
            : true;
          return (
            examCondition &&
            slotCondition &&
            yearCondition &&
            semesterCondition &&
            campusCondition &&
            answerkeyCondition
          );
        });
        setFilteredPapers(filtered.length > 0 ? filtered : papersData);
        setAppliedFilters(true);
      } catch (error) {
        setPapers([]);
        const axiosError = error as AxiosError;
        setError(
          axios.isAxiosError(axiosError)
            ? ((axiosError.response?.data as { message?: string })?.message ??
                "Error fetching papers")
            : "Error fetching papers",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchPapers();
  }, [
    subject,
    isMounted,
    selectedExams,
    selectedSlots,
    selectedYears,
    selectedSemesters,
    selectedCampuses,
    selectedAnswerKeyIncluded,
  ]);

  // Memoized handlers
  const handleSelectPaper = useCallback(
    (paper: IPaper, isSelected: boolean) => {
      setSelectedPapers((prev) =>
        isSelected ? [...prev, paper] : prev.filter((p) => p._id !== paper._id),
      );
    },
    [],
  );

  const handleDownloadAll = useCallback(async () => {
    for (const paper of selectedPapers) {
      const extension = paper.finalUrl.split(".").pop();
      const fileName = `${extractBracketContent(paper.subject)}-${paper.exam}-${paper.slot}-${paper.year}.${extension}`;
      await downloadFile(paper.finalUrl, fileName);
    }
  }, [selectedPapers]);

  const handleApplyFilters = useCallback(
    (
      exams: string[],
      slots: string[],
      years: string[],
      campus: string[],
      semester: string[],
      anskey: boolean,
    ) => {
      setAppliedFilters(true);

      let pushContent = "/catalogue";
      if (subject) pushContent += `?subject=${encodeURIComponent(subject)}`;
      if (exams.length > 0)
        pushContent += `&exams=${encodeURIComponent(exams.join(","))}`;
      if (slots.length > 0)
        pushContent += `&slots=${encodeURIComponent(slots.join(","))}`;
      if (years.length > 0)
        pushContent += `&years=${encodeURIComponent(years.join(","))}`;
      if (campus.length > 0)
        pushContent += `&campus=${encodeURIComponent(campus.join(","))}`;
      if (semester.length > 0)
        pushContent += `&semester=${encodeURIComponent(semester.join(","))}`;
      if (anskey) pushContent += "&answerkey=true";

      router.push(pushContent);
      setSelectedExams(exams);
      setSelectedSlots(slots);
      setSelectedYears(years);
      setSelectedCampuses(campus);
      setSelectedSemesters(semester);
      setSelectedAnswerKeyIncluded(anskey);
      const filtered = papers.filter((paper) => {
        const examCondition = exams.length ? exams.includes(paper.exam) : true;
        const slotCondition = slots.length ? slots.includes(paper.slot) : true;
        const yearCondition = years.length ? years.includes(paper.year) : true;
        const semesterCondition = semester.length
          ? semester.includes(paper.semester)
          : true;
        const campusCondition = campus.length
          ? campus.includes(paper.campus)
          : true;
        const answerkeyCondition = anskey ? paper.answerKeyIncluded : true;
        return (
          examCondition &&
          slotCondition &&
          yearCondition &&
          semesterCondition &&
          campusCondition &&
          answerkeyCondition
        );
      });
      setFilteredPapers(filtered);
    },
    [subject, router, papers],
  );

  const closeFilters = useCallback(() => {
    setFiltersPulled(false);
  }, []);

  const noAppliedFilters = useCallback(() => {
    setAppliedFilters(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedPapers(appliedFilters ? filteredPapers : papers);
  }, [appliedFilters, filteredPapers, papers]);

  const handleDeselectAll = useCallback(() => {
    setSelectedPapers([]);
  }, []);

  // Render loading state until mounted to avoid hydration mismatch
  if (!isMounted) {
    return <Loader />;
  }

  return (
    <div className="relative flex min-h-screen justify-center p-0 md:justify-normal">
      <div className="hidden w-[30%] min-w-fit md:block">
        <SideBar
          filtersNotPulled={filtersNotPulled}
          loading={loading}
          selectedExams={selectedExams}
          selectedSlots={selectedSlots}
          selectedYears={selectedYears}
          selectedSemesters={selectedSemesters}
          selectedCampuses={selectedCampuses}
          selectedAnswerKeyIncluded={selectedAnswerKeyIncluded}
          noAppliedFilters={noAppliedFilters}
          handleApplyFilters={handleApplyFilters}
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
          selectedPapers={selectedPapers}
          subject={subject}
          filterOptions={filterOptions}
          handleDownloadAll={handleDownloadAll}
          closeFilters={closeFilters}
        />
      </div>

      <div className="w-full">
        <Sheet>
          <SheetTrigger className="mx-8 mt-8 block md:hidden">
            <Button
              variant="outline"
              className="flex gap-2 border-2 border-black font-sans font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
            >
              <Filter size={18} />
              Add Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="m-0 bg-[#f3f5ff] p-0 pt-4 dark:bg-[#070114]"
          >
            <SideBar
              filtersNotPulled={filtersNotPulled}
              loading={loading}
              selectedExams={selectedExams}
              selectedSlots={selectedSlots}
              selectedYears={selectedYears}
              selectedSemesters={selectedSemesters}
              selectedCampuses={selectedCampuses}
              selectedAnswerKeyIncluded={selectedAnswerKeyIncluded}
              noAppliedFilters={noAppliedFilters}
              handleApplyFilters={handleApplyFilters}
              handleSelectAll={handleSelectAll}
              handleDeselectAll={handleDeselectAll}
              selectedPapers={selectedPapers}
              subject={subject}
              filterOptions={filterOptions}
              handleDownloadAll={handleDownloadAll}
              closeFilters={closeFilters}
            />
          </SheetContent>
        </Sheet>

        {loading ? (
          <Loader />
        ) : papers.length > 0 ? (
          <div
            className={`grid h-fit grid-cols-1 gap-8 px-[30px] py-[40px] md:grid-cols-2 lg:grid-cols-4 ${filtersPulled ? "blur-xl" : ""}`}
          >
            {appliedFilters ? (
              filteredPapers.length > 0 ? (
                filteredPapers.map((paper: IPaper) => (
                  <Card
                    key={paper._id}
                    paper={paper}
                    onSelect={handleSelectPaper}
                    isSelected={selectedPapers.some((p) => p._id === paper._id)}
                  />
                ))
              ) : (
                <p>No papers available with the applied filter</p>
              )
            ) : (
              papers.map((paper: IPaper) => (
                <Card
                  key={paper._id}
                  paper={paper}
                  onSelect={handleSelectPaper}
                  isSelected={selectedPapers.some((p) => p._id === paper._id)}
                />
              ))
            )}
          </div>
        ) : (
          <Error
            filtersPulled={filtersPulled}
            message={error ?? "No papers available for this subject."}
          />
        )}
      </div>
    </div>
  );
};

export default CatalogueContent;
