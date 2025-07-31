import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { connectToDatabase } from "@/lib/mongoose";
import cloudinary from "cloudinary";
import type { CloudinaryUploadResult } from "@/interface";
import { PaperAdmin } from "@/db/papers";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const config1 = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_1,
  api_key: process.env.CLOUDINARY_API_KEY_1,
  api_secret: process.env.CLOUDINARY_SECRET_1,
};

const config2 = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_2,
  api_key: process.env.CLOUDINARY_API_KEY_2,
  api_secret: process.env.CLOUDINARY_SECRET_2,
};

const cloudinaryConfigs = [config1, config2];

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      return NextResponse.json({ message: "ServerMisconfig" }, { status: 500 });
    }
    await connectToDatabase();
    const count: number = await PaperAdmin.countDocuments();
    const configIndex = count % cloudinaryConfigs.length;
    console.log(configIndex);
    cloudinary.v2.config(cloudinaryConfigs[configIndex]);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const formData = await req.formData();
    const files: File[] = formData.getAll("files") as File[];
    const isPdf = formData.get("isPdf") === "true";

    let pdfData = "";

    if (isPdf && files.length > 0 && files[0]) {
      const pdfFile = files[0];
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfBytes);
      pdfData = pdfBuffer.toString("base64");
    } else if (files.length > 0) {
      const pdfBytes = await CreatePDF(files);
      const pdfBuffer = Buffer.from(pdfBytes);
      pdfData = pdfBuffer.toString("base64");
    }

    let finalUrl: string | undefined = "";
    let public_id_cloudinary: string | undefined = "";
    let thumbnailUrl: string | undefined = "";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 },
      );
    }

    if (!isPdf) {
      try {
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
          return;
        }

        console.log("this is happening 1");

        const mergedPdfBytes = await CreatePDF(files);
        [public_id_cloudinary, finalUrl] = await uploadPDFFile(
          mergedPdfBytes,
          uploadPreset,
        );

        console.log("this is happening 2");
      } catch (error) {
        console.error("Error creating PDF:", error);
        return NextResponse.json(
          { error: "Failed to process PDF" },
          { status: 500 },
        );
      }
    } else {
      console.log("this is happening 3");
      [public_id_cloudinary, finalUrl] = await uploadPDFFile(
        files[0]!,
        uploadPreset,
      );
    }

    const thumbnailResponse = cloudinary.v2.image(finalUrl!, {
      format: "jpg",
    });
    thumbnailUrl = thumbnailResponse
      .replace("pdf", "jpg")
      .replace("upload", "upload/w_400,h_400,c_fill")
      .replace(/<img src='|'\s*\/>/g, "");

    console.log("this is happening 4");

    const paper = new PaperAdmin({
      cloudinary_index: configIndex,
      public_id_cloudinary,
      finalUrl,
      thumbnailUrl,
      subject: null,
      slot: null,
      year: null,
      exam: null,
      semester: null,
      campus: null,
    });

    console.log("this is happening 5");
    await paper.save();
    console.log("this is happening 6");
    return NextResponse.json({ status: "success" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to upload papers", error },
      { status: 500 },
    );
  }
}

async function uploadPDFFile(file: File | ArrayBuffer, uploadPreset: string) {
  console.log("this is happening 7");
  let bytes;
  if (file instanceof File) {
    bytes = await file.arrayBuffer();
  } else {
    bytes = file;
  }
  return uploadFile(bytes, uploadPreset, "application/pdf");
}

async function uploadFile(
  bytes: ArrayBuffer,
  uploadPreset: string,
  fileType: string,
) {
  try {
    console.log("this is happening 8");
    const buffer = Buffer.from(bytes);
    console.log("this is happening 9");
    const dataUrl = `data:${fileType};base64,${buffer.toString("base64")}`;
    console.log("this is happening 10");
    const uploadResult = (await cloudinary.v2.uploader.unsigned_upload(
      dataUrl,
      uploadPreset,
    )) as CloudinaryUploadResult;
    console.log("this is happening 11");
    return [uploadResult.public_id, uploadResult.secure_url];
  } catch (e) {
    throw e;
  }
}

async function CreatePDF(orderedFiles: File[]) {
  const pdfDoc = await PDFDocument.create();

  for (const file of orderedFiles) {
    const fileBlob = new Blob([file]);
    const imgBytes = Buffer.from(await fileBlob.arrayBuffer());
    let img;
    if (file instanceof File) {
      if (file.type === "image/png") {
        img = await pdfDoc.embedPng(imgBytes);
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        img = await pdfDoc.embedJpg(imgBytes);
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
  }

  const mergedPdfBytes = await pdfDoc.save();
  return mergedPdfBytes;
}
