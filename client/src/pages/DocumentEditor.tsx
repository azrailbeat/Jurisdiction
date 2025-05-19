import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Document, DocumentVersion, User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Mock collaborators for demo purposes
const MOCK_COLLABORATORS = [
  {
    id: '1',
    name: 'Nikolay Ivanov',
    color: '#3B82F6',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100',
    status: 'active',
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'Arina Petrova',
    color: '#10B981',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100',
    status: 'idle',
    lastActive: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '3',
    name: 'Maxim Smirnov',
    color: '#EC4899',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100',
    status: 'offline',
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
  },
];

// Mock change history entries for demo
const MOCK_CHANGES = [
  {
    id: 1,
    userId: '1',
    userName: 'Nikolay Ivanov',
    action: 'edited',
    section: 'Article 3, Paragraph 2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    color: '#3B82F6',
  },
  {
    id: 2,
    userId: '2',
    userName: 'Arina Petrova',
    action: 'commented',
    section: 'Article 2, Paragraph 1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    color: '#10B981',
  },
  {
    id: 3,
    userId: '1',
    userName: 'Nikolay Ivanov',
    action: 'added',
    section: 'Article 4',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    color: '#3B82F6',
  },
];

// Format timestamp to relative time
const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay}d ago`;
  } else if (diffHour > 0) {
    return `${diffHour}h ago`;
  } else if (diffMin > 0) {
    return `${diffMin}m ago`;
  } else {
    return 'Just now';
  }
};

// Component to show user avatars with status indicators
const CollaboratorAvatar: React.FC<{ user: any, size?: 'sm' | 'md' | 'lg' }> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-gray-400',
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`rounded-full overflow-hidden ${sizeClasses[size]} ring-2`} 
              style={{ ringColor: user.color }}
            >
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-700"
                  style={{ backgroundColor: user.color, color: 'white' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user.status} - {formatTime(user.lastActive)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div 
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColors[user.status as keyof typeof statusColors]}`}
      ></div>
    </div>
  );
};

// Document Editor Page
const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const documentId = parseInt(id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState('editor');
  const [editMode, setEditMode] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [editableContent, setEditableContent] = useState('');
  const [documentTags, setDocumentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showSaveVersionDialog, setShowSaveVersionDialog] = useState(false);
  const [versionDescription, setVersionDescription] = useState('');
  const [isCommentMode, setIsCommentMode] = useState(false);
  
  // Fetch document data
  const { data: document, isLoading: isLoadingDocument } = useQuery<Document>({
    queryKey: [`/api/documents/${documentId}`],
    onSuccess: (data) => {
      setEditableContent(data.content);
      // Tags would come from the server in a real implementation
      setDocumentTags(['Civil Code', 'Draft', 'Family Law']);
    },
  });
  
  // Fetch document versions
  const { data: versions, isLoading: isLoadingVersions } = useQuery<DocumentVersion[]>({
    queryKey: [`/api/documents/${documentId}/versions`],
    onSuccess: (data) => {
      if (data.length > 0) {
        const currentVersion = data.find(v => v.isCurrent);
        if (currentVersion) {
          setSelectedVersion(currentVersion.version);
        }
      }
    },
  });

  // Save document mutation
  const saveDocumentMutation = useMutation({
    mutationFn: async (updatedDocument: Partial<Document>) => {
      return await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedDocument,
          updatedBy: user?.id,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}`] });
      toast({
        title: 'Success',
        description: 'Document saved successfully',
      });
      setEditMode(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save document',
        variant: 'destructive',
      });
    },
  });

  // Create version mutation
  const createVersionMutation = useMutation({
    mutationFn: async (versionData: any) => {
      return await fetch(`/api/documents/${documentId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/versions`] });
      toast({
        title: 'Success',
        description: 'New version created successfully',
      });
      setShowSaveVersionDialog(false);
      setVersionDescription('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create new version',
        variant: 'destructive',
      });
    },
  });

  // Handle document save
  const handleSaveDocument = () => {
    saveDocumentMutation.mutate({
      content: editableContent,
      // In a real implementation, we would also update the XML representation
      xml: `<document><body>${editableContent}</body></document>`,
    });
  };

  // Handle version save
  const handleSaveVersion = () => {
    createVersionMutation.mutate({
      content: editableContent,
      xml: `<document><body>${editableContent}</body></document>`,
      description: versionDescription,
      createdBy: user?.id,
      isCurrent: true,
    });
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !documentTags.includes(newTag.trim())) {
      setDocumentTags([...documentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setDocumentTags(documentTags.filter(tag => tag !== tagToRemove));
  };

  // Handle switching to a different version
  const handleVersionChange = (version: string) => {
    if (versions) {
      const selectedVersionData = versions.find(v => v.version === version);
      if (selectedVersionData) {
        setSelectedVersion(version);
        setEditableContent(selectedVersionData.content);
        toast({
          title: 'Version Changed',
          description: `Viewing version ${version}`,
        });
      }
    }
  };

  if (isLoadingDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-red-500">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Document Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">The document you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/documents')}>
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document header */}
      <div className="border-b bg-white py-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{document.title}</h1>
            <Badge variant={
              document.status === 'active' ? 'default' :
              document.status === 'draft' ? 'secondary' :
              document.status === 'review' ? 'warning' : 'outline'
            }>
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </Badge>
          </div>
          <div className="text-sm text-neutral-500 mt-1 flex flex-wrap gap-2">
            <span><i className="fas fa-code-branch mr-1"></i> Version {selectedVersion || document.currentVersion}</span>
            <span>•</span>
            <span><i className="fas fa-clock mr-1"></i> Last updated {new Date(document.updatedAt).toLocaleDateString()}</span>
          </div>
          
          {/* Document tags */}
          <div className="flex flex-wrap items-center mt-2 gap-2">
            {documentTags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-neutral-100 text-neutral-700">
                {tag}
                {editMode && (
                  <button 
                    className="ml-1 text-neutral-400 hover:text-red-500"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </Badge>
            ))}
            
            {editMode && (
              <div className="flex items-center">
                <Input 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="h-7 w-24 text-xs"
                  placeholder="Add tag..."
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2" 
                  onClick={handleAddTag}
                >
                  <i className="fas fa-plus text-xs"></i>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          {/* Collaborators */}
          <div className="flex -space-x-2 mr-3">
            {MOCK_COLLABORATORS.map(collaborator => (
              <CollaboratorAvatar key={collaborator.id} user={collaborator} />
            ))}
            <Button variant="outline" size="icon" className="rounded-full w-8 h-8 flex items-center justify-center ml-1" onClick={() => toast({ title: "Invite Collaborators", description: "This feature is coming soon!" })}>
              <i className="fas fa-plus text-xs"></i>
            </Button>
          </div>
          
          {/* Action buttons */}
          <Sheet open={showCommentsSidebar} onOpenChange={setShowCommentsSidebar}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <i className="fas fa-comments mr-2"></i>
                Comments
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Comments</SheetTitle>
                <SheetDescription>
                  Review and respond to comments on this document.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader className="py-3">
                      <div className="flex items-center">
                        <CollaboratorAvatar user={MOCK_COLLABORATORS[i % 3]} size="sm" />
                        <div className="ml-2">
                          <div className="text-sm font-medium">{MOCK_COLLABORATORS[i % 3].name}</div>
                          <div className="text-xs text-neutral-500">2h ago</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">Comment text example about Article {i} regarding the proposed changes to the legislative framework.</p>
                    </CardContent>
                    <CardFooter className="py-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <i className="fas fa-reply mr-1"></i> Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs ml-2">
                        <i className="fas fa-check mr-1"></i> Resolve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          
          <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <i className="fas fa-history mr-2"></i>
                History
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Version History</DialogTitle>
                <DialogDescription>
                  View and restore previous versions of this document.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 mb-4 space-y-1">
                {isLoadingVersions ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-neutral-500">Loading versions...</p>
                  </div>
                ) : versions && versions.length > 0 ? (
                  versions.map((version, index) => (
                    <div 
                      key={version.id} 
                      className={`flex items-center justify-between p-2 rounded ${selectedVersion === version.version ? 'bg-primary/10' : 'hover:bg-neutral-50'}`}
                      onClick={() => handleVersionChange(version.version)}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${version.isCurrent ? 'bg-green-500' : 'bg-neutral-300'} mr-2`}></div>
                        <div>
                          <div className="font-medium">
                            v{version.version}
                            {version.isCurrent && <span className="ml-2 text-xs text-green-600">(Current)</span>}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {new Date(version.createdAt).toLocaleDateString()} • {version.description || 'No description'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVersionChange(version.version);
                          setShowVersionHistory(false);
                        }}
                      >
                        {selectedVersion === version.version ? 'Current' : 'View'}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-neutral-500">
                    No version history available
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {editMode ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Dialog open={showSaveVersionDialog} onOpenChange={setShowSaveVersionDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <i className="fas fa-save mr-2"></i>
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save New Version</DialogTitle>
                    <DialogDescription>
                      Add a description to identify this version in the future.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Version Description</label>
                      <Textarea
                        placeholder="e.g., Updated Article 5 with new provisions for environmental protection"
                        value={versionDescription}
                        onChange={e => setVersionDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveVersionDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveVersion}
                      disabled={!versionDescription.trim()}
                    >
                      Create Version
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={handleSaveDocument}>
                <i className="fas fa-save mr-2"></i>
                Save as Draft
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <i className="fas fa-edit mr-2"></i>
              Edit Document
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden bg-neutral-50">
        <div className="flex-1 overflow-auto p-6">
          <Card className="bg-white shadow-sm border-neutral-200 mx-auto max-w-4xl min-h-[calc(100vh-240px)]">
            <CardContent className="p-8">
              {editMode ? (
                <div className="prose prose-neutral max-w-none min-h-[calc(100vh-300px)]">
                  <Textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="min-h-[calc(100vh-300px)] border-none focus-visible:ring-0 resize-none font-serif text-base"
                    placeholder="Start writing your document..."
                  />
                </div>
              ) : (
                <div className="prose prose-neutral max-w-none">
                  {editableContent ? (
                    <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                  ) : (
                    <div className="text-neutral-400 italic">No content available</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Activity sidebar */}
        <div className="hidden lg:block w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Document Activity</h3>
            <Separator className="mb-3" />
            
            <div className="space-y-3">
              {MOCK_CHANGES.map(change => (
                <div key={change.id} className="flex items-start space-x-3">
                  <div className="relative mt-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: change.color }}
                    ></div>
                    <div 
                      className="absolute top-3 left-1/2 w-0.5 h-10 -translate-x-1/2" 
                      style={{ backgroundColor: change.color, opacity: 0.3 }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{change.userName}</span>
                      <span className="text-neutral-400 text-xs ml-2">{formatTime(change.timestamp)}</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium">
                        {change.action === 'edited' && 'Edited'}
                        {change.action === 'commented' && 'Commented on'}
                        {change.action === 'added' && 'Added'}
                      </span>
                      {' '}
                      <span className="text-primary-dark font-medium">{change.section}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-semibold text-sm mb-2">Document Analysis</h3>
            <Separator className="mb-3" />
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Readability Score</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-green-500 text-green-600 font-bold text-xl">
                      85%
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Good</div>
                      <div className="text-xs text-neutral-500">Document is clear and readable</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Potential Conflicts</CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-yellow-500 text-yellow-600 font-bold text-xl">
                      2
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Minor conflicts</div>
                      <div className="text-xs text-neutral-500">With existing Civil Code provisions</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="py-2">
                  <Button variant="link" size="sm" className="text-xs">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Related Documents</CardTitle>
                </CardHeader>
                <CardContent className="py-1 space-y-2">
                  <div className="text-sm flex items-center">
                    <i className="fas fa-file-alt text-primary-dark mr-2"></i>
                    <span className="text-primary-dark hover:underline cursor-pointer">Tax Code (Article 15)</span>
                  </div>
                  <div className="text-sm flex items-center">
                    <i className="fas fa-file-alt text-primary-dark mr-2"></i>
                    <span className="text-primary-dark hover:underline cursor-pointer">Administrative Code (Article 7)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;