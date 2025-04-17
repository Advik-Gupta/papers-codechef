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
import filterIcon from "../assets/filterIcon.svg";
import filterd from "@/assets/filterd.svg";
import Image from "next/image";
import SideBar from "../components/SideBar";
import toast from "react-hot-toast";
import Error from "./Error";

const CatalogueContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const exams = searchParams.get("exams")?.split(",");
  const slots = searchParams.get("slots")?.split(",");
  const years = searchParams.get("years")?.split(",");
  const campuses = searchParams.get("campus")?.split(",");
  const semesters = searchParams.get("semester")?.split(",");
  const answerKeyIncluded = searchParams.get("answerkey") === "true";

  // Initialize state with searchParams
  const [selectedExams, setSelectedExams] = useState<string[]>(exams ?? []);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(slots ?? []);
  const [selectedYears, setSelectedYears] = useState<string[]>(years ?? []);
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>(
    semesters ?? [],
  );
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>(
    campuses ?? [],
  );
  const [selectedAnswerKeyIncluded, setSelectedAnswerKeyIncluded] =
    useState<boolean>(answerKeyIncluded || false);
  const [papers, setPapers] = useState<IPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<IPaper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<IPaper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<Filters>();
  const [filtersPulled, setFiltersPulled] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);


  const filtersNotPulled = ()=>{
    setFiltersPulled(false);
  }
  // Memoized effect to fetch papers
  useEffect(() => {
    if (!subject) return;

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
      } catch (error) {
        setPapers([]);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message?: string }>;
          setError(
            axiosError.response?.data?.message ?? "Error fetching papers",
          );
        } else {
          setError("Error fetching papers");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchPapers();
  }, [subject]); // just run on initial page render

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
      setFilteredPapers(filtered.length > 0 ? filtered : papers);
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

  async function downloadFile(url: string, filename: string) {
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

  return (
    <div className="relative flex min-h-screen justify-center p-0 md:justify-normal">
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
        filtersPulled={filtersPulled}
        handleApplyFilters={handleApplyFilters}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        selectedPapers={selectedPapers}
        subject={subject}
        filterOptions={filterOptions}
        handleDownloadAll={handleDownloadAll}
        closeFilters={closeFilters}
      />

      {/* {error && <p className="text-red-500">{error}</p>} */}
      <div className="w-full">
        <div
          className={`justify-center mt-8 filter md:hidden ${filtersPulled ? "hidden" : "flex"}`}
        >
          <Button
            variant="outline"
            onClick={() => setFiltersPulled(true)}
            className="mr-2 border-2 border-black font-sans font-semibold hover:bg-slate-800 hover:text-white dark:border-[#434dba] dark:hover:border-white dark:hover:bg-slate-900"
          >
            Add Filters
            <Image
              src={filterIcon as string}
              width={30}
              height={30}
              alt="Filter Icon"
              className="invert dark:invert-0"
            />

          </Button>
        </div>
        {loading ? (
          <Loader />
        ) : papers.length > 0 ? (
          <div
            className={`grid h-fit grid-cols-1 gap-8 px-[30px] py-[40px] md:grid-cols-4 ${filtersPulled ? "blur-xl" : ""}`}
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
          <Error filtersPulled={filtersPulled} message={error ?? "No papers available for this subject."} />
        )}
      </div>
    </div>
  );
};

export default CatalogueContent;
