import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Document, Activity } from '@/types';
import { formatDistance } from 'date-fns';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Fetch recent documents
  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ['/api/documents?limit=3'],
  });
  
  // Fetch activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/activities?limit=5'],
  });

  // Calculate stats
  const documentStats = {
    total: recentDocuments?.length || 0,
    draft: recentDocuments?.filter(doc => doc.status === 'draft').length || 0,
    active: recentDocuments?.filter(doc => doc.status === 'active').length || 0,
    review: recentDocuments?.filter(doc => doc.status === 'review').length || 0,
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistance(parsedDate, new Date(), { addSuffix: true });
  };

  // Handle status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'review':
        return <Badge className="bg-amber-500 hover:bg-amber-600">In Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to LegalTrack
            </h1>
            <p className="text-primary-foreground/90 max-w-2xl mb-4">
              Your comprehensive platform for drafting, managing, and analyzing legislative documents with collaboration and version control.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" className="font-medium" onClick={() => navigate('/documents')}>
                <i className="fas fa-file-alt mr-2"></i>
                Browse Documents
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-medium" onClick={() => navigate('/documents?new=true')}>
                <i className="fas fa-plus mr-2"></i>
                Create New Document
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <i className="fas fa-scale-balanced text-8xl text-white/80"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and quick access section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Document Overview</CardTitle>
            <CardDescription>Summary of your legislation library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-1">{documentStats.total}</div>
                <div className="text-sm text-neutral-600">Total Documents</div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-amber-500 mb-1">{documentStats.review}</div>
                <div className="text-sm text-neutral-600">In Review</div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-neutral-500 mb-1">{documentStats.draft}</div>
                <div className="text-sm text-neutral-600">Drafts</div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{documentStats.active}</div>
                <div className="text-sm text-neutral-600">Active</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/documents')}>
              <i className="fas fa-chart-bar mr-2"></i>
              View All Documents
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Documents</CardTitle>
            <CardDescription>Your recently accessed documents</CardDescription>
          </CardHeader>
          <CardContent className="h-[230px]">
            {isLoadingDocuments ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentDocuments && recentDocuments.length > 0 ? (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                  {recentDocuments.map(doc => (
                    <div 
                      key={doc.id}
                      className="p-3 border rounded-lg hover:bg-neutral-50 transition cursor-pointer"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <i className="fas fa-file-alt text-primary mr-3 text-xl"></i>
                          <div>
                            <div className="font-medium line-clamp-1">{doc.title}</div>
                            <div className="text-xs text-neutral-500 mt-1">
                              Updated {formatDate(doc.updatedAt)}
                            </div>
                          </div>
                        </div>
                        <div>{getStatusBadge(doc.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <i className="fas fa-folder-open text-3xl mb-2"></i>
                <p>No documents yet</p>
                <Button variant="link" className="mt-2" onClick={() => navigate('/documents?new=true')}>
                  Create your first document
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/documents')}>
              <i className="fas fa-file-alt mr-2"></i>
              View All Documents
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest actions on your documents</CardDescription>
          </CardHeader>
          <CardContent className="h-[230px]">
            {isLoadingActivities ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activities && activities.length > 0 ? (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <i className={`fas ${
                          activity.type === 'create' ? 'fa-plus' :
                          activity.type === 'update' ? 'fa-pen' :
                          activity.type === 'comment' ? 'fa-comment' :
                          'fa-circle-info'
                        }`}></i>
                      </div>
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {activity.createdAt && formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <i className="fas fa-history text-3xl mb-2"></i>
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/activities')}>
              <i className="fas fa-history mr-2"></i>
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick access tools */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Access Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:border-primary hover:shadow-md transition cursor-pointer" onClick={() => navigate('/knowledge-graph')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                  <i className="fas fa-diagram-project text-xl"></i>
                </div>
                <h3 className="font-semibold mb-1">Knowledge Graph</h3>
                <p className="text-sm text-neutral-500">Visualize document relationships</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary hover:shadow-md transition cursor-pointer" onClick={() => navigate('/verification')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-4">
                  <i className="fas fa-check-double text-xl"></i>
                </div>
                <h3 className="font-semibold mb-1">Verification</h3>
                <p className="text-sm text-neutral-500">Validate document compliance</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary hover:shadow-md transition cursor-pointer" onClick={() => navigate('/terminology')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
                  <i className="fas fa-book text-xl"></i>
                </div>
                <h3 className="font-semibold mb-1">Terminology</h3>
                <p className="text-sm text-neutral-500">Manage legal term definitions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary hover:shadow-md transition cursor-pointer" onClick={() => navigate('/versions')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                  <i className="fas fa-code-branch text-xl"></i>
                </div>
                <h3 className="font-semibold mb-1">Version Control</h3>
                <p className="text-sm text-neutral-500">Manage document revisions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;