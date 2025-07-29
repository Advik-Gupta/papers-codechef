"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exams, slots, years } from "@/components/select_options"
import { Input } from "@/components/ui/input"
import axios from "axios"

export default function PapersPage() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [searchText, setSearchText] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/course-list`)
        setSubjects(response.data.map((course: { name: string }) => course.name))
      } catch (err) {
        console.error("Error fetching subjects:", err)
      }
    }
    fetchSubjects()
  }, [])


  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([])
      return
    }
    const lower = searchText.toLowerCase()
    const filtered = subjects.filter((subj) =>
      subj.toLowerCase().includes(lower)
    )
    setSuggestions(filtered.slice(0, 10))
  }, [searchText, subjects])

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject)
    setSearchText(subject)
    setSuggestions([])
    setSelectedExam(null)
    setSelectedSlot(null)
    setSelectedYear(null)
  }

  const handleSubmit = () => {
    if (!selectedSubject || !selectedExam || !selectedSlot || !selectedYear) {
      alert("Please fill all fields before submitting")
      return
    }
    console.log({
      subject: selectedSubject,
      exam: selectedExam,
      slot: selectedSlot,
      year: selectedYear,
    })

  }

  return (
    <div className="min-h-screen bg-[#F3F5FF] dark:bg-[#070114] text-black dark:text-white px-6 py-12">
      <main>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-vipnabd text-3xl md:text-4xl font-extrabold mb-12">
            Specific Paper Request
          </h2>

          {}
          <div className="relative max-w-xl mx-auto mb-8 font-play">
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by subject..."
              className={`text-md rounded-lg bg-[#B2B8FF] px-4 py-6 pr-10 font-play tracking-wider 
                text-black shadow-sm ring-0 placeholder:text-black focus:outline-none focus:ring-0 
                dark:bg-[#7480FF66] dark:text-white placeholder:dark:text-white 
                ${suggestions.length > 0 ? "rounded-b-none" : ""}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
                   className="h-5 w-5 text-black dark:text-white" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
              </svg>
            </button>

            {suggestions.length > 0 && (
              <ul
                className={`absolute z-20 h-[250px] w-full max-w-xl overflow-y-scroll rounded-md 
                  rounded-t-none border border-t-0 bg-white text-center shadow-lg dark:bg-[#303771] 
                  ${suggestions.length > 6 ? "h-[250px]" : "h-auto"} 
                  ${suggestions.length > 10 ? "md:h-[400px]" : "md:h-auto"}`}
              >
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSubject(s)}
                    className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {}
          <div className="flex justify-center gap-4 mb-8">
            <Select
              onValueChange={setSelectedExam}
              disabled={!selectedSubject}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedSlot}
              disabled={!selectedSubject}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Slot" />
              </SelectTrigger>
              <SelectContent>
                {slots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedYear}
              disabled={!selectedSubject}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {}
          <Button
            className="px-8 py-3 rounded-lg text-base bg-[#4A55FF] hover:bg-[#3A44CC] text-white dark:bg-[#9EA8FF] dark:hover:bg-[#7D86E5] dark:text-black"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </main>
    </div>
  )
}
