import { NextResponse } from "next/server";
import { utapi } from "@/util/utapiClient";
import { connectToDatabase } from "@/lib/mongoose";
import { PaperAdmin } from "@/db/papers";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const rawFiles = form.getAll("files") ?? [];

    if (rawFiles.length === 0) {
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
        { success: false, message: "No valid files provided" },
        { status: 400 },
      );
    }

    let finalFile: File;
    let filename: string;

    if (isPdf) {
      finalFile = files[0]!;
      filename = finalFile.name;
    } else {
      finalFile = await createPDFfromImages(files);
      filename = "merged.pdf" + Date.now();
    }

    const responses = await utapi.uploadFiles([finalFile]);

    await connectToDatabase();

    const savedDocs = [];
    for (const r of responses) {
      if (r.data?.url && r.data?.key) {
        const doc = await PaperAdmin.create({
          final_url: r.data.url,
          uploadthing_key: `${r.data.key}_${filename}`,
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

async function createPDFfromImages(files: File[]): Promise<File> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
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

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes], "combined.pdf", { type: "application/pdf" });
}
