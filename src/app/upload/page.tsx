"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { handleAPIError } from "../../util/error";
import { Button } from "@/components/ui/button";

import { type APIResponse } from "@/interface";
import Dropzone from "react-dropzone";

const Page = () => {
  const [campus, setCampus] = useState("Vellore");

  const [files, setFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [, setResetSearch] = useState(false);
  function fileCheckAndSelect<T extends File>(acceptedFiles: T[]) {
    const maxFileSize = 5 * 1024 * 1024;
    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    const toastId = toast.loading("uploading your files");
    if (!acceptedFiles || acceptedFiles.length === 0) {
      toast.error("No files selected", {
        id: toastId,
      });
      return;
    }

    if (acceptedFiles.length > 5) {
      toast.error("More than 5 files selected", {
        id: toastId,
      });
      return;
    }

    // File validations
    const invalidFiles = acceptedFiles.filter(
      (file) =>
        file.size > maxFileSize || !allowedFileTypes.includes(file.type),
    );
    if (invalidFiles.length > 0) {
      toast.error(
        `Some files are invalid. Ensure each file is below 5MB and of an allowed type (PDF, JPEG, PNG, GIF).`,
        {
          id: toastId,
        },
      );
      return;
    }

    const isPdf = acceptedFiles.reduce(
      (reducer, file) => file.type === "application/pdf" || reducer,
      false,
    );
    if (isPdf && acceptedFiles.length > 1) {
      toast.error("PDFs must be uploaded separately", {
        id: toastId,
      });
      return;
    }

    const orderedFiles = acceptedFiles.sort((a, b) => {
      return a.lastModified - b.lastModified;
    });
    setFiles(orderedFiles);
    toast.success(`${orderedFiles.length} files selected!`, {
      id: toastId,
    });
  }
  const handlePrint = async () => {
    if (!campus) {
      setCampus("Vellore");
    }

    const isPdf = files.length === 1 && files[0]?.type === "application/pdf";

    // Prepare FormData
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // formData.append("exam", exam);
    formData.append("campus", campus);

    formData.append("isPdf", String(isPdf));

    setIsUploading(true);

    try {
      await toast.promise(
        async () => {
          try {
            await axios.post<APIResponse>("/api/ai-upload", formData);
          } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
              const errorData = error.response.data as APIResponse;
              const errorMessage =
                errorData.message || "Failed to upload papers";
              throw new Error(errorMessage);
            }
            throw new Error("Failed to upload papers");
          }
        },
        {
          loading: "Uploading papers...",
          success: "Papers uploaded successfully!",
          error: (error: Error) => {
            return error.message;
          },
        },
      );

      // setSlot("");
      // setSubject("");
      // setExam("");
      // setYear("");
      setFiles([]);
      setResetSearch(true);
      setTimeout(() => setResetSearch(false), 100);
    } catch (error) {
      handleAPIError(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center play">
      <div className="2xl:my-15 flex flex-col items-center ">
        <fieldset className="mb-4 w-full max-w-md rounded-lg border-2 border-gray-300 pr-8 p-4 ">
          {/* <legend className="text-lg font-bold">Upload papers</legend> */}

          <div className="flex w-full flex-col 2xl:gap-y-4">
            {/* File Dropzone */}
            <div>
              <Dropzone onDrop={fileCheckAndSelect}>
                {({ getRootProps, getInputProps }) => (
                  <section className="my-2 -mr-2 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>
                        Drag &apos;n&apos; drop some files here, or{" "}
                        <span className="text-[#6D28D9]">click</span> to select
                        files
                      </p>
                    </div>
                    <div
                      className={`mt-2 text-xs ${
                        files?.length === 0 ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {files?.length || 0} files selected
                    </div>
                  </section>
                )}
              </Dropzone>
              <label className="mx-2 -mr-2 block text-center text-xs font-medium text-gray-700">
                Only Images and PDF are allowed
                <sup className="text-red-500">*</sup>
              </label>
            </div>
          </div>
        </fieldset>
        <Button
          onClick={handlePrint}
          disabled={isUploading}
          className={`w-fit rounded-md px-4 text-xl py-3 ${isUploading ? "bg-gray-300" : ""}`}
        >
          {isUploading ? "Uploading..." : "Upload Papers"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
