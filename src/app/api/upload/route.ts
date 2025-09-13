import { NextResponse } from "next/server";
import { utapi } from "@/util/utapiClient";
import { UTFile } from "uploadthing/server";
import { connectToDatabase } from "@/lib/mongoose";
import { PaperAdmin } from "@/db/papers";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const rawFiles = form.getAll("files") ?? [];

    if (!rawFiles || rawFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 },
      );
    }

    const campus = (form.get("campus") as string) ?? "Vellore";
    const isPdf = (form.get("isPdf") as string) === "true";

    const files: File[] = rawFiles.filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 },
      );
    }

    const firstFile = files[0]!;

    let pdfData: string | null = null;

    if (isPdf) {
      const pdfBytes = await firstFile.arrayBuffer();
      pdfData = Buffer.from(pdfBytes).toString("base64");
    } else {
      const pdfBytes = await createPDFfromImages(files);
      pdfData = Buffer.from(pdfBytes).toString("base64");
    }

    await connectToDatabase();

    const responses = await utapi.uploadFiles(
      pdfData
        ? [
            new UTFile(
              [Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0))],
              `merged-${Date.now()}.pdf`,
            ),
          ]
        : [],
    );

    const savedDocs = [];
    for (const r of responses) {
      if (r.data?.url) {
        const doc = await PaperAdmin.create({
          final_url: r.data.url,
          thumbnail_url: null,
          subject: null,
          slot: null,
          year: null,
          exam: null,
          semester: null,
          campus,
          ambiguous_tags: [],
          isPdf,
        });
        savedDocs.push(doc);
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: responses,
      savedCount: savedDocs.length,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

async function createPDFfromImages(orderedFiles: File[]) {
  const pdfDoc = await PDFDocument.create();

  for (const file of orderedFiles) {
    const fileBytes = await file.arrayBuffer();
    let img;
    if (file.type === "image/png") {
      img = await pdfDoc.embedPng(fileBytes);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      img = await pdfDoc.embedJpg(fileBytes);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });
  }

  return pdfDoc.save();
}
