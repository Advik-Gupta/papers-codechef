'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { FiArrowUp, FiArrowDown, FiTrash, FiZoomIn, FiX } from "react-icons/fi"

export default function Page() {
  const [campus] = useState<'vellore' | 'chennai'>('vellore')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isGlobalDragging, setIsGlobalDragging] = useState(false)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  // Handle drag & drop global visual feedback
  useEffect(() => {
    const onDragEnter = () => setIsGlobalDragging(true)
    const onDragLeave = () => setIsGlobalDragging(false)
    const onDrop = () => setIsGlobalDragging(false)

    document.addEventListener('dragenter', onDragEnter)
    document.addEventListener('dragleave', onDragLeave)
    document.addEventListener('drop', onDrop)

    return () => {
      document.removeEventListener('dragenter', onDragEnter)
      document.removeEventListener('dragleave', onDragLeave)
      document.removeEventListener('drop', onDrop)
    }
  }, [])

  // Clean up URLs
  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [previews])

  const fileCheckAndSelect = useCallback((acceptedFiles: File[]) => {
    const filtered = acceptedFiles.filter((file) => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      return isValidType && isValidSize
    })

    if (filtered.length !== acceptedFiles.length) {
      toast.error('Some files were rejected (invalid type or >5MB)')
    }

    filtered.sort((a, b) => b.lastModified - a.lastModified)

    setFiles(filtered)
    setPreviews(filtered.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    })))
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    fileCheckAndSelect(acceptedFiles)
  }, [fileCheckAndSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  })

  const handlePrint = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()

    previews.forEach(({ file }) => formData.append('files', file))
    formData.append('campus', campus)
    formData.append('isPdf', 'true')

    try {
      const toastId = toast.loading('Uploading files...')
      await axios.post('/api/ai-upload', formData)
      toast.success('Files uploaded successfully!', { id: toastId })
    } catch (err) {
      toast.error('Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  const reorderFiles = (from: number, to: number) => {
    if (from < 0 || to < 0 || from >= previews.length || to >= previews.length) {
      return; 
    }

    const newPreviews = [...previews];
    const [moved] = newPreviews.splice(from, 1);
    
   
    if (moved) {
      newPreviews.splice(to, 0, moved);
      setPreviews(newPreviews);
      setFiles(newPreviews.map(p => p.file));
    }
  }

  const handleDelete = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    setFiles(newPreviews.map(p => p.file))
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="font-play flex h-[calc(100vh-85px)] flex-col justify-center px-6">
        <div className="2xl:my-15 flex flex-col items-center">
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
                      <svg className="mt-2 h-10 w-10 animate-bounce text-[#6D28D9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  ) : (
                    <p>
                      Drag &apos;n&apos; drop some files here, or{" "}
                      <span className="text-[#6D28D9]">click</span> to select files
                    </p>
                  )}
                  <div
                    className={`mt-2 text-xs ${
                      files?.length === 0 ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    {files?.length || 0} files selected
                  </div>
                </section>
                <label className="mx-2 -mr-2 block text-center text-xs font-medium text-gray-700">
                  Only Images and PDF are allowed
                  <sup className="text-red-500">*</sup>
                </label>
              </div>
            </div>
          </fieldset>
          
          {previews.length > 0 && (
            <section className="mt-6 w-full max-w-4xl">
              <div className="w-full p-8 bg-indigo-900/10 rounded-[40px] border-[6px] border-indigo-900">
                <div className="flex flex-wrap gap-5 justify-center">
                  {previews.map((item, index) => (
                    <div key={index} className="relative w-48 h-60">
                      <div className="w-full h-full rounded-2xl outline outline-2 outline-white/80 overflow-hidden">
                        {/* Page number badge */}
                        <div className="absolute left-0 top-0 w-10 h-10 bg-slate-600 rounded-tl-2xl rounded-br-2xl flex items-center justify-center">
                          <span className="text-white text-xl">{index + 1}</span>
                        </div>
                        
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(index)}
                          className="absolute right-0 top-0 w-10 h-10 bg-pink-800 rounded-tr-2xl rounded-bl-2xl flex items-center justify-center"
                          title="Delete"
                        >
                          <FiTrash className="w-5 h-5 text-white" />
                        </button>

                        
                        {item.file.type.startsWith('image/') ? (
                          <img
                            src={item.preview}
                            alt={`Page ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <iframe
                            src={item.preview}
                            title={`PDF preview ${index + 1}`}
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add more button */}
                  <div className="relative w-20 h-20 cursor-pointer" {...getRootProps()}>
                    <div className="absolute left-4 top-4 w-16 h-16 bg-violet-950 rounded-2xl" />
                    <div className="absolute left-0 top-0 w-10 h-10 bg-violet-950 rounded-[20px]" />
                    <div className="absolute left-1 top-1 w-8 h-8 bg-black/50 rounded-[20px]" />
                    <div className="absolute left-7 top-7 text-white text-2xl">+</div>
                    <div className="absolute left-4 top-3 text-white text-xs font-semibold">
                      {previews.length}
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-white/50 text-xl mt-6">
                  Drag to re-order pages.
                </p>
              </div>
            </section>
          )}
          <Button
            onClick={handlePrint}
            disabled={isUploading || files.length === 0}
            className="mt-8 px-8 py-3 bg-violet-950 rounded-[40px] text-white text-xl"
          >
            {isUploading ? "Uploading..." : "Upload"}
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
              <img
                src={previews[zoomIndex]?.preview}
                alt="zoomed preview"
                className="max-w-[80vw] max-h-[80vh] rounded-md"
              />
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
