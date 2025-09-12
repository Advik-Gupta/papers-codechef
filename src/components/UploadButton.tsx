"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function UploadThingDropzone() {
  return (
    <div className="flex flex-col items-center">
      <UploadDropzone<OurFileRouter, "pdfUploader">
        endpoint="pdfUploader"
        appearance={{
          container:
            "w-[600px] border-2 border-white/30 rounded-xl p-10 bg-transparent flex flex-col items-center justify-center text-center",
          label: "text-gray-200 text-lg font-medium",
          allowedContent: "text-gray-500 text-sm mt-2",
          button:
            "bg-[#1a083d] hover:bg-[#2b1060] text-gray-200 rounded-full px-10 py-3 text-base font-medium transition-colors mt-6",
        }}
        content={{
          label: (
            <span>
              Drag 'n' drop some files here, or{" "}
              <span className="text-purple-400 underline">click</span> to select
              files
            </span>
          ),
          allowedContent: "Only Images and PDF are allowed*",
          button: "Upload",
        }}
        onClientUploadComplete={(res) => {
          console.log("Upload complete:", res);
          alert("PDF uploaded and saved to Mongo!");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR: ${error.message}`);
        }}
      />

      <p className="mt-4 max-w-[600px] text-center text-sm text-gray-400">
        Note: Uploaded papers are first reviewed by our team before appearing on
        the website. If your paper doesn't show up immediately, please be
        patient, it's likely still under review.
      </p>

      <p className="mt-2 text-xs text-gray-500">Pdf (4MB)</p>
    </div>
  );
}
