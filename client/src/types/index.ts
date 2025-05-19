export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type DocumentStatus = 'draft' | 'review' | 'active' | 'archived';

export interface Document {
  id: number;
  title: string;
  status: DocumentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  currentVersion: string;
  content: string;
  xml: string;
  createdBy: string;
  updatedBy: string;
}

export interface DocumentVersion {
  id: number;
  documentId: number;
  version: string;
  createdAt: string;
  createdBy: User;
  description: string;
  isCurrent: boolean;
}

export interface Activity {
  id: number;
  type: 'merge' | 'comment' | 'create' | 'update' | 'delete';
  description: string;
  timestamp: string;
  user: User;
  documentId?: number;
  documentTitle?: string;
}

export interface VerificationIssue {
  id: number;
  documentId: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  location: string;
  conflictingReferenceId: string | null;
  conflictingReferenceTitle: string | null;
  conflictingReferenceContent: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RelatedLegislation {
  id: number;
  title: string;
  relevance: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'document' | 'term' | 'entity' | 'article';
  properties?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  properties?: Record<string, any>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface SearchResult {
  id: number;
  title: string;
  snippet: string;
  type: 'document' | 'term' | 'article';
  relevance: number;
}
