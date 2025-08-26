"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { FiTrash, FiX } from "react-icons/fi";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface APIResponse {
  status: string;
  message?: string;
}

export default function Page() {
  const campus = "Vellore";
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    const onDragEnter = () => setIsGlobalDragging(true);
    const onDragLeave = () => setIsGlobalDragging(false);
    const onDrop = () => setIsGlobalDragging(false);

    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [previews]);

  const fileCheckAndSelect = useCallback(
    (acceptedFiles: File[]) => {
      const maxFileSize = 5 * 1024 * 1024;
      const allowedFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      const toastId = toast.loading("Uploading your files...");
      if (!acceptedFiles || acceptedFiles.length === 0) {
        toast.error("No files selected", { id: toastId });
        return;
      }

      const isNewPdf = acceptedFiles.some(
        (file) => file.type === "application/pdf",
      );
      // const isExistingPdf = files.some((file) => file.type === 'application/pdf');

      if (
        (isNewPdf && acceptedFiles.length > 1) ||
        (isNewPdf && files.length > 0)
      ) {
        toast.error("PDFs must be uploaded separately", { id: toastId });
        return;
      }

      const allFiles = [...files, ...acceptedFiles];
      if (allFiles.length > 5) {
        toast.error("You can upload up to 5 files only", { id: toastId });
        return;
      }

      const invalidFiles = acceptedFiles.filter(
        (file) =>
          file.size > maxFileSize || !allowedFileTypes.includes(file.type),
      );

      if (invalidFiles.length > 0) {
        toast.error(
          "Some files are invalid. Make sure each is under 5MB and of allowed types (PDF, JPEG, PNG, GIF).",
          { id: toastId },
        );
        return;
      }

      const newPreviews = acceptedFiles.map((file, idx) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${idx}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);

      toast.success(`${acceptedFiles.length} file(s) added!`, { id: toastId });
    },
    [files],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      fileCheckAndSelect(acceptedFiles);
    },
    [fileCheckAndSelect],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function SortablePreview({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      //zIndex: 50,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

  const handleDndKitDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = previews.findIndex((item) => item.id === active.id);
      const newIndex = previews.findIndex((item) => item.id === over.id);

      const newFiles = arrayMove(
        previews.map((p) => p.file),
        oldIndex,
        newIndex,
      );

      previews.forEach((item) => URL.revokeObjectURL(item.preview));
      const newPreviews = newFiles.map((file, idx) => ({
        id: `${file.name}-${file.lastModified}-${idx}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const handleDelete = (index: number) => {
    const deletedPreview = previews[index];
    if (deletedPreview) {
      URL.revokeObjectURL(deletedPreview.preview);
    }
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setFiles(newPreviews.map((p) => p.file));
  };
  const handlePrint = async () => {
    // if (!campus) {
    //   Vellore
    // }

    const isPdf = files.length === 1 && files[0]?.type === "application/pdf";

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("campus", campus);
    //console.log("campus", campus);
    formData.append("isPdf", String(isPdf));

    setIsUploading(true);

    try {
      await toast.promise(
        async () => {
          try {

            await axios.post<APIResponse>("/api/upload", formData);

            return { message: "Papers uploaded successfully!" };
          } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
              const errorData = error.response.data as APIResponse;
              const errorMessage =
                errorData.message ?? "Failed to upload papers";
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

      setFiles([]);
    } catch (error) {
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex h-[calc(100vh-85px)] flex-col justify-center px-6 font-play">
        <div className="2xl:my-15 flex flex-col items-center">
          {previews.length === 0 && (
            <fieldset className="mb-4 w-full max-w-md rounded-lg border-2 border-gray-300 p-4 pr-8">
              <div className="flex w-full flex-col 2xl:gap-y-4">
                <div>
                  <section
                    {...getRootProps()}
                    className={`my-2 -mr-2 cursor-pointer rounded-2xl border-2 ${
                      isDragging || isGlobalDragging
                        ? "border-solid border-[#6D28D9] bg-purple-50 dark:bg-[#130E1F]"
                        : "border-dashed border-gray-300"
                    } p-8 text-center transition-all duration-200`}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    <input {...getInputProps()} />
                    {isDragging || isGlobalDragging ? (
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-medium text-[#6D28D9]">
                          Drop files here
                        </p>
                        <svg
                          className="mt-2 h-10 w-10 animate-bounce text-[#6D28D9]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                      </div>
                    ) : (
                      <p>
                        Drag &apos;n&apos; drop some files here, or{" "}
                        <span className="text-[#6D28D9]">click</span> to select
                        files
                      </p>
                    )}
                    <div
                      className={`mt-2 text-xs ${files.length === 0 ? "text-red-500" : "text-gray-600"}`}
                    >
                      {files.length} files selected
                    </div>
                  </section>
                  <label className="mx-2 -mr-2 block text-center text-xs font-medium text-gray-700">
                    Only Images and PDF are allowed
                    <sup className="text-red-500">*</sup>
                  </label>
                </div>
              </div>
            </fieldset>
          )}

          {previews.length > 0 && (
            <section className="mt-6 flex w-full flex-col items-center">
              <div
                className="scrollbar-hide flex aspect-[2/1] w-full max-w-4xl flex-col justify-between overflow-x-auto overflow-y-hidden rounded-[40px] border-[6px] border-indigo-900 bg-indigo-900/10 p-8"
                style={{ minHeight: 320 }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDndKitDragEnd}
                >
                  <SortableContext
                    items={previews.map((item) => item.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex w-max gap-5">
                      {previews.map((item, index) => (
                        <SortablePreview key={item.id} id={item.id}>
                          <div className="relative h-60 w-48">
                            <div className="h-full w-full overflow-hidden rounded-2xl outline outline-2 outline-white/80">
                              <div className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-slate-600">
                                <span className="text-xl text-white">
                                  {index + 1}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDelete(index)}
                                className="absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-bl-2xl rounded-tr-2xl bg-pink-800"
                                title="Delete"
                              >
                                <FiTrash className="h-5 w-5 text-white" />
                              </button>
                              {item.file.type.startsWith("image/") ? (
                                <div className="relative h-full w-full">
                                  <Image
                                    src={item.preview}
                                    alt={`Page ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized // Since we're using object URLs
                                  />
                                </div>
                              ) : (
                                <iframe
                                  src={item.preview}
                                  title={`PDF preview ${index + 1}`}
                                  className="h-full w-full"
                                />
                              )}
                            </div>
                          </div>
                        </SortablePreview>
                      ))}
                      <div
                        className="relative h-20 w-20 cursor-pointer"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <div className="absolute left-4 top-4 h-16 w-16 rounded-2xl bg-violet-950" />
                        <div className="absolute left-0 top-0 h-10 w-10 rounded-[20px] bg-violet-950" />
                        <div className="absolute left-1 top-1 h-8 w-8 rounded-[20px] bg-black/50" />
                        <div className="absolute left-7 top-7 text-2xl text-white">
                          +
                        </div>
                        <div className="absolute left-4 top-3 text-xs font-semibold text-white">
                          {previews.length}
                        </div>
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
                <p className="mt-4 text-center text-xl text-white/50">
                  Drag to re-order.
                </p>
              </div>
            </section>
          )}

          <Button
            onClick={handlePrint}
            disabled={isUploading || files.length === 0}
            className="mt-8 rounded-[40px] bg-violet-950 px-8 py-3 text-xl text-white"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {zoomIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative flex flex-col items-center rounded-lg bg-white p-4 shadow-lg">
            <button
              onClick={() => setZoomIndex(null)}
              className="absolute right-2 top-2 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
              title="Close"
            >
              <FiX size={24} />
            </button>
            {previews[zoomIndex]?.file.type.startsWith("image/") ? (
              <Image
                src={previews[zoomIndex].preview}
                alt="zoomed preview"
                className="max-h-[80vh] max-w-[80vw] rounded-md"
                width={800}
                height={600}
                unoptimized
              />
            ) : previews[zoomIndex] ? (
              <iframe
                src={previews[zoomIndex].preview}
                className="h-[80vh] w-[80vw] rounded-md border"
                title={`PDF zoom preview ${zoomIndex}`}
              />
            ) : null}
            {previews[zoomIndex] && (
              <p className="mt-4 break-words text-center font-semibold text-[#6D28D9]">
                {previews[zoomIndex].file.name}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
