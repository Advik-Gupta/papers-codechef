"use server";

import axios from "axios";
import { type ICourses } from "@/interface";
import SearchBarChild from "./searchbar-child";
import PinnedSearchBar from "./pinned-searchbar";

export async function fetchSubjects() {
  try {
    const response = await axios.get<ICourses[]>(`/api/course-list`);
    console.log("Fetched subjects:", response.data);
    return response.data.map((course) => course.name);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return [];
  }
}

export default async function SearchBar({ type = "default" }) {
  const subjects = await fetchSubjects();

  return type === "pinned" ? (
    <PinnedSearchBar initialSubjects={subjects} />
  ) : (
    <SearchBarChild initialSubjects={subjects} />
  );
}
