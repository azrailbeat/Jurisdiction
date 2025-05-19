import { Document, DocumentVersion } from "@shared/schema";
import { storage } from "../storage";

class VersionService {
  async createNewVersion(document: Document, content: string, xml: string, userId: number, description: string): Promise<DocumentVersion> {
    // Get the current version
    const versions = await storage.getDocumentVersions(document.id);
    const currentVersion = versions.find(v => v.isCurrent);
    
    if (!currentVersion) {
      throw new Error("No current version found for this document");
    }
    
    // Calculate new version number
    const newVersion = this.calculateNextVersion(currentVersion.version);
    
    // Create the new version
    const documentVersion = await storage.createDocumentVersion({
      documentId: document.id,
      version: newVersion,
      content,
      xml,
      createdBy: userId,
      description,
      isCurrent: true
    });
    
    // Update the document with the new content
    await storage.updateDocument(document.id, {
      content,
      xml,
      currentVersion: newVersion,
      updatedBy: userId
    });
    
    // Create activity for the version creation
    await storage.createActivity({
      type: "update",
      description: `Created version ${newVersion} of document: ${document.title}`,
      userId,
      documentId: document.id
    });
    
    return documentVersion;
  }
  
  async revertToVersion(document: Document, versionId: number, userId: number): Promise<DocumentVersion> {
    const version = await storage.getDocumentVersion(versionId);
    
    if (!version || version.documentId !== document.id) {
      throw new Error("Version not found or doesn't belong to this document");
    }
    
    // Create a new version with the content of the old version
    const newVersion = this.calculateNextVersion(document.currentVersion);
    
    const documentVersion = await storage.createDocumentVersion({
      documentId: document.id,
      version: newVersion,
      content: version.content,
      xml: version.xml,
      createdBy: userId,
      description: `Reverted to version ${version.version}`,
      isCurrent: true
    });
    
    // Update the document with the reverted content
    await storage.updateDocument(document.id, {
      content: version.content,
      xml: version.xml,
      currentVersion: newVersion,
      updatedBy: userId
    });
    
    // Create activity for the revert
    await storage.createActivity({
      type: "update",
      description: `Reverted to version ${version.version} of document: ${document.title}`,
      userId,
      documentId: document.id
    });
    
    return documentVersion;
  }
  
  async compareVersions(documentId: number, versionA: string, versionB: string): Promise<any> {
    const versions = await storage.getDocumentVersions(documentId);
    
    const verA = versions.find(v => v.version === versionA);
    const verB = versions.find(v => v.version === versionB);
    
    if (!verA || !verB) {
      throw new Error("One or both versions not found");
    }
    
    // In a real implementation, this would use proper diff algorithms
    // For now, return a simple comparison
    return {
      added: this.getAddedLines(verA.content, verB.content),
      removed: this.getRemovedLines(verA.content, verB.content),
      metadata: {
        versionA,
        versionB,
        comparisonDate: new Date().toISOString()
      }
    };
  }
  
  private calculateNextVersion(currentVersion: string): string {
    const parts = currentVersion.split('.');
    if (parts.length === 2) {
      const major = parseInt(parts[0]);
      const minor = parseInt(parts[1]);
      
      // Increment minor version
      return `${major}.${minor + 1}`;
    }
    
    // If version format is unexpected, just append .1
    return `${currentVersion}.1`;
  }
  
  private getAddedLines(oldText: string, newText: string): string[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    return newLines.filter(line => !oldLines.includes(line));
  }
  
  private getRemovedLines(oldText: string, newText: string): string[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    return oldLines.filter(line => !newLines.includes(line));
  }
}

export const versionService = new VersionService();
