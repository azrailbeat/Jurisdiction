import { Document } from "@shared/schema";
import { storage } from "../storage";

class AnalysisService {
  async verifyDocument(document: Document): Promise<any> {
    // In a real implementation, this would involve NLP, semantic search, etc.
    // For now, return a simpler verification
    
    // Get all other documents to check against
    const allDocuments = await storage.getDocuments();
    const otherDocuments = allDocuments.filter(doc => doc.id !== document.id);
    
    const issues = [];
    const relatedDocuments = [];
    
    // Find potential conflicts and relationships
    for (const otherDoc of otherDocuments) {
      const similarity = this.calculateSimilarity(document.content, otherDoc.content);
      
      // If documents are similar, create a relationship
      if (similarity > 0.5) {
        relatedDocuments.push({
          id: otherDoc.id,
          title: otherDoc.title,
          relevance: Math.floor(similarity * 100),
          relationship: 'similar'
        });
        
        // Check for conflicting terms
        const conflicts = this.findConflictingTerms(document.content, otherDoc.content);
        
        for (const conflict of conflicts) {
          issues.push({
            documentId: document.id,
            title: `${conflict.type} Conflict with ${otherDoc.title}`,
            description: conflict.description,
            severity: conflict.severity as 'warning' | 'error' | 'info',
            status: 'open',
            location: conflict.location,
            conflictingReferenceId: String(otherDoc.id),
            conflictingReferenceTitle: otherDoc.title,
            conflictingReferenceContent: conflict.conflictingContent
          });
        }
      }
    }
    
    // Store issues in database
    for (const issue of issues) {
      await storage.createVerificationIssue(issue);
    }
    
    // Store related legislation
    for (const related of relatedDocuments) {
      await storage.createRelatedLegislation({
        documentId: document.id,
        title: related.title,
        relevance: related.relevance,
        externalId: String(related.id)
      });
    }
    
    return {
      issues,
      relatedDocuments
    };
  }
  
  private calculateSimilarity(textA: string, textB: string): number {
    // In a real implementation, this would use cosine similarity of embeddings
    // For now, use a simple word overlap metric
    const wordsA = new Set(textA.toLowerCase().split(/\s+/));
    const wordsB = new Set(textB.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...wordsA].filter(word => wordsB.has(word)));
    const union = new Set([...wordsA, ...wordsB]);
    
    return intersection.size / union.size;
  }
  
  private findConflictingTerms(textA: string, textB: string): any[] {
    // In a real implementation, this would use NLP to detect semantic conflicts
    // For now, use a simple detection of legal terms with different contexts
    
    const conflicts = [];
    const legalTerms = [
      'digital asset', 'blockchain', 'smart contract', 'financial asset',
      'utility asset', 'digital securities'
    ];
    
    for (const term of legalTerms) {
      // Check if term exists in both texts
      if (textA.includes(term) && textB.includes(term)) {
        const contextA = this.getTermContext(textA, term);
        const contextB = this.getTermContext(textB, term);
        
        // If contexts are different, flag as potential conflict
        if (contextA && contextB && !this.areContextsSimilar(contextA, contextB)) {
          conflicts.push({
            type: 'Definition',
            description: `Potential conflict in definition of "${term}"`,
            severity: 'warning',
            location: `term:${term}`,
            conflictingContent: contextB
          });
        }
      }
    }
    
    // Look for conflicting obligations
    const obligationTerms = ['shall', 'must', 'required', 'prohibited', 'may not'];
    
    for (const term of obligationTerms) {
      // Find sentences with obligations
      const obligationsA = this.findObligations(textA, term);
      const obligationsB = this.findObligations(textB, term);
      
      // Compare obligations for conflicts
      for (const obligA of obligationsA) {
        for (const obligB of obligationsB) {
          if (this.areObligationsConflicting(obligA, obligB)) {
            conflicts.push({
              type: 'Obligation',
              description: `Conflicting obligations regarding "${obligA.subject}"`,
              severity: 'error',
              location: `obligation:${obligA.sentence}`,
              conflictingContent: obligB.sentence
            });
          }
        }
      }
    }
    
    return conflicts;
  }
  
  private getTermContext(text: string, term: string): string | null {
    // Find a sentence containing the term and its definition
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (sentence.includes(term) && 
          (sentence.includes(' means ') || 
           sentence.includes(' defined as ') || 
           sentence.includes(' is a '))) {
        return sentence.trim();
      }
    }
    
    return null;
  }
  
  private areContextsSimilar(contextA: string, contextB: string): boolean {
    // Simple check - if contexts have high word overlap, consider them similar
    return this.calculateSimilarity(contextA, contextB) > 0.7;
  }
  
  private findObligations(text: string, term: string): any[] {
    const obligations = [];
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(term)) {
        // Very simplified - extract subject before obligation term
        const parts = sentence.split(new RegExp(`\\b${term}\\b`, 'i'));
        if (parts.length > 1) {
          const subject = this.extractSubject(parts[0]);
          
          if (subject) {
            obligations.push({
              term,
              subject,
              sentence: sentence.trim()
            });
          }
        }
      }
    }
    
    return obligations;
  }
  
  private extractSubject(text: string): string | null {
    // Simplified - take last noun phrase before obligation term
    const words = text.trim().split(/\s+/);
    if (words.length > 0) {
      return words[words.length - 1];
    }
    return null;
  }
  
  private areObligationsConflicting(obligA: any, obligB: any): boolean {
    // Check if obligations relate to the same subject but with different terms
    if (obligA.subject === obligB.subject && obligA.term !== obligB.term) {
      // Simplified - certain combinations are considered conflicting
      const conflictingPairs = [
        ['shall', 'shall not'],
        ['must', 'may not'],
        ['required', 'prohibited']
      ];
      
      for (const pair of conflictingPairs) {
        if ((obligA.term === pair[0] && obligB.term === pair[1]) ||
            (obligA.term === pair[1] && obligB.term === pair[0])) {
          return true;
        }
      }
    }
    
    return false;
  }
}

export const analysisService = new AnalysisService();
