"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaFlag } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/multi-select";
import axios from "axios";
import toast from "react-hot-toast";

interface ReportTagModalProps {
  paperId: string;
  subject?: string;
  exam?: string;
  slot?: string;
  year?: string;
  toolbarStyle?: boolean;
  open?: boolean;
  setOpen?: (v: boolean) => void;
}

const ReportTagModal = ({
  paperId,
  subject,
  exam,
  slot,
  year,
  toolbarStyle = false,
  open,
  setOpen,
}: ReportTagModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && setOpen !== undefined;

  const modalOpen = isControlled ? open! : internalOpen;
  const modalSetOpen = isControlled ? setOpen! : setInternalOpen;
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryValues, setCategoryValues] = useState<Record<string, string>>(
    {},
  );
  const [originalCategoryValues, setOriginalCategoryValues] = useState<
    Record<string, string>
  >({});
  const [originalComment, setOriginalComment] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const SCROLL_THRESHOLD = 4;
  const contentClass = `bg-[#F3F5FF] dark:bg-[#070114] border-[#3A3745] items-start sm:max-w-3xl w-full ${
    selectedCategories.length > SCROLL_THRESHOLD
      ? "max-h-[70vh] overflow-y-auto"
      : ""
  }`;

  const isDirty = useMemo(() => {
    if (selectedCategories.length === 0) return false;
    for (const c of selectedCategories) {
      const curr = (categoryValues[c] || "").trim();
      const orig = (originalCategoryValues[c] || "").trim();
      if (curr !== orig) return true;
    }

    if (selectedCategories.includes("subject")) {
      const currCode = (categoryValues["courseCode"] || "").trim();
      const origCode = (originalCategoryValues["courseCode"] || "").trim();
      if (currCode !== origCode) return true;
    }

    return false;
  }, [selectedCategories, categoryValues, originalCategoryValues]);

  useEffect(() => {
    for (const c of selectedCategories) {
      if (categoryValues[c]) continue;
      if (c === "subject" && subject) {
        const m = subject.match(/^(.*)\s*\[([^\]]+)\]\s*$/);
        if (m?.[1] && m?.[2]) {
          const name = m[1].trim();
          const code = m[2].trim();
          setCategoryValues((s) => ({ ...s, subject: name, courseCode: code }));
        } else {
          setCategoryValues((s) => ({ ...s, subject }));
        }
      } else if (c === "exam" && exam)
        setCategoryValues((s) => ({ ...s, [c]: exam }));
      else if (c === "slot" && slot)
        setCategoryValues((s) => ({ ...s, [c]: slot }));
      else if (c === "year" && year)
        setCategoryValues((s) => ({ ...s, [c]: year }));
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (open) {
      const base: Record<string, string> = {};
      if (subject) {
        const m = subject.match(/^(.*)\s*\[([^\]]+)\]\s*$/);
        if (m?.[1] && m?.[2]) {
          base["subject"] = m[1].trim();
          base["courseCode"] = m[2].trim();
        } else {
          base["subject"] = subject;
        }
      }
      if (exam) base["exam"] = exam;
      if (slot) base["slot"] = slot;
      if (year) base["year"] = year;
      setOriginalCategoryValues(base);
      setOriginalComment("");
      setOriginalEmail("");
    } else {
      setSelectedCategories([]);
      setCategoryValues({});
      setComment("");
      setEmail("");
      setOriginalCategoryValues({});
      setOriginalComment("");
      setOriginalEmail("");
    }
  }, [open, subject, exam, slot, year]);

  const handleSubmit = async () => {
  if (!paperId) {
    toast.error("Missing paper id.");
    return;
  }

  if (selectedCategories.includes("slot")) {
    const v = (categoryValues.slot || "").trim();
    const slotRegex = /^[A-G][1-2]$/;
    if (!slotRegex.test(v)) {
      toast.error("Slot must be from A1 to G2 (e.g., D1, B2).");
      return;
    }
  }

  if (selectedCategories.includes("year")) {
    const y = (categoryValues.year || "").trim();
    const yearRegex = /^\d{4}(-\d{4})?$/;
    if (!yearRegex.test(y)) {
      toast.error("Year must be a valid format (e.g., 2024 or 2024-2025).");
      return;
    }
  }

  const reportedFields: { field: string; value?: string }[] = [];

  for (const c of selectedCategories) {
    if (c === "subject") {
      const newSub = (categoryValues.subject || "").trim();
      const oldSub = (originalCategoryValues.subject || "").trim();

      if (newSub !== oldSub) {
        reportedFields.push({ field: "subject", value: newSub });
      }

      const newCode = (categoryValues.courseCode || "").trim();
      const oldCode = (originalCategoryValues.courseCode || "").trim();

      if (newCode !== oldCode) {
        reportedFields.push({ field: "courseCode", value: newCode });
      }

      continue;
    }

    const newVal = (categoryValues[c] || "").trim();
    const oldVal = (originalCategoryValues[c] || "").trim();

    if (newVal !== oldVal) {
      reportedFields.push({ field: c, value: newVal });
    }
  }

  if (reportedFields.length === 0) {
    toast.error("You haven’t changed anything to report.");
    return;
  }

  setLoading(true);
  try {
    await toast.promise(
      axios.post("/api/report-tag", {
        paperId,
        reportedFields,
        comment,
        reporterEmail: email || undefined,
      }),
      {
        loading: "Submitting report...",
        success: "Reported successfully. Thank you — we will work on that.",
        error: "Failed to submit report.",
      },
    );

    modalSetOpen(false);
    setComment("");
    setEmail("");
    setSelectedCategories([]);
    setCategoryValues({});
  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.error || "Failed to submit report.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={modalOpen} onOpenChange={modalSetOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <button className="rounded-full border border-red-300 p-2 text-red-500 transition hover:border-red-500 hover:text-red-600 hover:shadow-[0_0_8px_rgba(255,0,0,0.4)]">
            <FaFlag className="text-sm" />
          </button>
        </DialogTrigger>
      )}

      <DialogContent className={contentClass}>
        <DialogHeader>
          <DialogTitle>Report Wrong Tags</DialogTitle>
          <DialogDescription>
            Help us improve tagging — suggest correct tags and add an optional
            comment.
          </DialogDescription>
          <FaFlag className="text-lg" aria-hidden="true" />
        </DialogHeader>

        <div className="mt-4 w-full space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Which fields are wrong? (select one or more)
            </label>
            <MultiSelect
              options={[
                { label: "Subject", value: "subject" },
                { label: "Exam", value: "exam" },
                { label: "Slot", value: "slot" },
                { label: "Year", value: "year" },
              ]}
              onValueChange={(vals) => setSelectedCategories(vals)}
              defaultValue={[]}
              placeholder="Select fields"
            />
          </div>

          {selectedCategories.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Correct values (optional)
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedCategories.map((c) => {
                  if (c === "subject") {
                    return (
                      <div key={c} className="w-full">
                        <label className="mb-1 block text-sm">
                          Subject name
                        </label>
                        <Input
                          value={categoryValues["subject"] ?? ""}
                          onChange={(e) =>
                            setCategoryValues((s) => ({
                              ...s,
                              subject: e.target.value,
                            }))
                          }
                          placeholder="Subject name"
                          className="mb-2 w-full"
                        />
                        <label className="mb-1 block text-sm">
                          Course code (optional)
                        </label>
                        <Input
                          value={categoryValues["courseCode"] ?? ""}
                          onChange={(e) =>
                            setCategoryValues((s) => ({
                              ...s,
                              courseCode: e.target.value,
                            }))
                          }
                          placeholder="e.g. BMAT205L"
                          className="w-full"
                        />
                      </div>
                    );
                  } else if (c == "exam") {
                    return (
                      <div key={c} className="w-full">
                        <label className="mb-1 block text-sm capitalize">
                          Exam
                        </label>

                        <select
                          value={categoryValues["exam"] ?? ""}
                          onChange={(e) =>
                            setCategoryValues((s) => ({
                              ...s,
                              exam: e.target.value,
                            }))
                          }
                          className="w-full rounded border bg-white p-2 dark:bg-[#1f1f2a]"
                        >
                          <option value="CAT-1">CAT-1</option>
                          <option value="CAT-2">CAT-2</option>
                          <option value="FAT">FAT</option>
                        </select>
                      </div>
                    );
                  } else if (c == "slot") {
                    return (
                      <div key={c} className="w-full">
                        <label className="mb-1 block text-sm capitalize">
                          Slot
                        </label>
                        <Input
                          value={categoryValues[c] ?? ""}
                          maxLength={2}
                          onChange={(e) => {
                            let v = e.target.value.toUpperCase();
                            v = v.replace(/[^A-Z0-9]/g, "");

                            setCategoryValues((s) => ({ ...s, slot: v }));
                          }}
                          placeholder="e.g. D1"
                          className="w-full"
                        />
                      </div>
                    );
                  }
                  else if(c=="year"){
                    return (
    <div key={c} className="w-full">
      <label className="mb-1 block text-sm capitalize">Year</label>
      <Input
        value={categoryValues[c] ?? ""}
        onChange={(e) =>
          setCategoryValues((s) => ({ ...s, year: e.target.value }))
        }
        placeholder="e.g. 2024-2025"
        className="w-full"
      />
    </div>
  );
                  }
                  return (
                    <div key={c} className="w-full">
                      <label className="mb-1 block text-sm capitalize">
                        {c}
                      </label>
                      <Input
                        value={categoryValues[c] ?? ""}
                        onChange={(e) =>
                          setCategoryValues((s) => ({
                            ...s,
                            [c]: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Comment (optional)
            </label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Short note"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Your email (optional)
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!isDirty || loading}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportTagModal;
