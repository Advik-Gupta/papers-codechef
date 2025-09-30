"use client";

import React from "react";
import SearchBarChild from "./searchbar-child";
import PinnedSearchBar from "./pinned-searchbar";
import { useCourses } from "@/context/courseContext";
import { type IUpcomingPaper } from "@/interface";

export default function SearchBar({
  type = "default",
  setDisplayPapers,
}: {
  type?: "default" | "pinned",
  setDisplayPapers?: React.Dispatch<React.SetStateAction<IUpcomingPaper[]>> 
}) {
  const { courses, loading, error, refetch } = useCourses();

  return type === "pinned" && setDisplayPapers !== undefined ? (
    <PinnedSearchBar initialSubjects={courses} setDisplayPapers={setDisplayPapers} />
  ) : (
    <SearchBarChild initialSubjects={courses} />
  );
}
