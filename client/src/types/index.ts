export interface User {
  id: number;
  username: string;
  name: string;
  avatar?: string;
}

export type DocumentStatus = 'draft' | 'review' | 'active' | 'archived';

export interface Document {
  id: number;
  title: string;
  status: DocumentStatus;
  lastUpdated: string;
  lastUpdatedBy: User;
  version: string;
  content: string;
  xml: string;
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
  severity: 'warning' | 'error' | 'info';
  status: 'open' | 'resolved' | 'ignored';
  location: string;
  conflictingReferenceId?: string;
  conflictingReferenceTitle?: string;
  conflictingReferenceContent?: string;
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
