"use client";

import { useState } from "react";
import { FaFlag } from "react-icons/fa6";
import { Button } from "./ui/button";
import ReportTagModal from "./ReportTagModal";

export default function ReportButton({ 
  paperId, subject, exam, slot, year 
}: {
  paperId: string;
  subject?: string;
  exam?: string;
  slot?: string;
  year?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-10 w-10 rounded p-0 text-white transition hover:bg-red-600 bg-red-500"
      >
        <FaFlag className="text-sm" />
      </Button>

      <ReportTagModal
        paperId={paperId}
        subject={subject}
        exam={exam}
        slot={slot}
        year={year}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
