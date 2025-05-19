import { pgTable, text, serial, integer, timestamp, boolean, json, varchar, jsonb, index, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users Table - Modified for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents Table
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  content: text("content").notNull(),
  xml: text("xml").notNull(),
  currentVersion: text("current_version").notNull().default("1.0"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  updatedBy: varchar("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Document Versions Table
export const documentVersions = pgTable("document_versions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  version: text("version").notNull(),
  content: text("content").notNull(),
  xml: text("xml").notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: text("description"),
  isCurrent: boolean("is_current").notNull().default(false),
});

// Activities Table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentId: integer("document_id").references(() => documents.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Verification Issues Table
export const verificationIssues = pgTable("verification_issues", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("open"),
  location: text("location").notNull(),
  conflictingReferenceId: text("conflicting_reference_id"),
  conflictingReferenceTitle: text("conflicting_reference_title"),
  conflictingReferenceContent: text("conflicting_reference_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Related Legislation Table
export const relatedLegislation = pgTable("related_legislation", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  title: text("title").notNull(),
  relevance: integer("relevance").notNull(),
  externalId: text("external_id"),
});

// Knowledge Graph Nodes Table
export const knowledgeGraphNodes = pgTable("knowledge_graph_nodes", {
  id: varchar("id", { length: 100 }).primaryKey(),
  label: text("label").notNull(),
  type: text("type").notNull(),
  properties: json("properties"),
});

// Knowledge Graph Edges Table
export const knowledgeGraphEdges = pgTable("knowledge_graph_edges", {
  id: varchar("id", { length: 100 }).primaryKey(),
  source: varchar("source", { length: 100 }).notNull().references(() => knowledgeGraphNodes.id),
  target: varchar("target", { length: 100 }).notNull().references(() => knowledgeGraphNodes.id),
  label: text("label").notNull(),
  properties: json("properties"),
});

// Legal Terms Table
export const legalTerms = pgTable("legal_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull().unique(),
  definition: text("definition").notNull(),
  source: text("source"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const upsertUserSchema = createInsertSchema(users);

export type UpsertUser = z.infer<typeof upsertUserSchema>;

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  status: true,
  content: true,
  xml: true,
  createdBy: true,
  updatedBy: true,
});

export const insertDocumentVersionSchema = createInsertSchema(documentVersions).pick({
  documentId: true,
  version: true,
  content: true,
  xml: true,
  createdBy: true,
  description: true,
  isCurrent: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  userId: true,
  documentId: true,
});

export const insertVerificationIssueSchema = createInsertSchema(verificationIssues).pick({
  documentId: true,
  title: true,
  description: true,
  severity: true,
  status: true,
  location: true,
  conflictingReferenceId: true,
  conflictingReferenceTitle: true,
  conflictingReferenceContent: true,
});

export const insertRelatedLegislationSchema = createInsertSchema(relatedLegislation).pick({
  documentId: true,
  title: true,
  relevance: true,
  externalId: true,
});

export const insertKnowledgeGraphNodeSchema = createInsertSchema(knowledgeGraphNodes).pick({
  id: true,
  label: true,
  type: true,
  properties: true,
});

export const insertKnowledgeGraphEdgeSchema = createInsertSchema(knowledgeGraphEdges).pick({
  id: true,
  source: true,
  target: true,
  label: true,
  properties: true,
});

export const insertLegalTermSchema = createInsertSchema(legalTerms).pick({
  term: true,
  definition: true,
  source: true,
  category: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentVersion = z.infer<typeof insertDocumentVersionSchema>;
export type DocumentVersion = typeof documentVersions.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertVerificationIssue = z.infer<typeof insertVerificationIssueSchema>;
export type VerificationIssue = typeof verificationIssues.$inferSelect;

export type InsertRelatedLegislation = z.infer<typeof insertRelatedLegislationSchema>;
export type RelatedLegislation = typeof relatedLegislation.$inferSelect;

export type InsertKnowledgeGraphNode = z.infer<typeof insertKnowledgeGraphNodeSchema>;
export type KnowledgeGraphNode = typeof knowledgeGraphNodes.$inferSelect;

export type InsertKnowledgeGraphEdge = z.infer<typeof insertKnowledgeGraphEdgeSchema>;
export type KnowledgeGraphEdge = typeof knowledgeGraphEdges.$inferSelect;

export type InsertLegalTerm = z.infer<typeof insertLegalTermSchema>;
export type LegalTerm = typeof legalTerms.$inferSelect;
