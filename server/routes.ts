import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { documentService } from "./services/documentService";
import { versionService } from "./services/versionService";
import { analysisService } from "./services/analysisService";
import { graphService } from "./services/graphService";
import { registerDocumentUploadRoutes } from "./routes/document-upload";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Register document upload routes
  registerDocumentUploadRoutes(app);
  // Authentication routes are now managed in replitAuth.ts

  // Documents Routes
  app.get("/api/documents", async (req, res) => {
    const documents = await storage.getDocuments();
    res.json(documents);
  });

  app.get("/api/documents/:id", async (req, res) => {
    const document = await storage.getDocument(parseInt(req.params.id));
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const document = await storage.createDocument(req.body);
      
      // Create initial version
      await storage.createDocumentVersion({
        documentId: document.id,
        version: "1.0",
        content: document.content,
        xml: document.xml,
        createdBy: document.createdBy,
        description: "Initial version",
        isCurrent: true,
      });
      
      // Create activity
      await storage.createActivity({
        type: "create",
        description: `Created document: ${document.title}`,
        userId: document.createdBy,
        documentId: document.id,
      });
      
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.updateDocument(parseInt(req.params.id), req.body);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Create activity
      await storage.createActivity({
        type: "update",
        description: `Updated document: ${document.title}`,
        userId: document.updatedBy,
        documentId: document.id,
      });
      
      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    const success = await storage.deleteDocument(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(204).end();
  });

  // Document Versions Routes
  app.get("/api/documents/:id/versions", async (req, res) => {
    const versions = await storage.getDocumentVersions(parseInt(req.params.id));
    res.json(versions);
  });

  app.post("/api/documents/:id/versions", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const version = await storage.createDocumentVersion({
        ...req.body,
        documentId,
      });
      
      // Create activity
      await storage.createActivity({
        type: "update",
        description: `Created new version ${version.version} for: ${document.title}`,
        userId: version.createdBy,
        documentId: document.id,
      });
      
      res.status(201).json(version);
    } catch (error) {
      res.status(400).json({ message: "Failed to create version" });
    }
  });

  // Activities Routes
  app.get("/api/activities", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const activities = await storage.getActivities(limit);
    res.json(activities);
  });

  app.get("/api/documents/:id/activities", async (req, res) => {
    const activities = await storage.getDocumentActivities(parseInt(req.params.id));
    res.json(activities);
  });

  // Verification Issues Routes
  app.get("/api/documents/:id/issues", async (req, res) => {
    const issues = await storage.getVerificationIssues(parseInt(req.params.id));
    res.json(issues);
  });

  app.post("/api/documents/:id/issues", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const issue = await storage.createVerificationIssue({
        ...req.body,
        documentId,
      });
      
      res.status(201).json(issue);
    } catch (error) {
      res.status(400).json({ message: "Failed to create issue" });
    }
  });

  app.put("/api/issues/:id", async (req, res) => {
    try {
      const issue = await storage.updateVerificationIssue(parseInt(req.params.id), req.body);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      res.json(issue);
    } catch (error) {
      res.status(400).json({ message: "Failed to update issue" });
    }
  });

  // Related Legislation Routes
  app.get("/api/documents/:id/legislation", async (req, res) => {
    const legislation = await storage.getRelatedLegislation(parseInt(req.params.id));
    res.json(legislation);
  });

  // Knowledge Graph Routes
  app.get("/api/graph", async (req, res) => {
    const nodes = await storage.getKnowledgeGraphNodes();
    const edges = await storage.getKnowledgeGraphEdges();
    res.json({ nodes, edges });
  });

  // Legal Terms Routes
  app.get("/api/terms", async (req, res) => {
    const terms = await storage.getLegalTerms();
    res.json(terms);
  });

  app.get("/api/terms/:id", async (req, res) => {
    const term = await storage.getLegalTerm(parseInt(req.params.id));
    if (!term) {
      return res.status(404).json({ message: "Term not found" });
    }
    res.json(term);
  });

  app.post("/api/terms", async (req, res) => {
    try {
      const term = await storage.createLegalTerm(req.body);
      res.status(201).json(term);
    } catch (error) {
      res.status(400).json({ message: "Failed to create term" });
    }
  });

  // Document comparison
  app.post("/api/documents/compare", async (req, res) => {
    try {
      const { sourceId, targetId } = req.body;
      const source = await storage.getDocument(parseInt(sourceId));
      const target = await storage.getDocument(parseInt(targetId));
      
      if (!source || !target) {
        return res.status(404).json({ message: "One or both documents not found" });
      }
      
      const comparison = await documentService.compareDocuments(source, target);
      res.json(comparison);
    } catch (error) {
      res.status(400).json({ message: "Failed to compare documents" });
    }
  });

  // Document verification
  app.post("/api/documents/:id/verify", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const results = await analysisService.verifyDocument(document);
      res.json(results);
    } catch (error) {
      res.status(400).json({ message: "Failed to verify document" });
    }
  });

  // Initialize HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
