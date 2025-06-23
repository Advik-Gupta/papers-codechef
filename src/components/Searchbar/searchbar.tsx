"use server";

import axios from "axios";
import { type ICourses } from "@/interface";
import SearchBarChild from "./searchbar-child";

export async function fetchSubjects() {
  try {
    const response = await axios.get<ICourses[]>(
      `${process.env.SERVER_URL}/api/course-list`,
    );
    console.log("Fetched subjects:", response.data);
    return response.data.map((course) => course.name);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return [];
  }
}

export default async function SearchBar() {
  const subjects = await fetchSubjects();

  return <SearchBarChild initialSubjects={subjects} />;
}
