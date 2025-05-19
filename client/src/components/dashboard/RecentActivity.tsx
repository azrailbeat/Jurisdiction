import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "@/types";
import { formatDistance } from "date-fns";

const RecentActivity: React.FC = () => {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities?limit=3'],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'merge':
        return (
          <div className="mr-4 mt-1 w-8 h-8 flex-shrink-0 bg-accent rounded-full flex items-center justify-center text-white">
            <i className="fas fa-code-merge text-sm"></i>
          </div>
        );
      case 'comment':
        return (
          <div className="mr-4 mt-1 w-8 h-8 flex-shrink-0 bg-secondary rounded-full flex items-center justify-center text-white">
            <i className="fas fa-comment-dots text-sm"></i>
          </div>
        );
      case 'create':
        return (
          <div className="mr-4 mt-1 w-8 h-8 flex-shrink-0 bg-primary rounded-full flex items-center justify-center text-white">
            <i className="fas fa-plus text-sm"></i>
          </div>
        );
      case 'update':
        return (
          <div className="mr-4 mt-1 w-8 h-8 flex-shrink-0 bg-primary rounded-full flex items-center justify-center text-white">
            <i className="fas fa-pen text-sm"></i>
          </div>
        );
      default:
        return (
          <div className="mr-4 mt-1 w-8 h-8 flex-shrink-0 bg-neutral-300 rounded-full flex items-center justify-center text-white">
            <i className="fas fa-circle-info text-sm"></i>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const renderActivityDescription = (activity: Activity) => {
    return (
      <p className="text-sm">
        <span className="font-medium">{activity.user?.name || "User"}</span>{" "}
        {activity.description.includes(activity.documentTitle || "") ? (
          <>
            {activity.description.split(activity.documentTitle || "")[0]}
            <Link href={`/documents/${activity.documentId}`}>
              <a className="text-primary">{activity.documentTitle}</a>
            </Link>
            {activity.description.split(activity.documentTitle || "")[1]}
          </>
        ) : (
          activity.description
        )}
      </p>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Link href="/activities">
          <a className="text-sm text-primary cursor-pointer">View All</a>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="mr-4 mt-1 w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : activities?.length ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                {getActivityIcon(activity.type)}
                <div>
                  {renderActivityDescription(activity)}
                  <p className="text-xs text-neutral-400">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-400">
              No recent activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
