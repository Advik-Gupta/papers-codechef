import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Paper from "@/db/papers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const subjects: string[] = body;

    const usersPapers = await Paper.find({
      subject: { $in: subjects },
    });

    let transformedPapers = usersPapers.map((paper) => ({
      subject: paper.subject,
      slots: [paper.slot],
    }));

    // check duplicates
    transformedPapers = Array.from(
      new Map(transformedPapers.map((item) => [item.subject, item])).values(),
    );

    console.log("usersPapers", usersPapers);

    return NextResponse.json(transformedPapers, {
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
