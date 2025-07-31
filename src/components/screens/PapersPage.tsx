"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exams, slots, years } from "@/components/select_options"
import { Input } from "@/components/ui/input"
import axios from "axios"
import Fuse from "fuse.js"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function PapersPage() {
    const [subjects, setSubjects] = useState<string[]>([])
    const [searchText, setSearchText] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [selectedExam, setSelectedExam] = useState<string | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const suggestionsRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        async function fetchSubjects() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/course-list`)
                const names = response.data.map((course: any) => course.name || course.courseName || course.title)
                setSubjects(names)
            } catch (err) {
                console.error("Error fetching subjects:", err)
            }
        }
        fetchSubjects()
    }, [])

    const fuse = useMemo(() => new Fuse(subjects, { includeScore: true, threshold: 0.3 }), [subjects])

    useEffect(() => {
        if (!searchText.trim()) {
            setSuggestions([])
            return
        }

        if (selectedSubject && searchText === selectedSubject) {
            setSuggestions([])
            return
        }

        const results = fuse.search(searchText)
        setSuggestions(results.map(r => r.item).slice(0, 10))
    }, [searchText, fuse, selectedSubject])


    const handleSelectSubject = (subject: string) => {
        setSelectedSubject(subject)
        setSearchText(subject)
        setSuggestions([])
        setSelectedExam(null)
        setSelectedSlot(null)
        setSelectedYear(null)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setSuggestions([])
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSubmit = () => {
        if (!selectedSubject || !selectedExam || !selectedSlot || !selectedYear) {
            alert("Please fill all fields before submitting")
            return
        }
        console.log({ subject: selectedSubject, exam: selectedExam, slot: selectedSlot, year: selectedYear })
    }

    return (
        <div className="min-h-screen bg-[#F3F5FF] dark:bg-[#070114] text-black dark:text-white px-6 py-12">
            <main>
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="font-vipnabd text-3xl md:text-4xl font-extrabold mb-12">Specific Paper Request</h2>

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
                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                        </button>
                        {suggestions.length > 0 && (
                            <ul ref={suggestionsRef} className="absolute z-20 max-h-[250px] w-full max-w-xl overflow-y-auto rounded-md rounded-t-none border border-t-0 bg-white text-center shadow-lg dark:bg-[#303771]">
                                {suggestions.map((s, idx) => (
                                    <li key={idx} onClick={() => handleSelectSubject(s)} className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        <Select onValueChange={setSelectedExam} disabled={!selectedSubject}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Exam" /></SelectTrigger>
                            <SelectContent>{exams.map((exam) => <SelectItem key={exam} value={exam}>{exam}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedSlot} disabled={!selectedSubject}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Slot" /></SelectTrigger>
                            <SelectContent>{slots.map((slot) => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedYear} disabled={!selectedSubject}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Year" /></SelectTrigger>
                            <SelectContent>
                                {[...years].sort((a, b) => Number(b) - Number(a)).map((year) => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>

                        </Select>
                    </div>

                    <Button className="px-8 py-3 rounded-lg text-base bg-[#4A55FF] hover:bg-[#3A44CC] text-white dark:bg-[#9EA8FF] dark:hover:bg-[#7D86E5] dark:text-black" onClick={handleSubmit}>Submit</Button>
                </div>

                { }
                <div className="max-w-6xl mx-auto mt-16 text-center">
                    <div className="relative mb-8 text-center">
                        <h3 className="font-vipnabd text-2xl font-bold">Explore More</h3>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                View All
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="bg-white dark:bg-[#303771] rounded-lg overflow-hidden shadow-md">
                                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 relative">
                                    <Image
                                        src="/placeholder.svg?height=200&width=300&text=Paper"
                                        alt={`Paper ${index}`}
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-[#4A55FF]/20 dark:bg-[#9EA8FF]/20 text-[#4A55FF] dark:text-[#9EA8FF] px-2 py-1 rounded text-xs">C1</span>
                                        <span className="bg-[#4A55FF]/20 dark:bg-[#9EA8FF]/20 text-[#4A55FF] dark:text-[#9EA8FF] px-2 py-1 rounded text-xs">CAT-1</span>
                                        <span className="bg-[#4A55FF]/20 dark:bg-[#9EA8FF]/20 text-[#4A55FF] dark:text-[#9EA8FF] px-2 py-1 rounded text-xs">2024</span>
                                        <span className="bg-[#4A55FF]/20 dark:bg-[#9EA8FF]/20 text-[#4A55FF] dark:text-[#9EA8FF] px-2 py-1 rounded text-xs">Fall</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
