import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Upload, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const allowedFileTypes = [
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/html",
    "application/xml"
  ];
  
  const allowedExtensions = [".pdf", ".docx", ".html", ".xml"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedFileTypes.includes(selectedFile.type) && !allowedExtensions.some(ext => fileExtension.endsWith(ext))) {
      setError(`Invalid file type. Please upload a PDF, DOCX, HTML, or XML file.`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) return null;
      
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await apiRequest('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });
        
        // apiRequest already handles the response validation
        // We just need to return the response directly
        return response;
      } catch (error) {
        throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Document uploaded successfully",
        description: `"${file?.name}" has been uploaded and processed.`,
      });
      
      // Reset the form
      setFile(null);
      
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      setError(error.message || "Failed to upload document");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    uploadMutation.mutate();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Legal Document</CardTitle>
        <CardDescription>
          Upload legislative documents in PDF, DOCX, HTML, or XML format.
          The system will process and normalize the document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="file">Document File</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.docx,.html,.xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/html,application/xml" 
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOCX, HTML, XML
              </p>
            </div>
            
            {file && (
              <div className="flex items-center p-3 bg-secondary/30 rounded-md">
                <FileText className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium truncate">{file.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!file || uploading || uploadMutation.isPending}
            >
              {(uploading || uploadMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Uploaded documents will be converted to structured format</p>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;