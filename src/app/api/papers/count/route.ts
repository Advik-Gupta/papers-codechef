import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Paper from "@/db/papers";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    const filter = subject ? { subject } : {};
    const count = await Paper.countDocuments(filter);

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch papers", error },
      { status: 500 },
    );
  }
}
