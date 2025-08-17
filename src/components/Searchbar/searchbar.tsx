"use client";

import React from "react";
import axios from "axios";
import { type ICourses } from "@/interface";
import SearchBarChild from "./searchbar-child";
import PinnedSearchBar from "./pinned-searchbar";
import { type IUpcomingPaper } from "@/interface";
import { useState, useEffect } from "react";
import { string } from "zod";

export async function fetchSubjects() {
  try {
    const response = await axios.get<ICourses[]>(
      `/api/course-list`,
    );

    return response.data.map((course) => course.name);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return [];
  }
}

export default function SearchBar({
  type = "default",
  displayPapers
}: {
  type?: "default" | "pinned";
  displayPapers: IUpcomingPaper[]
}) {
  const [subjects,setSubjects] = useState<string[]>([]);

  useEffect(() => {
    async function getSubjects() {
      setSubjects(await fetchSubjects());
    }
    void getSubjects()
  },[])

  return type === "pinned" ? (
    <PinnedSearchBar initialSubjects={subjects} displayPapers = {displayPapers} />
  ) : (
    <SearchBarChild initialSubjects={subjects} />
  );
}