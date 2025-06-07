import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UpcomingSlot from "@/db/upcoming-slot";
import UpcomingSubject from "@/db/upcoming-paper";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const upcomingSlot = await UpcomingSlot.find();
    const slot = upcomingSlot[0]?.slot;
    if (!slot) {
      return NextResponse.json(
        {
          message: "No slot found.",
        },
        { status: 404 },
      );
    }
    const nextSlot = String.fromCharCode(slot.charCodeAt(0) + 1);
    const correspondingSlots = [
      slot + "1",
      slot + "2",
      nextSlot + "1",
      nextSlot + "2",
    ];
    const selectedSubjects = await UpcomingSubject.find({
      slots: { $in: correspondingSlots },
    });
    if (selectedSubjects.length === 0) {
      return NextResponse.json(
        {
          message: "No selected papers found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(selectedSubjects, {
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
