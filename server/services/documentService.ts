import { Document } from "@shared/schema";
import { storage } from "../storage";
import { xmlParser } from "../utils/xmlParser";

class DocumentService {
  async compareDocuments(source: Document, target: Document): Promise<any> {
    // Parse XML documents
    const sourceXml = await xmlParser.parse(source.xml);
    const targetXml = await xmlParser.parse(target.xml);
    
    // Compare the documents structurally and semantically
    const comparison = {
      structuralDifferences: this.findStructuralDifferences(sourceXml, targetXml),
      semanticDifferences: this.findSemanticDifferences(source.content, target.content),
      metadata: {
        sourceTitle: source.title,
        sourceVersion: source.currentVersion,
        targetTitle: target.title,
        targetVersion: target.currentVersion,
        comparisonDate: new Date().toISOString()
      }
    };
    
    return comparison;
  }
  
  private findStructuralDifferences(sourceXml: any, targetXml: any): any[] {
    // In a real implementation, this would use proper XML diffing
    // For now, return a simpler representation
    const differences = [];
    
    // Compare articles, sections, etc.
    if (sourceXml.articles?.length !== targetXml.articles?.length) {
      differences.push({
        type: 'article_count',
        description: `Different number of articles: ${sourceXml.articles?.length || 0} vs ${targetXml.articles?.length || 0}`,
        severity: 'warning'
      });
    }
    
    // Example comparison of specific article
    if (sourceXml.articles && targetXml.articles) {
      for (let i = 0; i < Math.min(sourceXml.articles.length, targetXml.articles.length); i++) {
        const sourceArticle = sourceXml.articles[i];
        const targetArticle = targetXml.articles[i];
        
        if (sourceArticle.title !== targetArticle.title) {
          differences.push({
            type: 'article_title',
            description: `Article ${i+1} has different title: "${sourceArticle.title}" vs "${targetArticle.title}"`,
            location: `article[${i+1}].title`,
            severity: 'info'
          });
        }
        
        // Compare article content
        if (sourceArticle.content !== targetArticle.content) {
          differences.push({
            type: 'article_content',
            description: `Article ${i+1} has different content`,
            location: `article[${i+1}].content`,
            severity: 'warning'
          });
        }
      }
    }
    
    return differences;
  }
  
  private findSemanticDifferences(sourceContent: string, targetContent: string): any[] {
    // In a real implementation, this would use NLP, embeddings, etc.
    // For now, return a simpler representation
    const differences = [];
    
    // Simple word-count comparison as a very basic metric
    const sourceWords = sourceContent.split(/\s+/).length;
    const targetWords = targetContent.split(/\s+/).length;
    
    if (Math.abs(sourceWords - targetWords) > 10) {
      differences.push({
        type: 'content_length',
        description: `Significant difference in content length: ${sourceWords} words vs ${targetWords} words`,
        severity: 'info'
      });
    }
    
    // Detect key legal terms that appear in one document but not the other
    const legalTerms = ['shall', 'must', 'required', 'prohibited', 'may', 'should'];
    
    for (const term of legalTerms) {
      const sourceMatches = (sourceContent.match(new RegExp(`\\b${term}\\b`, 'gi')) || []).length;
      const targetMatches = (targetContent.match(new RegExp(`\\b${term}\\b`, 'gi')) || []).length;
      
      if (Math.abs(sourceMatches - targetMatches) > 2) {
        differences.push({
          type: 'legal_term_frequency',
          description: `Different usage frequency of "${term}": ${sourceMatches} occurrences vs ${targetMatches} occurrences`,
          severity: sourceMatches > targetMatches ? 'warning' : 'info'
        });
      }
    }
    
    return differences;
  }
  
  async generateKnowledgeGraph(document: Document): Promise<void> {
    const xml = await xmlParser.parse(document.xml);
    
    // Create a node for the document itself
    await storage.createKnowledgeGraphNode({
      id: `doc_${document.id}`,
      label: document.title,
      type: 'document',
      properties: {
        version: document.currentVersion,
        status: document.status
      }
    });
    
    // Parse articles and create nodes for each
    if (xml.articles) {
      for (let i = 0; i < xml.articles.length; i++) {
        const article = xml.articles[i];
        const articleId = `art_${document.id}_${i+1}`;
        
        // Create article node
        await storage.createKnowledgeGraphNode({
          id: articleId,
          label: article.title || `Article ${i+1}`,
          type: 'article',
          properties: {
            documentId: document.id,
            articleNumber: i+1,
            content: article.content
          }
        });
        
        // Connect article to document
        await storage.createKnowledgeGraphEdge({
          id: `edge_doc_${document.id}_art_${i+1}`,
          source: `doc_${document.id}`,
          target: articleId,
          label: 'contains',
          properties: {}
        });
        
        // Extract and create nodes for entities mentioned in the article
        const entities = this.extractEntities(article.content);
        for (const entity of entities) {
          const entityId = `entity_${entity.type}_${entity.name.replace(/\s+/g, '_')}`;
          
          // Check if entity node already exists
          const existingNodes = (await storage.getKnowledgeGraphNodes())
            .filter(node => node.id === entityId);
            
          if (existingNodes.length === 0) {
            // Create entity node
            await storage.createKnowledgeGraphNode({
              id: entityId,
              label: entity.name,
              type: entity.type,
              properties: {
                source: document.id
              }
            });
          }
          
          // Connect entity to article
          await storage.createKnowledgeGraphEdge({
            id: `edge_${articleId}_${entityId}`,
            source: articleId,
            target: entityId,
            label: 'mentions',
            properties: {}
          });
        }
      }
    }
  }
  
  private extractEntities(text: string): { name: string, type: string }[] {
    // In a real implementation, this would use NER (Named Entity Recognition)
    // For now, return a simple extraction
    const entities = [];
    
    // Match terms that look like defined terms, which are typically capitalized
    // or quoted in legal documents
    const definedTerms = text.match(/["']([^"']+)["']|\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) || [];
    
    for (const term of definedTerms) {
      entities.push({
        name: term.replace(/["']/g, ''),
        type: 'term'
      });
    }
    
    return entities;
  }
}

export const documentService = new DocumentService();
