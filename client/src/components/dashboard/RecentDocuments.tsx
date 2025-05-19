import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Document } from "@/types";
import { formatDistance } from "date-fns";

const RecentDocuments: React.FC = () => {
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents?limit=3'],
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
        <Link href="/documents">
          <a className="text-sm text-primary cursor-pointer">View All</a>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center p-3 hover:bg-neutral-100 rounded-md">
                <div className="mr-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))
          ) : documents?.length ? (
            documents.map((document) => (
              <Link key={document.id} href={`/documents/${document.id}`}>
                <a className="flex items-center p-3 hover:bg-neutral-100 rounded-md cursor-pointer">
                  <div className="mr-4 text-primary">
                    <i className="fas fa-file-lines text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{document.title}</h3>
                    <p className="text-sm text-neutral-400">
                      Last updated: {formatDate(document.updatedAt)}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(document.status)}
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-400">
              No documents found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;
