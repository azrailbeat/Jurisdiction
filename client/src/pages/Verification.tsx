import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document, VerificationIssue } from "@/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import VerificationModal from "@/components/modals/VerificationModal";
import { formatDistance } from "date-fns";

const Verification: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [activeIssue, setActiveIssue] = useState<VerificationIssue | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: issues, isLoading: isLoadingIssues } = useQuery<VerificationIssue[]>({
    queryKey: ["/api/verification/issues"],
  });

  const { data: documentIssues } = useQuery<VerificationIssue[]>({
    queryKey: [`/api/documents/${selectedDocument}/issues`],
    enabled: !!selectedDocument,
  });

  const displayIssues = selectedDocument ? documentIssues : issues;

  const handleVerifyDocument = async (documentId: number) => {
    try {
      await apiRequest("POST", `/api/documents/${documentId}/verify`, {});
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/issues`] });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/issues"] });
    } catch (error) {
      console.error("Error verifying document:", error);
    }
  };

  const handleOpenIssue = (issue: VerificationIssue) => {
    setActiveIssue(issue);
    setIsModalOpen(true);
  };

  const handleResolveIssue = async (issueId: number) => {
    try {
      await apiRequest("PUT", `/api/issues/${issueId}`, {
        status: "resolved",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${selectedDocument}/issues`] });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/issues"] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
  };

  const handleIgnoreIssue = async (issueId: number) => {
    try {
      await apiRequest("PUT", `/api/issues/${issueId}`, {
        status: "ignored",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${selectedDocument}/issues`] });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/issues"] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error ignoring issue:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-[#ca5010] text-white";
      case "resolved":
        return "bg-[#107c10] text-white";
      case "ignored":
        return "bg-neutral-300 text-neutral-500";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "text-[#a4262c]";
      case "warning":
        return "text-[#ca5010]";
      case "info":
        return "text-primary";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Verification & Compliance</h1>
        <div className="flex space-x-4">
          <Select
            value={selectedDocument?.toString() || ""}
            onValueChange={(value) => setSelectedDocument(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Documents</SelectItem>
              {documents?.map((document) => (
                <SelectItem key={document.id} value={document.id.toString()}>
                  {document.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDocument && (
            <Button onClick={() => handleVerifyDocument(selectedDocument)}>
              <i className="fas fa-check-double mr-2"></i>
              Verify Document
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Verification Issues</CardTitle>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="ignored">Ignored</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingIssues ? (
            <div className="py-8 text-center">
              <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
              <p>Loading verification issues...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayIssues?.length ? (
                    displayIssues.map((issue) => (
                      <TableRow key={issue.id} className="cursor-pointer hover:bg-neutral-50" onClick={() => handleOpenIssue(issue)}>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell>
                          {documents?.find((d) => d.id === issue.documentId)?.title || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center ${getSeverityColor(issue.severity)}`}>
                            <i className={`fas fa-${issue.severity === 'error' ? 'circle-exclamation' : issue.severity === 'warning' ? 'triangle-exclamation' : 'circle-info'} mr-2`}></i>
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.location}</TableCell>
                        <TableCell>{formatDate(issue.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenIssue(issue);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveIssue(issue.id);
                            }}
                            disabled={issue.status !== "open"}
                          >
                            <i className="fas fa-check"></i>
                            <span className="sr-only">Resolve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-neutral-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIgnoreIssue(issue.id);
                            }}
                            disabled={issue.status !== "open"}
                          >
                            <i className="fas fa-ban"></i>
                            <span className="sr-only">Ignore</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-neutral-500"
                      >
                        {selectedDocument
                          ? "No verification issues found for this document"
                          : "No verification issues found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <VerificationModal
        issue={activeIssue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolveIssue}
        onIgnore={handleIgnoreIssue}
      />
    </>
  );
};

export default Verification;
