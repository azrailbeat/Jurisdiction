import {
  User, InsertUser, UpsertUser,
  Document, InsertDocument,
  DocumentVersion, InsertDocumentVersion,
  Activity, InsertActivity,
  VerificationIssue, InsertVerificationIssue,
  RelatedLegislation, InsertRelatedLegislation,
  KnowledgeGraphNode, InsertKnowledgeGraphNode,
  KnowledgeGraphEdge, InsertKnowledgeGraphEdge,
  LegalTerm, InsertLegalTerm,
  users, documents, documentVersions, activities,
  verificationIssues, relatedLegislation, knowledgeGraphNodes,
  knowledgeGraphEdges, legalTerms
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Document Version operations
  getDocumentVersions(documentId: number): Promise<DocumentVersion[]>;
  getDocumentVersion(id: number): Promise<DocumentVersion | undefined>;
  createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion>;
  
  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  getDocumentActivities(documentId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Verification Issue operations
  getVerificationIssues(documentId: number): Promise<VerificationIssue[]>;
  getVerificationIssue(id: number): Promise<VerificationIssue | undefined>;
  createVerificationIssue(issue: InsertVerificationIssue): Promise<VerificationIssue>;
  updateVerificationIssue(id: number, issue: Partial<InsertVerificationIssue>): Promise<VerificationIssue | undefined>;
  
  // Related Legislation operations
  getRelatedLegislation(documentId: number): Promise<RelatedLegislation[]>;
  createRelatedLegislation(legislation: InsertRelatedLegislation): Promise<RelatedLegislation>;
  
  // Knowledge Graph operations
  getKnowledgeGraphNodes(): Promise<KnowledgeGraphNode[]>;
  getKnowledgeGraphEdges(): Promise<KnowledgeGraphEdge[]>;
  createKnowledgeGraphNode(node: InsertKnowledgeGraphNode): Promise<KnowledgeGraphNode>;
  createKnowledgeGraphEdge(edge: InsertKnowledgeGraphEdge): Promise<KnowledgeGraphEdge>;
  
  // Legal Term operations
  getLegalTerms(): Promise<LegalTerm[]>;
  getLegalTerm(id: number): Promise<LegalTerm | undefined>;
  getLegalTermByTerm(term: string): Promise<LegalTerm | undefined>;
  createLegalTerm(term: InsertLegalTerm): Promise<LegalTerm>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private documentVersions: Map<number, DocumentVersion>;
  private activities: Map<number, Activity>;
  private verificationIssues: Map<number, VerificationIssue>;
  private relatedLegislation: Map<number, RelatedLegislation>;
  private knowledgeGraphNodes: Map<string, KnowledgeGraphNode>;
  private knowledgeGraphEdges: Map<string, KnowledgeGraphEdge>;
  private legalTerms: Map<number, LegalTerm>;
  
  private userId: number;
  private documentId: number;
  private documentVersionId: number;
  private activityId: number;
  private verificationIssueId: number;
  private relatedLegislationId: number;
  private legalTermId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.documentVersions = new Map();
    this.activities = new Map();
    this.verificationIssues = new Map();
    this.relatedLegislation = new Map();
    this.knowledgeGraphNodes = new Map();
    this.knowledgeGraphEdges = new Map();
    this.legalTerms = new Map();
    
    this.userId = 1;
    this.documentId = 1;
    this.documentVersionId = 1;
    this.activityId = 1;
    this.verificationIssueId = 1;
    this.relatedLegislationId = 1;
    this.legalTermId = 1;
    
    // Add example user
    this.createUser({
      username: "admin",
      password: "password",
      name: "Nikolay Ivanov",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateDocument: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument: Document = {
      ...document,
      ...updateDocument,
      updatedAt: new Date(),
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Document Version operations
  async getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
    return Array.from(this.documentVersions.values()).filter(
      (version) => version.documentId === documentId
    );
  }

  async getDocumentVersion(id: number): Promise<DocumentVersion | undefined> {
    return this.documentVersions.get(id);
  }

  async createDocumentVersion(insertVersion: InsertDocumentVersion): Promise<DocumentVersion> {
    const id = this.documentVersionId++;
    const now = new Date();
    const version: DocumentVersion = {
      ...insertVersion,
      id,
      createdAt: now,
    };
    this.documentVersions.set(id, version);
    
    // Set all other versions of this document to not current if this one is current
    if (version.isCurrent) {
      this.documentVersions.forEach((v, vId) => {
        if (v.documentId === version.documentId && vId !== id) {
          this.documentVersions.set(vId, { ...v, isCurrent: false });
        }
      });
      
      // Update document's current version
      const document = this.documents.get(version.documentId);
      if (document) {
        this.documents.set(version.documentId, {
          ...document,
          currentVersion: version.version,
          updatedAt: now,
        });
      }
    }
    
    return version;
  }

  // Activity operations
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return limit ? activities.slice(0, limit) : activities;
  }

  async getDocumentActivities(documentId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.documentId === documentId
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const now = new Date();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: now,
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Verification Issue operations
  async getVerificationIssues(documentId: number): Promise<VerificationIssue[]> {
    return Array.from(this.verificationIssues.values()).filter(
      (issue) => issue.documentId === documentId
    );
  }

  async getVerificationIssue(id: number): Promise<VerificationIssue | undefined> {
    return this.verificationIssues.get(id);
  }

  async createVerificationIssue(insertIssue: InsertVerificationIssue): Promise<VerificationIssue> {
    const id = this.verificationIssueId++;
    const now = new Date();
    const issue: VerificationIssue = {
      ...insertIssue,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.verificationIssues.set(id, issue);
    return issue;
  }

  async updateVerificationIssue(id: number, updateIssue: Partial<InsertVerificationIssue>): Promise<VerificationIssue | undefined> {
    const issue = this.verificationIssues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue: VerificationIssue = {
      ...issue,
      ...updateIssue,
      updatedAt: new Date(),
    };
    this.verificationIssues.set(id, updatedIssue);
    return updatedIssue;
  }

  // Related Legislation operations
  async getRelatedLegislation(documentId: number): Promise<RelatedLegislation[]> {
    return Array.from(this.relatedLegislation.values()).filter(
      (legislation) => legislation.documentId === documentId
    );
  }

  async createRelatedLegislation(insertLegislation: InsertRelatedLegislation): Promise<RelatedLegislation> {
    const id = this.relatedLegislationId++;
    const legislation: RelatedLegislation = {
      ...insertLegislation,
      id,
    };
    this.relatedLegislation.set(id, legislation);
    return legislation;
  }

  // Knowledge Graph operations
  async getKnowledgeGraphNodes(): Promise<KnowledgeGraphNode[]> {
    return Array.from(this.knowledgeGraphNodes.values());
  }

  async getKnowledgeGraphEdges(): Promise<KnowledgeGraphEdge[]> {
    return Array.from(this.knowledgeGraphEdges.values());
  }

  async createKnowledgeGraphNode(node: InsertKnowledgeGraphNode): Promise<KnowledgeGraphNode> {
    this.knowledgeGraphNodes.set(node.id, node);
    return node;
  }

  async createKnowledgeGraphEdge(edge: InsertKnowledgeGraphEdge): Promise<KnowledgeGraphEdge> {
    this.knowledgeGraphEdges.set(edge.id, edge);
    return edge;
  }

  // Legal Term operations
  async getLegalTerms(): Promise<LegalTerm[]> {
    return Array.from(this.legalTerms.values());
  }

  async getLegalTerm(id: number): Promise<LegalTerm | undefined> {
    return this.legalTerms.get(id);
  }

  async getLegalTermByTerm(term: string): Promise<LegalTerm | undefined> {
    return Array.from(this.legalTerms.values()).find(
      (legalTerm) => legalTerm.term.toLowerCase() === term.toLowerCase()
    );
  }

  async createLegalTerm(insertTerm: InsertLegalTerm): Promise<LegalTerm> {
    const id = this.legalTermId++;
    const now = new Date();
    const term: LegalTerm = {
      ...insertTerm,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.legalTerms.set(id, term);
    return term;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Document operations
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const [createdDocument] = await db
      .insert(documents)
      .values({
        ...document,
        currentVersion: "1.0"
      })
      .returning();
    return createdDocument;
  }
  
  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set({
        ...document,
        updatedAt: new Date()
      })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(eq(documents.id, id));
    return true;
  }
  
  // Document Version operations
  async getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
    return await db
      .select()
      .from(documentVersions)
      .where(eq(documentVersions.documentId, documentId));
  }
  
  async getDocumentVersion(id: number): Promise<DocumentVersion | undefined> {
    const [version] = await db
      .select()
      .from(documentVersions)
      .where(eq(documentVersions.id, id));
    return version;
  }
  
  async createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion> {
    const [createdVersion] = await db
      .insert(documentVersions)
      .values(version)
      .returning();
    
    if (version.isCurrent) {
      // Update all other versions to not be current
      await db
        .update(documentVersions)
        .set({ isCurrent: false })
        .where(eq(documentVersions.documentId, version.documentId))
        .where(eq(documentVersions.id, createdVersion.id).invert());
      
      // Update document's current version
      await db
        .update(documents)
        .set({ 
          currentVersion: version.version,
          updatedAt: new Date()
        })
        .where(eq(documents.id, version.documentId));
    }
    
    return createdVersion;
  }
  
  // Activity operations
  async getActivities(limit?: number): Promise<Activity[]> {
    let query = db
      .select()
      .from(activities)
      .orderBy(activities.createdAt);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getDocumentActivities(documentId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.documentId, documentId));
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [createdActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return createdActivity;
  }
  
  // Verification Issue operations
  async getVerificationIssues(documentId: number): Promise<VerificationIssue[]> {
    return await db
      .select()
      .from(verificationIssues)
      .where(eq(verificationIssues.documentId, documentId));
  }
  
  async getVerificationIssue(id: number): Promise<VerificationIssue | undefined> {
    const [issue] = await db
      .select()
      .from(verificationIssues)
      .where(eq(verificationIssues.id, id));
    return issue;
  }
  
  async createVerificationIssue(issue: InsertVerificationIssue): Promise<VerificationIssue> {
    const [createdIssue] = await db
      .insert(verificationIssues)
      .values(issue)
      .returning();
    return createdIssue;
  }
  
  async updateVerificationIssue(id: number, issue: Partial<InsertVerificationIssue>): Promise<VerificationIssue | undefined> {
    const [updatedIssue] = await db
      .update(verificationIssues)
      .set({
        ...issue,
        updatedAt: new Date()
      })
      .where(eq(verificationIssues.id, id))
      .returning();
    return updatedIssue;
  }
  
  // Related Legislation operations
  async getRelatedLegislation(documentId: number): Promise<RelatedLegislation[]> {
    return await db
      .select()
      .from(relatedLegislation)
      .where(eq(relatedLegislation.documentId, documentId));
  }
  
  async createRelatedLegislation(legislation: InsertRelatedLegislation): Promise<RelatedLegislation> {
    const [createdLegislation] = await db
      .insert(relatedLegislation)
      .values(legislation)
      .returning();
    return createdLegislation;
  }
  
  // Knowledge Graph operations
  async getKnowledgeGraphNodes(): Promise<KnowledgeGraphNode[]> {
    return await db
      .select()
      .from(knowledgeGraphNodes);
  }
  
  async getKnowledgeGraphEdges(): Promise<KnowledgeGraphEdge[]> {
    return await db
      .select()
      .from(knowledgeGraphEdges);
  }
  
  async createKnowledgeGraphNode(node: InsertKnowledgeGraphNode): Promise<KnowledgeGraphNode> {
    const [createdNode] = await db
      .insert(knowledgeGraphNodes)
      .values(node)
      .returning();
    return createdNode;
  }
  
  async createKnowledgeGraphEdge(edge: InsertKnowledgeGraphEdge): Promise<KnowledgeGraphEdge> {
    const [createdEdge] = await db
      .insert(knowledgeGraphEdges)
      .values(edge)
      .returning();
    return createdEdge;
  }
  
  // Legal Term operations
  async getLegalTerms(): Promise<LegalTerm[]> {
    return await db
      .select()
      .from(legalTerms);
  }
  
  async getLegalTerm(id: number): Promise<LegalTerm | undefined> {
    const [term] = await db
      .select()
      .from(legalTerms)
      .where(eq(legalTerms.id, id));
    return term;
  }
  
  async getLegalTermByTerm(term: string): Promise<LegalTerm | undefined> {
    const [legalTerm] = await db
      .select()
      .from(legalTerms)
      .where(eq(legalTerms.term, term));
    return legalTerm;
  }
  
  async createLegalTerm(term: InsertLegalTerm): Promise<LegalTerm> {
    const [createdTerm] = await db
      .insert(legalTerms)
      .values(term)
      .returning();
    return createdTerm;
  }
}

export const storage = new DatabaseStorage();
