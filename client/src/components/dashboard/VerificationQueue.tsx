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
import { VerificationIssue } from "@/types";

const VerificationQueue: React.FC = () => {
  const { data: issues, isLoading } = useQuery<VerificationIssue[]>({
    queryKey: ['/api/verification/issues?status=open&limit=2'],
  });

  const getIssueButton = (issue: VerificationIssue) => {
    switch (issue.severity) {
      case 'warning':
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-status-warning text-status-warning hover:bg-status-warning hover:text-white transition-colors"
          >
            Review Conflicts
          </Button>
        );
      case 'error':
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-status-error text-status-error hover:bg-status-error hover:text-white transition-colors"
          >
            Review Urgently
          </Button>
        );
      default:
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            Review Issue
          </Button>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Verification Queue</CardTitle>
        <Link href="/verification">
          <a className="text-sm text-primary cursor-pointer">View All</a>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))
          ) : issues?.length ? (
            issues.map((issue) => (
              <div 
                key={issue.id} 
                className={`p-3 border rounded-md ${
                  issue.severity === 'warning' 
                    ? 'border-status-warning bg-status-warning bg-opacity-10' 
                    : issue.severity === 'error'
                    ? 'border-status-error bg-status-error bg-opacity-10'
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{issue.title}</h3>
                  <span className={`text-sm font-medium ${
                    issue.severity === 'warning' 
                      ? 'text-status-warning' 
                      : issue.severity === 'error'
                      ? 'text-status-error'
                      : 'text-neutral-500'
                  }`}>
                    {issue.severity === 'warning' && '3 conflicts'}
                    {issue.severity === 'error' && '7 conflicts'}
                    {issue.severity === 'info' && 'Info'}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mb-2">{issue.description}</p>
                <Link href={`/verification/issues/${issue.id}`}>
                  {getIssueButton(issue)}
                </Link>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-400">
              No verification issues found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationQueue;
