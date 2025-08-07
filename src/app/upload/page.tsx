'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { FiTrash, FiX } from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface APIResponse {
  status: string;
  message?: string;
}

export default function Page() {
  const campus = 'Vellore' as const;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    const onDragEnter = () => setIsGlobalDragging(true);
    const onDragLeave = () => setIsGlobalDragging(false);
    const onDrop = () => setIsGlobalDragging(false);

    document.addEventListener('dragenter', onDragEnter);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDrop);

    return () => {
      document.removeEventListener('dragenter', onDragEnter);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('drop', onDrop);
    };
  }, []);

  useEffect(() => {
    return () => {
    
      previews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []); 

  const fileCheckAndSelect = useCallback((acceptedFiles: File[]) => {
    const maxFileSize = 5 * 1024 * 1024;
    const allowedFileTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    const toastId = toast.loading('uploading your files');
    if (!acceptedFiles || acceptedFiles.length === 0) {
      toast.error('No files selected', { id: toastId });
      return;
    }

    if (acceptedFiles.length > 5) {
      toast.error('More than 5 files selected', { id: toastId });
      return;
    }

    const invalidFiles = acceptedFiles.filter(
      (file) => file.size > maxFileSize || !allowedFileTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error(
        'Some files are invalid. Ensure each file is below 5MB and of an allowed type (PDF, JPEG, PNG, GIF).',
        { id: toastId }
      );
      return;
    }

    const isPdf = acceptedFiles.some((file) => file.type === 'application/pdf');
    if (isPdf && acceptedFiles.length > 1) {
      toast.error('PDFs must be uploaded separately', { id: toastId });
      return;
    }

    const orderedFiles = acceptedFiles.sort((a, b) => a.lastModified - b.lastModified);
    setFiles(orderedFiles);
    setPreviews(
      orderedFiles.map((file, idx) => ({
        id: `${file.name}-${file.lastModified}-${idx}`,
        file,
        preview: URL.createObjectURL(file),
      }))
    );
    toast.success(`${orderedFiles.length} files selected!`, { id: toastId });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    fileCheckAndSelect(acceptedFiles);
  }, [fileCheckAndSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function SortablePreview({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : undefined,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

  const handleDndKitDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = previews.findIndex((item) => item.id === active.id);
      const newIndex = previews.findIndex((item) => item.id === over.id);
      const newPreviews = arrayMove(previews, oldIndex, newIndex);
      setPreviews(newPreviews);
      setFiles(newPreviews.map((p) => p.file));
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
    if (files.length === 0) return;

    const isPdf = files.length === 1 && files[0]?.type === 'application/pdf';
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('campus', campus);
    formData.append('isPdf', String(isPdf));

    setIsUploading(true);

    try {
      await toast.promise(
        async () => {
          try {
            await axios.post<APIResponse>('/api/ai-upload', formData);
          } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
              const errorData = error.response.data as APIResponse;
              const errorMessage = errorData.message || 'Failed to upload papers';
              throw new Error(errorMessage);
            }
            throw new Error('Failed to upload papers');
          }
        },
        {
          loading: 'Uploading papers...',
          success: 'Papers uploaded successfully!',
          error: (error: Error) => error.message,
        }
      );

      setFiles([]);
      setPreviews([]);
    } catch (error) {
      // Optionally handle error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="font-play flex h-[calc(100vh-85px)] flex-col justify-center px-6">
        <div className="2xl:my-15 flex flex-col items-center">
          {previews.length === 0 && (
            <fieldset className="mb-4 w-full max-w-md rounded-lg border-2 border-gray-300 p-4 pr-8">
              <div className="flex w-full flex-col 2xl:gap-y-4">
                <div>
                  <section
                    {...getRootProps()}
                    className={`my-2 -mr-2 cursor-pointer rounded-2xl border-2 ${
                      isDragging || isGlobalDragging
                        ? 'border-solid border-[#6D28D9] bg-purple-50 dark:bg-[#130E1F]'
                        : 'border-dashed border-gray-300'
                    } p-8 text-center transition-all duration-200`}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    <input {...getInputProps()} />
                    {isDragging || isGlobalDragging ? (
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-medium text-[#6D28D9]">Drop files here</p>
                        <svg className="mt-2 h-10 w-10 animate-bounce text-[#6D28D9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </div>
                    ) : (
                      <p>
                        Drag &apos;n&apos; drop some files here, or{' '}
                        <span className="text-[#6D28D9]">click</span> to select files
                      </p>
                    )}
                    <div className={`mt-2 text-xs ${files.length === 0 ? 'text-red-500' : 'text-gray-600'}`}>
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
            <section className="mt-6 w-full flex flex-col items-center">
              <div
                className="w-full max-w-4xl aspect-[2/1] p-8 bg-indigo-900/10 rounded-[40px] border-[6px] border-indigo-900 overflow-x-auto overflow-y-hidden scrollbar-hide flex flex-col justify-between"
                style={{ minHeight: 320 }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDndKitDragEnd}
                >
                  <SortableContext items={previews.map((item) => item.id)} strategy={horizontalListSortingStrategy}>
                    <div className="flex gap-5 w-max">
                      {previews.map((item, index) => (
                        <SortablePreview key={item.id} id={item.id}>
                          <div className="relative w-48 h-60">
                            <div className="w-full h-full rounded-2xl outline outline-2 outline-white/80 overflow-hidden">
                              <div className="absolute left-0 top-0 w-10 h-10 bg-slate-600 rounded-tl-2xl rounded-br-2xl flex items-center justify-center">
                                <span className="text-white text-xl">{index + 1}</span>
                              </div>
                              <button
                                onClick={() => handleDelete(index)}
                                className="absolute right-0 top-0 w-10 h-10 bg-pink-800 rounded-tr-2xl rounded-bl-2xl flex items-center justify-center"
                                title="Delete"
                              >
                                <FiTrash className="w-5 h-5 text-white" />
                              </button>
                              {item.file.type.startsWith('image/') ? (
                                <img src={item.preview} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                              ) : (
                                <iframe src={item.preview} title={`PDF preview ${index + 1}`} className="w-full h-full" />
                              )}
                            </div>
                          </div>
                        </SortablePreview>
                      ))}
                      <div className="relative w-20 h-20 cursor-pointer" {...getRootProps()}>
                        <div className="absolute left-4 top-4 w-16 h-16 bg-violet-950 rounded-2xl" />
                        <div className="absolute left-0 top-0 w-10 h-10 bg-violet-950 rounded-[20px]" />
                        <div className="absolute left-1 top-1 w-8 h-8 bg-black/50 rounded-[20px]" />
                        <div className="absolute left-7 top-7 text-white text-2xl">+</div>
                        <div className="absolute left-4 top-3 text-white text-xs font-semibold">{previews.length}</div>
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
                <p className="mt-4 text-center text-white/50 text-xl">Drag to re-order.</p>
              </div>
            </section>
          )}

          <Button
            onClick={handlePrint}
            disabled={isUploading || files.length === 0}
            className="mt-8 px-8 py-3 bg-violet-950 rounded-[40px] text-white text-xl"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>

      {zoomIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
            <button
              onClick={() => setZoomIndex(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              title="Close"
            >
              <FiX size={24} />
            </button>
            {previews[zoomIndex] && previews[zoomIndex].file.type.startsWith('image/') ? (
              <img src={previews[zoomIndex]?.preview} alt="zoomed preview" className="max-w-[80vw] max-h-[80vh] rounded-md" />
            ) : previews[zoomIndex] ? (
              <iframe
                src={previews[zoomIndex]?.preview}
                className="w-[80vw] h-[80vh] border rounded-md"
                title={`PDF zoom preview ${zoomIndex}`}
              />
            ) : null}
            {previews[zoomIndex] && (
              <p className="mt-4 font-semibold text-[#6D28D9] text-center break-words">
                {previews[zoomIndex].file.name}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
