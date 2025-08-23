"use client";

import React from "react";
import SearchBarChild from "./searchbar-child";
import PinnedSearchBar from "./pinned-searchbar";
import { useCourses } from "@/context/courseContext";

export default function SearchBar({
  type = "default",
  displayPapers,
}: {
  type?: "default" | "pinned";
  displayPapers?: boolean;
}) {
  const { courses, loading, error, refetch } = useCourses();

  return type === "pinned" && displayPapers !== undefined ? (
    <PinnedSearchBar initialSubjects={courses} displayPapers={displayPapers} />
  ) : (
    <SearchBarChild initialSubjects={courses} />
  );
}
