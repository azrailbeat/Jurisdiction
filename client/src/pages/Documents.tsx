import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Document } from "@/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistance } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUpload from "@/components/document/DocumentUpload";

const Documents: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    status: "draft",
    content: "",
    xml: "",
  });

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const handleCreateDocument = async () => {
    try {
      // Get the authenticated user's ID from the useAuth hook
      const { user } = useAuth();
      
      const data = {
        ...newDocument,
        createdBy: user?.id || "anonymous",
        updatedBy: user?.id || "anonymous",
      };
      
      await apiRequest("/api/documents", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Reset form and close dialog
      setNewDocument({
        title: "",
        status: "draft",
        content: "",
        xml: "",
      });
      setIsCreateDialogOpen(false);

      // Invalidate the documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-white">Active</Badge>;
      case "review":
        return <Badge className="bg-[#ca5010] text-white">Review</Badge>;
      case "draft":
        return <Badge className="bg-neutral-300 text-neutral-500">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Repository</h1>
        <div className="flex gap-2">
          <Button
            className="bg-primary-dark text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Create New Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-64" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents?.length ? (
                        documents.map((document) => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">
                              {document.title}
                            </TableCell>
                            <TableCell>{getStatusBadge(document.status)}</TableCell>
                            <TableCell>v{document.currentVersion}</TableCell>
                            <TableCell>{formatDate(document.updatedAt)}</TableCell>
                            <TableCell className="text-right">
                              <Link href={`/documents/${document.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <i className="fas fa-eye"></i>
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <i className="fas fa-edit"></i>
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <i className="fas fa-trash"></i>
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-neutral-500"
                          >
                            No documents found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload">
          <DocumentUpload 
            onUploadComplete={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
            }} 
          />
        </TabsContent>
      </Tabs>

      {/* Create Document Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Enter the details of the new legislative document.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newDocument.title}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newDocument.status}
                onValueChange={(value) =>
                  setNewDocument({ ...newDocument, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={newDocument.content}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, content: e.target.value })
                }
                className="col-span-3"
                rows={6}
                placeholder="Enter the document content in HTML format"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="xml" className="text-right">
                XML
              </Label>
              <Textarea
                id="xml"
                value={newDocument.xml}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, xml: e.target.value })
                }
                className="col-span-3"
                rows={6}
                placeholder="Enter the document XML using AkomaNtoso format"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDocument}>Create Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Documents;
