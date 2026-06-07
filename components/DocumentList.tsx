"use client";
import { FileText, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { deleteDocument } from "@/lib/api";

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  status: string;
  created_at: string;
}

interface Props {
  documents: Document[];
  onDelete: () => void;
}

const statusIcon = (status: string) => {
  if (status === "ready") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentList({ documents, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document and all its data?")) return;
    await deleteDocument(id);
    onDelete();
  };

  if (!documents.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="mx-auto mb-3 w-10 h-10 opacity-30" />
        <p className="text-sm">No documents yet. Upload one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
        >
          <FileText className="text-blue-400 w-5 h-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{doc.file_name}</p>
            <p className="text-gray-500 text-xs">{formatSize(doc.file_size)}</p>
          </div>
          <div className="flex items-center gap-1">
            {statusIcon(doc.status)}
            <span className="text-xs text-gray-400 capitalize">{doc.status}</span>
          </div>
          <button
            onClick={() => handleDelete(doc.id)}
            className="text-gray-600 hover:text-red-400 transition ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}