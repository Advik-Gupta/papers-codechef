interface PdfViewerProps {
  url: string;
  name: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <iframe className="h-[75vh] w-[80%]" src={`${url}`}></iframe>
    </div>
  );
}
