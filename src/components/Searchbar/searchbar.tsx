"use server";

import React from "react";
import axios from "axios";
import { type ICourses } from "@/interface";
import SearchBarChild from "./searchbar-child";
import PinnedSearchBar from "./pinned-searchbar";

export async function fetchSubjects() {
  try {
    const response = await axios.get<ICourses[]>(
      `${process.env.SERVER_URL}/api/course-list`,
    );

    return response.data.map((course) => course.name);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return [];
  }
}

export default async function SearchBar({
  type = "default",
}: {
  type?: "default" | "pinned";
}) {
  const subjects = await fetchSubjects();

  return type === "pinned" ? (
    <PinnedSearchBar initialSubjects={subjects} />
  ) : (
    <SearchBarChild initialSubjects={subjects} />
  );
}
