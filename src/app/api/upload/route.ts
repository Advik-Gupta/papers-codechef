// app/api/save-pdf/route.ts
import { connectToDatabase } from "@/lib/mongoose";
import { PaperAdmin } from "@/db/papers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    await connectToDatabase();

    await PaperAdmin.create({
      final_url: url,
      thumbnail_url: null,
      subject: null,
      slot: null,
      year: null,
      exam: null,
      semester: null,
      campus: null,
      ambiguous_tags: [],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
