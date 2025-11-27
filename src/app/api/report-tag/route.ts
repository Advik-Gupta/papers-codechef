import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import TagReport from "@/db/tagReport";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/utils/redis";

const ALLOWED_EXAMS = ["CAT-1", "CAT-2", "FAT"];
const ALLOWED_FIELDS = ["subject", "courseCode", "exam", "slot", "year"];

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),//per id - 3 request - per hour
  analytics: true,
});

function getClientIp(req: any): string {
  return req.ip || "127.0.0.1";
}

export async function POST(req: Request & { ip?: string }) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { paperId } = body;

    if (!paperId) {
      return NextResponse.json(
        { error: "paperId is required" },
        { status: 400 }
      );
    }
    const ip = getClientIp(req);
    const key = `${ip}::${paperId}`;
    const { success } = await ratelimit.limit(key);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded for reporting." },
        { status: 429 }
      );
    }
    const MAX_REPORTS_PER_PAPER = 5; 
    const count = await TagReport.countDocuments({ paperId });

    if (count >= MAX_REPORTS_PER_PAPER) {
      return NextResponse.json(
        { error: "Received many reports; we are currently working on it." },
        { status: 429 }
      );
    }
    const reportedFields = (body.reportedFields ?? [])
      .map((r: any) => ({
        field: String(r.field).trim(),
        value: r.value?.trim(),
      }))
      .filter((r: any) => r.field);

    for (const rf of reportedFields) {
      if (!ALLOWED_FIELDS.includes(rf.field)) {
        return NextResponse.json(
          { error: `Invalid field: ${rf.field}` },
          { status: 400 }
        );
      }
      if (rf.field === "exam" && rf.value) {
        if (!ALLOWED_EXAMS.includes(rf.value)) {
          return NextResponse.json(
            { error: `Invalid exam value: ${rf.value}` },
            { status: 400 }
          );
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
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to submit tag report." },
      { status: 500 }
    );
  }
}
