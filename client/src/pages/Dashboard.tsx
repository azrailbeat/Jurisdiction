import React from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DocumentViewer from "@/components/document/DocumentViewer";
import VersionHistory from "@/components/document/VersionHistory";
import SemanticAnalysis from "@/components/document/SemanticAnalysis";
import KnowledgeGraphViewer from "@/components/document/KnowledgeGraphViewer";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@/types";

const Dashboard: React.FC = () => {
  // Get the most recent active document
  const { data: documents } = useQuery<Document[]>({
    queryKey: ['/api/documents?status=active&limit=1'],
  });

  const latestDocument = documents?.[0];

  return (
    <>
      <DashboardOverview />
      
      {latestDocument && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <DocumentViewer documentId={latestDocument.id} />
          
          <div className="lg:col-span-2 space-y-6">
            <VersionHistory documentId={latestDocument.id} />
            <SemanticAnalysis documentId={latestDocument.id} />
            <KnowledgeGraphViewer documentId={latestDocument.id} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
