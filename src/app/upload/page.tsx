'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function Page() {
  const [campus] = useState<'vellore' | 'chennai'>('vellore')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isGlobalDragging, setIsGlobalDragging] = useState(false)

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
    if (to < 0 || to >= previews.length) return
    const newPreviews = [...previews]
    const [moved] = newPreviews.splice(from, 1)
    newPreviews.splice(to, 0, moved)

    setPreviews(newPreviews)
    setFiles(newPreviews.map(p => p.file))
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <fieldset
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-300
          ${isDragActive || isDragging || isGlobalDragging ? 'border-primary bg-primary/10' : 'border-muted'}
        `}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <input {...getInputProps()} />
        <p className="text-lg font-semibold">
          {isDragActive || isDragging || isGlobalDragging
            ? 'Drop your PDFs or images here'
            : 'Drag & drop PDFs or images here, or click to select'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">Max 5MB. PDF, JPG, PNG, GIF supported.</p>
      </fieldset>

      {previews.length > 0 && (
        <section className="mt-6 space-y-4">
          {previews.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border p-4 rounded-md bg-gray-50">
              {item.file.type.startsWith('image/') ? (
                <img src={item.preview} alt="preview" className="w-32 h-32 object-cover rounded-md" />
              ) : (
                <iframe
                  src={item.preview}
                  className="w-32 h-32 border rounded-md"
                  title={`PDF preview ${index}`}
                />
              )}
              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-gray-700 break-words">{item.file.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => reorderFiles(index, index - 1)}
                    disabled={index === 0}
                    className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => reorderFiles(index, index + 1)}
                    disabled={index === previews.length - 1}
                    className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handlePrint} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Papers'}
          </Button>
        </section>
      )}
    </main>
  )
}
