"use server"

import { ICourses } from "@/interface";
import axios from "axios";

export async function fetchSubjects(): Promise<string []>{
    try {
      console.log("searchbar ")
      const response = await axios.get<ICourses[]>(
        `${process.env.SERVER_URL}/api/course-list`,
      );
      return response.data.map((course) => course.name);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      return [];
    }
  }
  