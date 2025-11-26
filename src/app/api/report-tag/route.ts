import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import TagReport from "@/db/tagReport";

const ipCounters = new Map<string, { count: number; resetAt: number }>();
const IP_LIMIT = 3; // tesing purpose ->> 3 reports/per IP/ per paper/ per hour
const IP_WINDOW_MS = 1000 * 60 * 60;

const ALLOWED_EXAMS = [
  "CAT-1",
  "CAT-2",
  "FAT",
];
const ALLOWED_FIELDS = [
  "subject",
  "courseCode",
  "exam",
  "slot",
  "year",
];

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0] ?? forwarded;
    return first.trim();
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  try {
    const url = new URL(req.url);
    return url.hostname || "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = (await req.json()) as {
      paperId?: string;
      reportedFields?: { field: string; value?: string }[];
      comment?: string;
      reporterEmail?: string;
      reporterId?: string;
    };

    const { paperId } = body;
    if (!paperId)
      return NextResponse.json(
        { error: "paperId is required" },
        { status: 400 },
      );

    const ip = getClientIp(req);
    const key = `${ip}::${paperId}`;
    const now = Date.now();
    const entry = ipCounters.get(key);
    if (entry && entry.resetAt > now) {
      if (entry.count >= IP_LIMIT)
        return NextResponse.json(
          { error: "Rate limit exceeded for reporting." },
          { status: 429 },
        );
      entry.count += 1;
    } else {
      ipCounters.set(key, { count: 1, resetAt: now + IP_WINDOW_MS });
    }

    const existingCount = await TagReport.countDocuments({ paperId });
    const MAX_REPORTS_PER_PAPER = 2;        // for testing purpose kept it to be 2 !!
    if (existingCount >= MAX_REPORTS_PER_PAPER)
      return NextResponse.json(
        { error: "Received many reports; we are currently working on it." },
        { status: 429 },
      );

    const reportedFields = (body.reportedFields ?? [])
      .map((r) => ({ field: String(r.field).trim(), value: r.value?.trim() }))
      .filter((r) => r.field);

    for (const rf of reportedFields) {
      if (!ALLOWED_FIELDS.includes(rf.field)) {
        return NextResponse.json(
          { error: `Invalid field: ${rf.field}` },
          { status: 400 },
        );
      }
      if (rf.field === "exam" && rf.value) {
        if (!ALLOWED_EXAMS.includes(rf.value))
          return NextResponse.json(
            { error: `Invalid exam value: ${rf.value}` },
            { status: 400 },
          );
      }
      if (rf.field === "year" && rf.value) {
  const val = rf.value.trim();

  const rangeMatch = val.match(/^(\d{4})[-/](\d{4})$/);

  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    if (
      start < 1900 || start > 2100 ||
      end < 1900 || end > 2100 ||
      end < start
    ) {
      return NextResponse.json(
        { error: `Invalid year range: ${rf.value}` },
        { status: 400 }
      );
    }
    continue;
  }
}

    }

    const newReport = await TagReport.create({
      paperId,
      reportedFields,
      comment: body.comment,
      reporterEmail: body.reporterEmail,
      reporterId: body.reporterId,
    });

    return NextResponse.json(
      { message: "Report submitted.", report: newReport },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to submit tag report." },
      { status: 500 },
    );
  }
}
