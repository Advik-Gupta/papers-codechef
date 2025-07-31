import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Paper from "@/db/papers";
import { StoredSubjects } from "@/interface";

export const dynamic = "force-dynamic";

interface TransformedPaper {
  subject: string;
  slots: string[];
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const subjects = (await req.json()) as StoredSubjects;

    const usersPapers = await Paper.find({
      subject: { $in: subjects },
    });

    const transformedPapers = usersPapers.reduce(
      (acc: { subject: string; slots: string[] }[], paper) => {
        const existing = acc.find((item) => item.subject === paper.subject);

        if (existing) {
          existing.slots.push(paper.slot);
        } else {
          acc.push({ subject: paper.subject, slots: [paper.slot] });
        }

        return acc;
      },
      [],
    );

    const seenSubjects = new Set();
    const uniquePapers = transformedPapers.filter((paper) => {
      if (seenSubjects.has(paper.subject)) return false;
      seenSubjects.add(paper.subject);
      return true;
    });

    return NextResponse.json(uniquePapers, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch papers.",
      },
      { status: 500 },
    );
  }
}
