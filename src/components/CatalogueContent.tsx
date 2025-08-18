"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  type IPaper,
  type Filters,
  type StoredSubjects
} from "@/interface";
import Card from "./Card";
import { useRouter } from "next/navigation";
import Loader from "./ui/loader";
import SideBar from "../components/SideBar";
import Error from "./Error";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Pin } from "lucide-react";

import Link from "next/link";
import {
  getSecureUrl,
  generateFileName,
  downloadFile,
} from "@/util/download_paper";

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
  const [pinned, setPinned] = useState<boolean>(false);
  const [relatedSubjects, setRelatedSubjects] = useState<string[]>([]);
  // Fetch related subjects when subject changes
  useEffect(() => {
    if (!subject) return;
    const fetchRelatedSubjects = async () => {
      try {
        const res = await axios.get<{ related_subjects: string[] }>(
          "/api/related-subject",
          {
            params: { subject },
          },
        );
        console.log(res.data);
        const data = res.data.related_subjects;
        console.log("data", data[0], data[1]);
        if (data && data.length > 0) {
          setRelatedSubjects(data);
        } else {
          setRelatedSubjects([]);
        }
      } catch (e) {
        setRelatedSubjects([]);
      }
    };
    void fetchRelatedSubjects();
  }, [subject]);

  // Set initial state from searchParams on client-side mount
  useEffect(() => {
    setIsMounted(true);
    if (searchParams) {
      const currentPinnedSubjects = JSON.parse(
        localStorage.getItem("userSubjects") ?? "[]",
      ) as StoredSubjects;
      const subjectName = searchParams.get("subject");
      setSubject(subjectName);
      setSelectedExams(searchParams.get("exams")?.split(",") ?? []);
      setSelectedSlots(searchParams.get("slots")?.split(",") ?? []);
      setSelectedYears(searchParams.get("years")?.split(",") ?? []);
      setSelectedCampuses(searchParams.get("campus")?.split(",") ?? []);
      setSelectedSemesters(searchParams.get("semester")?.split(",") ?? []);
      setSelectedAnswerKeyIncluded(searchParams.get("answerkey") === "true");
      if (subjectName && Array.isArray(currentPinnedSubjects)) {
        if (currentPinnedSubjects.includes(subjectName)) {
          setPinned(true);
        } else {
          setPinned(false);
        }
      }
    }
  }, [searchParams, pinned]);

  const filtersNotPulled = () => {
    setFiltersPulled(false);
  };

  const handlePinToggle = () => {
    const current = !pinned;
    setPinned(current);

    const saved = JSON.parse(
      localStorage.getItem("userSubjects") ?? "[]",
    ) as string[];
    const updated = current
      ? [...new Set([...saved, subject])]
      : saved.filter((s) => s !== subject);

    localStorage.setItem("userSubjects", JSON.stringify(updated));
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
            ? paper.answer_key_included === true
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
        setFilteredPapers(filtered);
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
    const uniquePapers = Array.from(
      new Set(selectedPapers.map((paper) => paper._id)),
    ).map((id) => selectedPapers.find((paper) => paper._id === id)) as IPaper[];

    for (const paper of uniquePapers) {
      await downloadFile(
        getSecureUrl(paper.final_url),
        generateFileName(paper),
      );
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
        const answerkeyCondition = anskey
          ? paper.answer_key_included === true
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
      {papers.length > 0 && <div className="hidden !w-[22%] min-w-[22%] max-w-[22%] flex-shrink-0 md:block">
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
      </div>}

      <div className="w-full">
        {papers.length > 0 && <Sheet>
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
        </Sheet>}

        <div className="p-7">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-s font-semibold text-gray-700 dark:text-white/80">
                {subject?.split("[")[1]?.replace("]", "")}
              </p>
              <h2 className="text-2xl font-extrabold text-gray-700 dark:text-white md:text-3xl">
                {subject?.split(" [")[0]}
              </h2>
            </div>
            <div className="mt-7">
              <button onClick={handlePinToggle}>
                <Pin
                  className={`h-7 w-7 ${pinned ? "fill-[#A78BFA]" : ""} stroke-gray-700 dark:stroke-white`}
                />
              </button>
            </div>
          </div>
          {relatedSubjects.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                Related subjects:
              </span>
              {relatedSubjects.map((sub) => (
                <Link
                  key={sub}
                  href={`/catalogue?subject=${encodeURIComponent(sub)}`}
                  className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-200 dark:hover:bg-violet-800"
                >
                  {sub}
                </Link>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : papers.length > 0 ? (
          <div
            className={`grid h-fit grid-cols-1 gap-8 px-[30px] pb-[40px] md:grid-cols-2 lg:grid-cols-4 ${filtersPulled ? "blur-xl" : ""}`}
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
