"use client";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";
import { extractBracketContent } from "@/util/utils";
import { downloadFile } from "./CatalogueContent";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  url: string;
  name: string;
}

export default function PdfViewer({ url, name }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1); // Default zoom level (100%)

  // Handle document load success
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to page 1 when new document loads
  }

  // Navigate to previous page
  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  // Navigate to next page
  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages ?? 1, prev + 1));
  };

  // Handle page number input change
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= (numPages ?? 1)) {
      setPageNumber(value);
    }
  };

  // Zoom in (increase scale)
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3)); // Max scale: 300%
  };

  // Zoom out (decrease scale)
  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.25)); // Min scale: 25%
  };
  const downloadPDF = async () => {
    const fileName = `${name}.pdf`;
    await downloadFile(url, fileName);
  };
  return (
    <div className="flex flex-col items-center">
      {/* PDF Document */}
      <div className="max-h-[70vh] overflow-auto border border-gray-300 shadow-lg">
        <Document
          className="flex justify-center"
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          error={
            <div className="p-4 text-red-500">Failed to load PDF file.</div>
          }
          loading={<div className="p-4 text-gray-500">Loading PDF...</div>}
          noData={
            <div className="p-4 text-gray-500">No PDF file specified.</div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            className="w-max-[75vw] shadow-md"
          />
        </Document>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col items-center gap-4 rounded-lg bg-[#160820] p-4 shadow sm:flex-row">
        {/* Page Navigation */}
        <Button onClick={downloadPDF}><Download/></Button>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="rounded bg-[#3d2075] px-3 py-1 text-white transition hover:bg-[#6536c1] disabled:bg-[#706b7a]"
          >
            {"<"}
          </button>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageChange}
            min={1}
            max={numPages}
            className="w-16 rounded border p-1 text-center"
          />
          <span>of {numPages ?? 1}</span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages ?? 1)}
            className="rounded bg-[#3d2075] px-3 py-1 text-white transition hover:bg-[#6536c1] disabled:bg-[#706b7a]"
          >
            {">"}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.25}
            className="rounded bg-[#3d2075] px-3 py-1 text-white transition hover:bg-[#6536c1] disabled:bg-gray-300"
          >
            <ZoomOut />
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="rounded bg-[#3d2075] px-3 py-1 text-white transition hover:bg-[#6536c1] disabled:bg-gray-300"
          >
            {<ZoomIn />}
          </button>
        </div>
      </div>

      {/* Document Name */}
      <p className="mt-2 text-gray-700">Viewing: {name}</p>
    </div>
  );
}
