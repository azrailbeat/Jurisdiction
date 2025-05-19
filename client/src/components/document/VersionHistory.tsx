import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentVersion } from "@/types";
import { formatDistance } from "date-fns";

interface VersionHistoryProps {
  documentId: number;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ documentId }) => {
  const { data: versions, isLoading } = useQuery<DocumentVersion[]>({
    queryKey: [`/api/documents/${documentId}/versions`],
  });

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader className="border-b p-4 pb-3">
        <CardTitle className="text-lg font-semibold">Version History</CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-64 overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-neutral-200"></div>
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative flex items-start mb-4">
                <Skeleton className="flex-shrink-0 h-8 w-8 rounded-full bg-white z-10" />
                <div className="ml-4 pt-1">
                  <div className="flex items-center text-sm">
                    <Skeleton className="h-4 w-20 mb-1" />
                  </div>
                  <Skeleton className="h-3 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))
          ) : versions?.length ? (
            versions.map((version, index) => (
              <div key={version.id} className="relative flex items-start mb-4">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full border-2 ${
                  version.isCurrent ? 'border-primary' : 'border-neutral-300'
                } bg-white flex items-center justify-center z-10`}>
                  <i className={`fas fa-code-branch text-sm ${
                    version.isCurrent ? 'text-primary' : 'text-neutral-400'
                  }`}></i>
                </div>
                <div className="ml-4 pt-1">
                  <div className="flex items-center text-sm">
                    <span className="font-medium">Version {version.version}</span>
                    {version.isCurrent && (
                      <Badge className="ml-2 text-xs bg-primary text-white">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">
                    {formatDate(version.createdAt)} by {version.createdBy?.name || "Unknown User"}
                  </p>
                  <p className="text-sm mt-1">{version.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-400">
              No version history available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionHistory;
