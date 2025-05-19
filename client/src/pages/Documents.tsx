import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Document } from '@/types';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock collaborators for UI display
const MOCK_COLLABORATORS = [
  {
    id: '1',
    name: 'Nikolay Ivanov',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40',
  },
  {
    id: '2',
    name: 'Arina Petrova',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40',
  },
];

const DocumentsPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newDocumentOpen, setNewDocumentOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    status: 'draft',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'date' | 'title' | 'status'>('date');
  
  // Fetch documents
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (document: any) => {
      return await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...document,
          createdBy: user?.id,
        }),
      }).then(res => res.json());
    },
    onSuccess: (newDocument) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      setNewDocumentOpen(false);
      navigate(`/documents/${newDocument.id}`);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create document',
        variant: 'destructive',
      });
    },
  });

  // Handle search and filtering
  const filteredDocuments = documents.filter(doc => {
    // Apply search query filter
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return formatDistance(parsedDate, new Date(), { addSuffix: true });
  };

  // Handle create document form submission
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDocument.title.trim()) {
      toast({
        title: 'Error',
        description: 'Document title is required',
        variant: 'destructive',
      });
      return;
    }
    
    createDocumentMutation.mutate({
      title: newDocument.title,
      description: newDocument.description,
      status: newDocument.status,
      content: '',
      xml: '<document></document>',
    });
  };

  // Get status badge
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

  // Render document grid view
  const renderDocumentGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedDocuments.map(doc => (
          <Card 
            key={doc.id} 
            className="hover:shadow-md transition cursor-pointer border-neutral-200 overflow-hidden flex flex-col"
            onClick={() => navigate(`/documents/${doc.id}`)}
          >
            <div className="h-3 w-full bg-primary"></div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{doc.title}</CardTitle>
                {getStatusBadge(doc.status)}
              </div>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {doc.description || 'No description provided.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="flex justify-between text-sm text-neutral-500">
                <div>
                  <i className="fas fa-clock mr-1"></i> {formatDate(doc.updatedAt)}
                </div>
                <div>
                  <i className="fas fa-code-branch mr-1"></i> v{doc.currentVersion || '1.0'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 pb-4 border-t">
              <div className="flex justify-between items-center w-full">
                <div className="flex -space-x-2">
                  {MOCK_COLLABORATORS.map(collab => (
                    <Avatar key={collab.id} className="h-7 w-7 border-2 border-white">
                      <AvatarImage src={collab.profileImageUrl} alt={collab.name} />
                      <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs border-2 border-white">
                    +2
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/documents/${doc.id}`);
                }}>
                  <i className="fas fa-arrow-right"></i>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {/* New document card */}
        <Card 
          className="border-dashed border-2 border-neutral-200 hover:border-primary hover:bg-primary/5 transition cursor-pointer flex flex-col items-center justify-center h-[280px]"
          onClick={() => setNewDocumentOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <i className="fas fa-plus text-xl"></i>
            </div>
            <CardTitle className="text-lg mb-2">Create New Document</CardTitle>
            <CardDescription>
              Start drafting a new legislative document
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render document list view
  const renderDocumentList = () => {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Collaborators</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.map(doc => (
              <TableRow 
                key={doc.id}
                className="cursor-pointer hover:bg-neutral-50"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    {doc.description && (
                      <div className="text-sm text-neutral-500 line-clamp-1 mt-1">{doc.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>v{doc.currentVersion || '1.0'}</TableCell>
                <TableCell>{formatDate(doc.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {MOCK_COLLABORATORS.map(collab => (
                      <Avatar key={collab.id} className="h-7 w-7 border-2 border-white">
                        <AvatarImage src={collab.profileImageUrl} alt={collab.name} />
                        <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs border-2 border-white">
                      +2
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <i className="fas fa-ellipsis-vertical"></i>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/documents/${doc.id}`);
                      }}>
                        <i className="fas fa-edit mr-2"></i> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // Functionality to duplicate document
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Document duplication will be available in a future update',
                        });
                      }}>
                        <i className="fas fa-copy mr-2"></i> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // Add archive functionality
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Document archiving will be available in a future update',
                        });
                      }} className="text-amber-600">
                        <i className="fas fa-box-archive mr-2"></i> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // Add delete functionality
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Document deletion will be available in a future update',
                        });
                      }} className="text-red-600">
                        <i className="fas fa-trash mr-2"></i> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex justify-center py-4 border-t">
          <Button variant="outline" onClick={() => setNewDocumentOpen(true)}>
            <i className="fas fa-plus mr-2"></i> Create New Document
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('documents.title')}</h1>
          <p className="text-neutral-500 mt-1">
            {t('documents.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-neutral-100' : ''}>
            <i className="fas fa-grip"></i>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-neutral-100' : ''}>
            <i className="fas fa-list"></i>
          </Button>
          <Button onClick={() => setNewDocumentOpen(true)}>
            <i className="fas fa-plus mr-2"></i> {t('documents.actions.newDocument')}
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className="bg-white p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder={t('documents.actions.searchDocuments')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <div className="absolute left-3 top-3 text-neutral-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('documents.table.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.status.all')}</SelectItem>
                <SelectItem value="draft">{t('common.status.draft')}</SelectItem>
                <SelectItem value="review">{t('common.status.review')}</SelectItem>
                <SelectItem value="active">{t('common.status.approved')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('common.sort')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t('documents.table.modified')}</SelectItem>
                <SelectItem value="title">{t('documents.table.title')}</SelectItem>
                <SelectItem value="status">{t('documents.table.status')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Document List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-neutral-500">{t('common.loading')}</span>
        </div>
      ) : sortedDocuments.length > 0 ? (
        viewMode === 'grid' ? renderDocumentGrid() : renderDocumentList()
      ) : (
        <Card className="bg-white p-12 text-center">
          <div className="mb-4">
            <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <i className="fas fa-folder-open text-3xl"></i>
            </div>
          </div>
          <h2 className="text-xl font-semibold">{t('documents.emptyState.title')}</h2>
          <p className="text-neutral-500 mt-2 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? t('common.noResults') 
              : t('documents.emptyState.description')}
          </p>
          <Button onClick={() => setNewDocumentOpen(true)}>
            <i className="fas fa-plus mr-2"></i> {t('documents.actions.newDocument')}
          </Button>
        </Card>
      )}
      
      {/* Create Document Dialog */}
      <Dialog open={newDocumentOpen} onOpenChange={setNewDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Provide basic information to start your new legislative document.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input
                  required
                  placeholder="e.g., Civil Code Amendment 2025"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Briefly describe the purpose of this document..."
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={newDocument.status} 
                  onValueChange={(value) => setNewDocument({...newDocument, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewDocumentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createDocumentMutation.isPending}>
                {createDocumentMutation.isPending ? 
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Creating...</> : 
                  <><i className="fas fa-plus mr-2"></i> Create Document</>
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsPage;