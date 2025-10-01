import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { connectToDatabase } from "@/lib/mongoose";
import { PaperAdmin } from "@/db/papers";
import { Storage } from "@google-cloud/storage";

interface GCPCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

// Initialize GCP Storage
const credentials: GCPCredentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ?? "{}",
) as GCPCredentials;

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentials,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET ?? "";
const bucket = storage.bucket(bucketName);

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const isPdf = formData.get("isPdf") === "true";
    const thumb = formData.get("thumbnail") as File | null;

    console.log("Received thumbnail:", thumb ? thumb.name : "NULL");


    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    let pdfBytes: ArrayBuffer;
    if (isPdf && files[0]) {
      pdfBytes = await files[0].arrayBuffer();
    } else {
      pdfBytes = await createPDFfromImages(files);
    }

    const { file_url, thumbnail_url } = await uploadToGCS(pdfBytes, thumb);

    // Save in MongoDB
    const paper = new PaperAdmin({
      file_url,
      thumbnail_url,
      subject: null,
      slot: null,
      year: null,
      exam: null,
      semester: null,
      campus: formData.get("campus"),
      ambiguous_tags: [],
    });
    await paper.save();

    return NextResponse.json(
      { status: "success", file_url, thumbnail_url },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to upload papers", error },
      { status: 500 },
    );
  }
}

async function uploadToGCS(bytes: ArrayBuffer, thumbFile?: File | null) {
  const buffer = Buffer.from(bytes);

  const pdfFilename = `papers/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.pdf`;
  await bucket.file(pdfFilename).save(buffer, {
    resumable: false,
    contentType: "application/pdf",
  });
  const file_url = `https://storage.googleapis.com/${bucketName}/${pdfFilename}`;

  let thumbnail_url: string | null = null;
  if (thumbFile) {
    const thumbBuffer = Buffer.from(await thumbFile.arrayBuffer());
    const thumbFilename = pdfFilename.replace(".pdf", ".png");
    await bucket.file(thumbFilename).save(thumbBuffer, {
      resumable: false,
      contentType: "image/png",
    });
    thumbnail_url = `https://storage.googleapis.com/${bucketName}/${thumbFilename}`;
  }

  return { file_url, thumbnail_url };
}

async function createPDFfromImages(files: File[]) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imgBytes = Buffer.from(await file.arrayBuffer());
    let img;
    if (file.type === "image/png") {
      img = await pdfDoc.embedPng(imgBytes);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      img = await pdfDoc.embedJpg(imgBytes);
    } else continue;

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const mergedPdfBytes = await pdfDoc.save();
  const ab = new ArrayBuffer(mergedPdfBytes.byteLength);
  new Uint8Array(ab).set(mergedPdfBytes);
  return ab;
}

export const runtime = "nodejs"; 
