import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardHeader,
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Document } from "@/types";
import { formatDistance } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentViewerProps {
  documentId: number;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId }) => {
  const [activeTab, setActiveTab] = useState("view");
  
  const { data: document, isLoading } = useQuery<Document>({
    queryKey: [`/api/documents/${documentId}`],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-secondary text-white">Active</Badge>;
      case 'review':
        return <Badge className="bg-status-warning text-white">Review</Badge>;
      case 'draft':
        return <Badge className="bg-neutral-300 text-neutral-500">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
        </CardHeader>
        <div className="h-96 flex items-center justify-center">
          <div className="text-neutral-400">Loading document...</div>
        </div>
      </Card>
    );
  }

  if (!document) {
    return (
      <Card>
        <CardHeader>
          <div className="text-xl font-semibold">Document Not Found</div>
        </CardHeader>
        <CardContent>
          <p>The requested document could not be found.</p>
          <Link href="/documents">
            <Button className="mt-4">Back to Documents</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3 overflow-hidden">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold mr-3">{document.title}</h2>
            {getStatusBadge(document.status)}
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" title="Download">
              <i className="fas fa-download"></i>
            </Button>
            <Button size="icon" variant="ghost" title="Share">
              <i className="fas fa-share-nodes"></i>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" title="More options">
                  <i className="fas fa-ellipsis-vertical"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Document</DropdownMenuItem>
                <DropdownMenuItem>Create New Version</DropdownMenuItem>
                <DropdownMenuItem>Compare Versions</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-3">
          <span className="text-sm text-neutral-500">
            <i className="fas fa-history mr-1"></i> Version {document.currentVersion}
          </span>
          <span className="text-sm text-neutral-500">
            <i className="fas fa-calendar mr-1"></i> Last updated: {formatDate(document.updatedAt)}
          </span>
          <span className="text-sm text-neutral-500">
            <i className="fas fa-user mr-1"></i> {document.lastUpdatedBy?.name || "Unknown User"}
          </span>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex border-b w-full rounded-none bg-transparent h-auto">
          <TabsTrigger 
            value="view" 
            className="px-4 py-2 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            View Document
          </TabsTrigger>
          <TabsTrigger 
            value="xml" 
            className="px-4 py-2 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            XML Source
          </TabsTrigger>
          <TabsTrigger 
            value="changes" 
            className="px-4 py-2 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Changes
          </TabsTrigger>
          <TabsTrigger 
            value="references" 
            className="px-4 py-2 rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            References
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="p-6 overflow-y-auto h-[calc(100vh-26rem)]">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: document.content }}></div>
        </TabsContent>
        
        <TabsContent value="xml" className="p-6 overflow-y-auto h-[calc(100vh-26rem)]">
          <pre className="bg-neutral-50 p-4 rounded border text-sm overflow-x-auto">
            {document.xml}
          </pre>
        </TabsContent>
        
        <TabsContent value="changes" className="p-6 overflow-y-auto h-[calc(100vh-26rem)]">
          <div className="flex flex-col space-y-4">
            <p className="text-neutral-500">Select versions to compare:</p>
            <div className="flex space-x-4">
              <div className="flex-1">
                <select className="w-full p-2 border rounded">
                  <option>Version {document.currentVersion} (Current)</option>
                  <option>Version 2.2</option>
                  <option>Version 2.1</option>
                  <option>Version 2.0</option>
                  <option>Version 1.0</option>
                </select>
              </div>
              <div className="flex items-center">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div className="flex-1">
                <select className="w-full p-2 border rounded">
                  <option>Version 2.2</option>
                  <option>Version 2.1</option>
                  <option>Version 2.0</option>
                  <option>Version 1.0</option>
                </select>
              </div>
              <Button>Compare</Button>
            </div>
            <div className="p-4 text-center text-neutral-400 border border-dashed rounded-md">
              Select versions to view changes
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="references" className="p-6 overflow-y-auto h-[calc(100vh-26rem)]">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Referenced By</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Banking and Finance Regulation (Section 15.2)</li>
                <li>Commercial Code (Article 47)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">References To</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Constitution of Kazakhstan (Article 6.1)</li>
                <li>Civil Code (Article 115)</li>
                <li>Law on Information Security (Article 23)</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DocumentViewer;
