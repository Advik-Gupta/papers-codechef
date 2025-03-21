
const slots: string[] = [
  "A1",
  "B1",
  "C1",
  "D1",
  "E1",
  "F1",
  "G1",
  "A2",
  "B2",
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
];
function getYears(startYear: number) {
  const currentYear = new Date().getFullYear(); // Get the current year
  const years = [];

  // Loop from startYear to currentYear and add each year to the array
  for (let year = startYear; year <= currentYear; year++) {
    years.push(String(year));
  }

  return years;
}

// Example usage:
const startYear = 2011;
const years = getYears(startYear);
const campuses: string[] = [
  "Vellore",
  "Chennai",
  "Andhra Pradesh",
  "Bhopal",
  "Bangalore",
  "Mauritius",
];
const exams: string [] = ["CAT-1", "CAT-2", "FAT","Model CAT-1" , "Model CAT-2" , "Model FAT"]
const semesters: string[] = ["Fall Semester", "Winter Semester", "Summer Semester", "Weekend Semester"];
export { slots, years, campuses, semesters, exams };
