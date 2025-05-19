import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mock verification issues for UI display
const MOCK_ISSUES = [
  {
    id: 1,
    title: 'Conflicting provision in Article 15',
    description: 'The proposed text conflicts with existing Article A-7 in the Civil Code regarding property rights.',
    documentId: 1,
    documentTitle: 'Civil Code of Kazakhstan',
    severity: 'high',
    status: 'open',
    location: 'Article 15, Paragraph 3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: 2,
    title: 'Ambiguous language in penalty clause',
    description: 'The term "reasonable period" is not clearly defined and may lead to inconsistent application.',
    documentId: 1,
    documentTitle: 'Civil Code of Kazakhstan',
    severity: 'medium',
    status: 'reviewing',
    location: 'Article 23, Paragraph 5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: 3,
    title: 'Possible constitutional conflict',
    description: 'The proposed regulation may infringe on constitutional rights as defined in Article 14 of the Constitution.',
    documentId: 2,
    documentTitle: 'Criminal Code of Kazakhstan',
    severity: 'critical',
    status: 'open',
    location: 'Article 7, Paragraph 2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: 4,
    title: 'Inconsistent terminology usage',
    description: 'The term "digital assets" is defined differently from its usage in the Financial Regulation Act.',
    documentId: 1,
    documentTitle: 'Civil Code of Kazakhstan',
    severity: 'low',
    status: 'resolved',
    location: 'Article 45, Paragraph 1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: 5,
    title: 'Reference to repealed statute',
    description: 'The document references Law 235-IV which was repealed in the previous legislative session.',
    documentId: 2,
    documentTitle: 'Criminal Code of Kazakhstan',
    severity: 'medium',
    status: 'open',
    location: 'Article 18, Paragraph 4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
];

const VerificationPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortOrder, setSortOrder] = useState<'date' | 'severity'>('date');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('issues');
  
  // Fetch verification issues
  const { data: issues = MOCK_ISSUES, isLoading } = useQuery({
    queryKey: ['/api/verification/issues'],
  });

  // Fetch documents for reference
  const { data: documents } = useQuery({
    queryKey: ['/api/documents'],
  });

  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistance(parsedDate, new Date(), { addSuffix: true });
  };

  // Filter issues based on search query and filters
  const filteredIssues = issues.filter((issue: any) => {
    // Apply search query filter
    const matchesSearch = searchQuery ? 
      (issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    
    // Apply status filter
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    
    // Apply severity filter
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Get sorted issues
  const sortedIssues = [...filteredIssues].sort((a: any, b: any) => {
    if (sortOrder === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'severity') {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
    }
    return 0;
  });

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Reviewing</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-500 text-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate verification metrics
  const metrics = {
    total: issues.length,
    open: issues.filter((issue: any) => issue.status === 'open').length,
    resolved: issues.filter((issue: any) => issue.status === 'resolved').length,
    critical: issues.filter((issue: any) => issue.severity === 'critical').length,
    compliance: Math.round((1 - (issues.filter((issue: any) => issue.status === 'open' && (issue.severity === 'critical' || issue.severity === 'high')).length / Math.max(issues.length, 1))) * 100),
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Verification</h1>
          <p className="text-neutral-500 mt-1">
            Analyze and resolve legal compliance issues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setActiveTab('issues')}>
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Issues
            <Badge className="ml-2 bg-neutral-200 text-neutral-700">{issues.length}</Badge>
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('compliance')}>
            <i className="fas fa-shield-alt mr-2"></i>
            Compliance Report
          </Button>
          <Button>
            <i className="fas fa-wand-magic-sparkles mr-2"></i>
            Run Verification
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left panel - Issue list */}
        <div className={`flex-1 ${activeTab === 'compliance' ? 'hidden lg:block' : ''}`}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Verification Issues</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterSeverity}
                    onValueChange={setFilterSeverity}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <div className="absolute left-3 top-3 text-neutral-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : sortedIssues.length > 0 ? (
                <div className="divide-y">
                  {sortedIssues.map((issue: any) => (
                    <div 
                      key={issue.id} 
                      className={`p-4 hover:bg-neutral-50 cursor-pointer transition-colors ${selectedIssue?.id === issue.id ? 'bg-neutral-50' : ''}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{issue.title}</div>
                          <div className="text-sm text-neutral-500 mt-1">{issue.location}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getSeverityBadge(issue.severity)}
                          <div className="text-xs text-neutral-400">{formatDate(issue.createdAt)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {issue.description}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-xs bg-neutral-100 px-2 py-1 rounded">
                            <i className="fas fa-file-lines mr-1 text-neutral-500"></i>
                            {issue.documentTitle}
                          </div>
                        </div>
                        {getStatusBadge(issue.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
                  <div className="text-4xl mb-4">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-1">No issues found</h3>
                  <p className="text-center text-sm">
                    {searchQuery || filterStatus !== 'all' || filterSeverity !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'All documents have passed verification'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Issue details */}
        <div className={`${activeTab === 'issues' ? 'hidden lg:block' : ''} w-full lg:w-[450px]`}>
          {activeTab === 'compliance' ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Compliance Report</CardTitle>
                <CardDescription>
                  Overall compliance status of your documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Overall Compliance</span>
                      <span className={metrics.compliance >= 70 ? 'text-green-600' : metrics.compliance >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                        {metrics.compliance}%
                      </span>
                    </div>
                    <Progress value={metrics.compliance} className={
                      metrics.compliance >= 70 ? 'text-green-600' : 
                      metrics.compliance >= 40 ? 'text-yellow-600' : 
                      'text-red-600'
                    } />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">Open Issues</span>
                          <span className="font-semibold text-lg">{metrics.open}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">Resolved</span>
                          <span className="font-semibold text-lg">{metrics.resolved}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">Critical Issues</span>
                          <span className="font-semibold text-lg text-red-600">{metrics.critical}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">Total Analyzed</span>
                          <span className="font-semibold text-lg">{metrics.total}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-3">Documents Verification Status</h3>
                  <div className="space-y-4">
                    {documents?.map((doc: any) => {
                      const docIssues = issues.filter((issue: any) => issue.documentId === doc.id);
                      const openIssues = docIssues.filter((issue: any) => issue.status === 'open').length;
                      const criticalIssues = docIssues.filter((issue: any) => issue.severity === 'critical' && issue.status === 'open').length;
                      const highIssues = docIssues.filter((issue: any) => issue.severity === 'high' && issue.status === 'open').length;
                      const complianceScore = docIssues.length > 0 
                        ? Math.round((1 - ((criticalIssues * 3 + highIssues) / (docIssues.length * 3))) * 100)
                        : 100;
                      
                      return (
                        <Card key={doc.id} className="overflow-hidden">
                          <div className={`h-1 ${
                            complianceScore >= 80 ? 'bg-green-500' : 
                            complianceScore >= 50 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}></div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{doc.title}</div>
                                <div className="text-sm text-neutral-500 mt-1">
                                  {openIssues} open issues
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-semibold ${
                                  complianceScore >= 80 ? 'text-green-600' : 
                                  complianceScore >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {complianceScore}%
                                </div>
                                <div className="text-xs text-neutral-500 mt-1">Compliance</div>
                              </div>
                            </div>
                            {criticalIssues > 0 && (
                              <div className="mt-2 text-xs text-red-600">
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {criticalIssues} critical issue{criticalIssues > 1 ? 's' : ''} detected
                              </div>
                            )}
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  setFilterStatus('all');
                                  setFilterSeverity('all');
                                  setSearchQuery('');
                                  setActiveTab('issues');
                                }}
                              >
                                View Issues
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedIssue ? (
            <Card className="h-full">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <CardTitle>{selectedIssue.title}</CardTitle>
                    <CardDescription>
                      {selectedIssue.location}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedIssue(null)} className="h-8 w-8 lg:hidden">
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {getSeverityBadge(selectedIssue.severity)}
                    {getStatusBadge(selectedIssue.status)}
                    <Badge variant="outline" className="text-neutral-600">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      {formatDate(selectedIssue.createdAt)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Document</h3>
                    <Card className="bg-neutral-50">
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <i className="fas fa-file-lines text-primary mr-3"></i>
                          <div>
                            <div className="font-medium">{selectedIssue.documentTitle}</div>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs"
                              onClick={() => navigate(`/documents/${selectedIssue.documentId}`)}
                            >
                              View Document
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Issue Description</h3>
                    <div className="text-neutral-700">
                      {selectedIssue.description}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recommended Action</h3>
                    <div className="text-neutral-700">
                      {selectedIssue.severity === 'critical' ?
                        'This issue requires immediate attention. Review the conflicting sections and resolve the inconsistency before this document can be approved.' :
                        selectedIssue.severity === 'high' ?
                        'This issue should be addressed before final approval. Consider revising the identified section to ensure compliance with existing regulations.' :
                        selectedIssue.severity === 'medium' ?
                        'This issue may cause ambiguity. Consider clarifying the language to ensure consistent interpretation.' :
                        'This issue is minor but should be reviewed. Consider updating the references or terminology for consistency.'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">History</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" />
                          <AvatarFallback>MS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm">
                            <span className="font-medium">Maxim Smirnov</span>
                            <span className="text-neutral-500"> opened this issue</span>
                          </div>
                          <div className="text-xs text-neutral-500">{formatDate(selectedIssue.createdAt)}</div>
                        </div>
                      </div>
                      
                      {selectedIssue.status === 'reviewing' && (
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" />
                            <AvatarFallback>AP</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">
                              <span className="font-medium">Arina Petrova</span>
                              <span className="text-neutral-500"> started reviewing</span>
                            </div>
                            <div className="text-xs text-neutral-500">{formatDate(new Date(Date.now() - 1000 * 60 * 30))}</div>
                          </div>
                        </div>
                      )}
                      
                      {selectedIssue.status === 'resolved' && (
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" />
                            <AvatarFallback>NI</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">
                              <span className="font-medium">Nikolay Ivanov</span>
                              <span className="text-neutral-500"> resolved this issue</span>
                            </div>
                            <div className="text-xs text-neutral-500">{formatDate(new Date(Date.now() - 1000 * 60 * 60))}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                {selectedIssue.status === 'open' && (
                  <>
                    <Button className="flex-1">
                      <i className="fas fa-play mr-2"></i>
                      Start Review
                    </Button>
                    <Button variant="outline">
                      <i className="fas fa-comment mr-2"></i>
                      Comment
                    </Button>
                  </>
                )}
                
                {selectedIssue.status === 'reviewing' && (
                  <>
                    <Button className="flex-1">
                      <i className="fas fa-check mr-2"></i>
                      Mark as Resolved
                    </Button>
                    <Button variant="outline">
                      <i className="fas fa-comment mr-2"></i>
                      Comment
                    </Button>
                  </>
                )}
                
                {selectedIssue.status === 'resolved' && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <i className="fas fa-eye mr-2"></i>
                      View Resolution
                    </Button>
                    <Button variant="outline">
                      <i className="fas fa-redo mr-2"></i>
                      Reopen
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="text-5xl text-neutral-300 mb-4">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">Select an issue</h3>
              <p className="text-neutral-500 mb-6">
                Choose an issue from the list to view its details and take action
              </p>
              <Button variant="outline" onClick={() => setActiveTab('compliance')}>
                <i className="fas fa-chart-line mr-2"></i>
                View Compliance Report
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;