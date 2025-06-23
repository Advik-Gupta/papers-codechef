import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Paper from "@/db/papers";

export const dynamic = "force-dynamic";

interface TransformedPaper {
  subject: string;
  slots: string[];
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const subjects: string[] = await req.json() as string[];

    const usersPapers = await Paper.find({
      subject: { $in: subjects },
    });

    const transformedPapers = usersPapers.reduce<TransformedPaper[]>((acc, paper) => {
      const existing = acc.find((item) => item.subject === paper.subject);

      if (existing) {
        existing.slots.push(paper.slot);
      } else {
        acc.push({ subject: paper.subject, slots: [paper.slot] });
      }

      return acc;
    }, []);

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
