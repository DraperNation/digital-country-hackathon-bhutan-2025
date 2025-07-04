import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";

const API_BASE = "http://localhost:5001/api";

const DocumentsSidebar = () => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/documents/files`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDocuments(data.documents);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <aside className="w-80 h-screen flex flex-col bg-gradient-to-br from-white/90 to-blue-50/80 border-l border-white/20 shadow-2xl backdrop-blur-xl">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-gray-200/60 bg-gradient-to-r from-blue-100/60 to-purple-100/40">
          <span className="text-2xl">🇧🇹</span>
          <h2 className="text-lg font-bold tracking-tight text-gray-800">Bhutan Legal Documents</h2>
        </div>
        {/* Divider */}
        <div className="px-6 pt-2 pb-2 border-b border-gray-100/80">
          <span className="text-xs text-gray-500">AI is trained on these files</span>
        </div>
        {/* Document List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-blue-200/60 scrollbar-track-transparent" style={{ boxShadow: 'inset 0 8px 16px -8px #e0e7ef' }}>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading documents...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {documents.length === 0 ? (
                <div className="text-gray-500 text-center">No documents available</div>
              ) : (
                documents.map(doc => (
                  <div
                    key={doc}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/60 text-blue-900 font-semibold shadow-sm border border-blue-200/60 hover:bg-blue-200/80 hover:to-purple-200/80 transition-all cursor-pointer text-sm flex items-center gap-2"
                    title={doc}
                  >
                    <span className="truncate">{doc.replace(/_/g, ' ')}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
};

export default DocumentsSidebar; 