import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RelatedLegislation, VerificationIssue } from "@/types";

interface SemanticAnalysisProps {
  documentId: number;
}

const SemanticAnalysis: React.FC<SemanticAnalysisProps> = ({ documentId }) => {
  const { data: relatedLegislation, isLoading: isLoadingLegislation } = useQuery<RelatedLegislation[]>({
    queryKey: [`/api/documents/${documentId}/legislation`],
  });

  const { data: issues, isLoading: isLoadingIssues } = useQuery<VerificationIssue[]>({
    queryKey: [`/api/documents/${documentId}/issues`],
  });

  return (
    <Card>
      <CardHeader className="border-b p-4 pb-3">
        <CardTitle className="text-lg font-semibold">Semantic Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="font-medium mb-2">Related Legislation</h3>
          <div className="space-y-2">
            {isLoadingLegislation ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center p-2 border rounded-md">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-5" />
                </div>
              ))
            ) : relatedLegislation?.length ? (
              relatedLegislation.map((legislation) => (
                <Link key={legislation.id} href={`/documents/${legislation.externalId}`}>
                  <a className="flex items-center p-2 border rounded-md hover:bg-neutral-50 cursor-pointer">
                    <div className="flex-1">
                      <div className="font-medium">{legislation.title}</div>
                      <div className="text-sm text-neutral-400">{legislation.relevance}% relevance</div>
                    </div>
                    <div className="text-primary">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className="p-3 text-center text-neutral-400">
                No related legislation found
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Potential Conflicts</h3>
          {isLoadingIssues ? (
            <Skeleton className="h-24 w-full rounded-md" />
          ) : issues?.length ? (
            issues.filter(issue => issue.status === 'open').map((issue) => (
              <div 
                key={issue.id}
                className={`bg-${issue.severity === 'warning' ? 'status-warning' : 'status-error'} bg-opacity-10 border border-${issue.severity === 'warning' ? 'status-warning' : 'status-error'} rounded-md p-3`}
              >
                <div className={`font-medium text-${issue.severity === 'warning' ? 'status-warning' : 'status-error'} mb-1`}>
                  {issue.title}
                </div>
                <p className="text-sm mb-2">{issue.description}</p>
                <Link href={`/verification/issues/${issue.id}`}>
                  <Button 
                    variant="link" 
                    className={`text-sm text-${issue.severity === 'warning' ? 'status-warning' : 'status-error'} p-0 h-auto`}
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-400 border rounded-md">
              No potential conflicts detected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SemanticAnalysis;
