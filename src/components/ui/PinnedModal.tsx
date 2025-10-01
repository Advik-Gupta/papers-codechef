"use client";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SearchBar from "@/components/Searchbar/searchbar";
import { type IUpcomingPaper } from "@/interface";
import { StoredSubjects } from "@/interface";
import { useState, useEffect } from "react";
import { Pin, PinOff } from "lucide-react";
import { Plus } from "lucide-react";

const PinnedModal = ({triggerName = "Pin Subjects", page = "Navbar"} : {triggerName? : string, page? : string}) => {
  const [displayPapers, setDisplayPapers] = useState<IUpcomingPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const storedSubjects = JSON.parse(
        localStorage.getItem("userSubjects") ?? "[]",
      ) as StoredSubjects;

      const response = await axios.post<{ subject: string; slots: string[] }[]>(
        "/api/user-papers",
        storedSubjects,
      );

      const fetchedPapers = response.data;

      const fetchedSubjectsSet = new Set(
        fetchedPapers.map((paper) => paper.subject),
      );

      const storedSubjectsArray = Array.isArray(storedSubjects)
        ? storedSubjects
        : [];
      const missingSubjects = storedSubjectsArray
        .filter((subject: string) => !fetchedSubjectsSet.has(subject))
        .map((subject: string) => ({
          subject,
          slots: [],
        })) as { subject: string; slots: string[] }[];

      const allDisplayPapers = [...fetchedPapers, ...missingSubjects];

      setDisplayPapers(allDisplayPapers);
    } catch (error) {
      console.error("Failed to fetch papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unpinSubject = (subjectToRemove: string) => {
    const updatedSubjects = (JSON.parse(localStorage.getItem("userSubjects") ?? "[]") as string[]).filter(
      (subj) => subj !== subjectToRemove
    );
    localStorage.setItem("userSubjects", JSON.stringify(updatedSubjects));
    setDisplayPapers((prev) => prev.filter((paper) => paper.subject !== subjectToRemove));
    window.dispatchEvent(new Event("userSubjectsChanged"));
    window.dispatchEvent(new Event("updatePapers"));
  };

  useEffect(() => {
    void fetchPapers();
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        void fetchPapers();
      }else{
        window.dispatchEvent(new Event("userSubjectsChanged"));
        window.dispatchEvent(new Event("updatePapers"));
      }
    }}>
      {page === "Navbar" ? 
      <DialogTrigger className="flex flex-row gap-2 items-center h-full w-full">
        <Pin size={16}/>
        {triggerName}
      </DialogTrigger> :
      <DialogTrigger className="flex flex-row gap-2 items-center h-full w-full justify-center">
        <Plus className="font-extrabold"/>
        {triggerName}
      </DialogTrigger>
      }
      <DialogContent className="bg-[#F3F5FF] dark:bg-[#070114] border-[#3A3745]">
        <DialogHeader>
          <DialogTitle>Quick Access to This Semester&apos;s Subjects</DialogTitle>
          <DialogTitle className="font-normal">
            <div className="my-3 flex w-full flex-col items-center gap-2 text-sm">
              <div className="w-full">
                <SearchBar type="pinned" setDisplayPapers={setDisplayPapers}/>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-64 w-full overflow-y-auto border border-[#3A3745] rounded-md p-2">
                {displayPapers.length > 0 ? (
                  displayPapers.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-[#3A3745] px-4 py-2 mb-2 shadow-sm"
                    >
                      <span className="text-sm font-medium">{item.subject}</span>
                      <button
                        onClick={() => unpinSubject(item.subject)}
                        className="text-red-700 hover:text-red-600 dark:text-red-600 dark:hover:text-red-500"
                      >
                        <div className="flex gap-2 text-sm items-center">
                          Unpin
                          <PinOff size={16}/>
                        </div>
                        
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center justify-center items-center text-sm text-gray-500 mt-2">Start pinning subjects for quick and easy access.</p>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PinnedModal