"use client";
import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { uploadDocuments } from "@/lib/api";

interface Props {
  onUploadComplete: () => void;
  currentCount: number;
}

export default function DocumentUploader({ onUploadComplete, currentCount }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected);
    const valid = arr.filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    if (valid.length !== arr.length) {
      setError("Only PDF and Word documents are allowed");
      return;
    }
    if (currentCount + valid.length > 5) {
      setError(`You can only have 5 documents total. You have ${currentCount} already.`);
      return;
    }
    setError("");
    setFiles(valid);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      await uploadDocuments(files);
      setFiles([]);
      onUploadComplete();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition"
      >
        <Upload className="mx-auto mb-3 text-gray-500 w-8 h-8" />
        <p className="text-gray-400 text-sm">
          Drop PDF or Word files here, or{" "}
          <span className="text-blue-400">browse</span>
        </p>
        <p className="text-gray-600 text-xs mt-1">Max 5 documents · 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2"
            >
              <FileText className="text-blue-400 w-4 h-4 shrink-0" />
              <span className="text-gray-300 text-sm flex-1 truncate">{f.name}</span>
              <button
                onClick={() => setFiles(files.filter((_, j) => j !== i))}
                className="text-gray-500 hover:text-red-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-2 transition flex items-center justify-center gap-2"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
          </button>
        </div>
      )}

      {error && !files.length && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}