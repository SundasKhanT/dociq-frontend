"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listDocuments } from "@/lib/api";
import { clearToken, isLoggedIn } from "@/lib/auth";
import DocumentUploader from "@/components/DocumentUploader";
import DocumentList from "@/components/DocumentList";
import { FileText, MessageSquare, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: () => listDocuments().then((r) => r.data.documents),
    refetchInterval: 5000, // poll every 5s to update processing status
  });

  const documents = data || [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <FileText className="text-white w-4 h-4" />
          </div>
          <span className="text-white font-bold">DocIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
          >
            <MessageSquare className="w-4 h-4" />
            Start Chatting
          </button>
          <button
            onClick={() => { clearToken(); router.push("/login"); }}
            className="text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Your Documents</h1>
          <p className="text-gray-400 text-sm mt-1">
            {documents.length}/5 documents uploaded
          </p>
        </div>

        {documents.length < 5 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Upload Documents</h2>
            <DocumentUploader
              onUploadComplete={refetch}
              currentCount={documents.length}
            />
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Uploaded Files</h2>
          <DocumentList documents={documents} onDelete={refetch} />
        </div>
      </div>
    </div>
  );
}