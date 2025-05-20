import { Document, DocumentVersion } from "@shared/schema";
import { storage } from "../storage";
import { xmlParser } from "../utils/xmlParser";

interface SemanticDiffResult {
  // Overall comparison data
  overview: {
    similarityScore: number;
    addedSections: number;
    removedSections: number;
    modifiedSections: number;
  };
  
  // Detailed changes
  changes: SemanticChange[];
  
  // Extracted semantic elements
  semanticAnalysis: {
    obligations: DeonticAnalysis[];
    rights: DeonticAnalysis[];
    permissions: DeonticAnalysis[];
    prohibitions: DeonticAnalysis[];
    definitions: DefinitionChange[];
    references: ReferenceChange[];
  };
  
  // Original document metadata
  metadata: {
    sourceId: number;
    targetId: number;
    sourceVersion: string;
    targetVersion: string;
    comparisonDate: string;
  };
}

interface SemanticChange {
  type: 'addition' | 'removal' | 'modification';
  location: string; // XPath or similar identifier
  path: string[]; // Hierarchical path (e.g., ['article', '5', 'paragraph', '2'])
  sourceContent?: string;
  targetContent?: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  impact: 'high' | 'medium' | 'low';
  category: 'obligation' | 'right' | 'permission' | 'prohibition' | 'definition' | 'reference' | 'structural' | 'other';
  description: string;
  contextBefore?: string;
  contextAfter?: string;
}

interface DeonticAnalysis {
  type: 'obligation' | 'right' | 'permission' | 'prohibition';
  subject: string;
  action: string;
  object?: string;
  condition?: string;
  sourceLocation?: string;
  targetLocation?: string;
  changeType?: 'added' | 'removed' | 'modified'; 
  description: string;
}

interface DefinitionChange {
  term: string;
  sourceDefinition?: string;
  targetDefinition?: string;
  changeType: 'added' | 'removed' | 'modified';
  similarityScore?: number;
}

interface ReferenceChange {
  sourceRef?: string;
  targetRef?: string;
  changeType: 'added' | 'removed' | 'modified' | 'broken';
  description: string;
}

class SemanticDiffService {
  /**
   * Performs an advanced semantic diff between two documents
   */
  async compareDocuments(sourceDoc: Document, targetDoc: Document): Promise<SemanticDiffResult> {
    const sourceXml = await xmlParser.parse(sourceDoc.xml);
    const targetXml = await xmlParser.parse(targetDoc.xml);
    
    // Generate the changes
    const changes = await this.generateDetailedChanges(sourceDoc, targetDoc, sourceXml, targetXml);
    
    // Extract deontic elements (obligations, rights, permissions, prohibitions)
    const deonticAnalysis = this.performDeonticAnalysis(sourceDoc.content, targetDoc.content);
    
    // Extract and compare definitions
    const definitionChanges = this.extractDefinitionChanges(sourceDoc.content, targetDoc.content, sourceXml, targetXml);
    
    // Analyze changes in references to other documents/legislation
    const referenceChanges = this.analyzeReferenceChanges(sourceDoc.content, targetDoc.content);
    
    // Calculate overall metrics
    const addedSections = changes.filter(c => c.type === 'addition').length;
    const removedSections = changes.filter(c => c.type === 'removal').length;
    const modifiedSections = changes.filter(c => c.type === 'modification').length;
    const similarityScore = this.calculateSimilarityScore(sourceDoc.content, targetDoc.content);
    
    return {
      overview: {
        similarityScore,
        addedSections,
        removedSections,
        modifiedSections
      },
      changes,
      semanticAnalysis: {
        obligations: deonticAnalysis.filter(d => d.type === 'obligation'),
        rights: deonticAnalysis.filter(d => d.type === 'right'),
        permissions: deonticAnalysis.filter(d => d.type === 'permission'),
        prohibitions: deonticAnalysis.filter(d => d.type === 'prohibition'),
        definitions: definitionChanges,
        references: referenceChanges
      },
      metadata: {
        sourceId: sourceDoc.id,
        targetId: targetDoc.id,
        sourceVersion: sourceDoc.currentVersion,
        targetVersion: targetDoc.currentVersion,
        comparisonDate: new Date().toISOString()
      }
    };
  }
  
  /**
   * Compare two document versions using advanced semantic diff
   */
  async compareVersions(documentId: number, versionA: string, versionB: string): Promise<SemanticDiffResult> {
    const versions = await storage.getDocumentVersions(documentId);
    
    const verA = versions.find(v => v.version === versionA);
    const verB = versions.find(v => v.version === versionB);
    
    if (!verA || !verB) {
      throw new Error("One or both versions not found");
    }
    
    // Create mock document objects from versions for comparison
    const sourceDoc = {
      id: documentId,
      content: verA.content,
      xml: verA.xml,
      currentVersion: verA.version
    } as Document;
    
    const targetDoc = {
      id: documentId,
      content: verB.content,
      xml: verB.xml,
      currentVersion: verB.version
    } as Document;
    
    return this.compareDocuments(sourceDoc, targetDoc);
  }
  
  /**
   * Generate detailed changes between two documents at structural and semantic levels
   */
  private async generateDetailedChanges(
    sourceDoc: Document, 
    targetDoc: Document,
    sourceXml: any,
    targetXml: any
  ): Promise<SemanticChange[]> {
    const changes: SemanticChange[] = [];
    
    // 1. Structural level changes (articles, sections, paragraphs)
    changes.push(...this.findStructuralChanges(sourceXml, targetXml));
    
    // 2. Semantic level changes based on content analysis
    changes.push(...this.findSemanticChanges(sourceDoc.content, targetDoc.content));
    
    return changes;
  }
  
  /**
   * Find structural differences between documents (articles, sections, etc.)
   */
  private findStructuralChanges(sourceXml: any, targetXml: any): SemanticChange[] {
    const changes: SemanticChange[] = [];
    
    // Compare number of articles
    if (sourceXml.articles?.length !== targetXml.articles?.length) {
      const sourceArticles = sourceXml.articles?.length || 0;
      const targetArticles = targetXml.articles?.length || 0;
      
      changes.push({
        type: targetArticles > sourceArticles ? 'addition' : 'removal',
        location: 'document/articles',
        path: ['articles'],
        severity: 'major',
        impact: 'high',
        category: 'structural',
        description: `Article count changed from ${sourceArticles} to ${targetArticles}`
      });
      
      // Identify specifically which articles were added/removed
      if (targetArticles > sourceArticles) {
        for (let i = sourceArticles; i < targetArticles; i++) {
          const article = targetXml.articles[i];
          changes.push({
            type: 'addition',
            location: `document/articles/${i+1}`,
            path: ['articles', (i+1).toString()],
            targetContent: article.content,
            severity: 'major',
            impact: 'high',
            category: 'structural',
            description: `New article ${i+1}: "${article.title}"`
          });
        }
      } else {
        for (let i = targetArticles; i < sourceArticles; i++) {
          const article = sourceXml.articles[i];
          changes.push({
            type: 'removal',
            location: `document/articles/${i+1}`,
            path: ['articles', (i+1).toString()],
            sourceContent: article.content,
            severity: 'major',
            impact: 'high',
            category: 'structural',
            description: `Removed article ${i+1}: "${article.title}"`
          });
        }
      }
    }
    
    // Compare article titles and content
    const minLength = Math.min(
      sourceXml.articles?.length || 0, 
      targetXml.articles?.length || 0
    );
    
    for (let i = 0; i < minLength; i++) {
      const sourceArticle = sourceXml.articles[i];
      const targetArticle = targetXml.articles[i];
      
      // Compare titles
      if (sourceArticle.title !== targetArticle.title) {
        changes.push({
          type: 'modification',
          location: `document/articles/${i+1}/title`,
          path: ['articles', (i+1).toString(), 'title'],
          sourceContent: sourceArticle.title,
          targetContent: targetArticle.title,
          severity: 'minor',
          impact: 'medium',
          category: 'structural',
          description: `Article ${i+1} title changed from "${sourceArticle.title}" to "${targetArticle.title}"`
        });
      }
      
      // Compare content at the paragraph level
      const sourceParagraphs = sourceArticle.content.split('\n\n');
      const targetParagraphs = targetArticle.content.split('\n\n');
      
      if (sourceParagraphs.length !== targetParagraphs.length) {
        changes.push({
          type: targetParagraphs.length > sourceParagraphs.length ? 'addition' : 'removal',
          location: `document/articles/${i+1}/paragraphs`,
          path: ['articles', (i+1).toString(), 'paragraphs'],
          severity: 'minor',
          impact: 'medium',
          category: 'structural',
          description: `Paragraph count in article ${i+1} changed from ${sourceParagraphs.length} to ${targetParagraphs.length}`
        });
      }
      
      // Compare each paragraph content
      const minParagraphs = Math.min(sourceParagraphs.length, targetParagraphs.length);
      for (let j = 0; j < minParagraphs; j++) {
        if (sourceParagraphs[j] !== targetParagraphs[j]) {
          // Check if this is a minor edit or more substantial
          const similarityScore = this.calculateSimilarityScore(
            sourceParagraphs[j], 
            targetParagraphs[j]
          );
          
          const severity = similarityScore > 0.8 ? 'minor' : 'major';
          
          changes.push({
            type: 'modification',
            location: `document/articles/${i+1}/paragraphs/${j+1}`,
            path: ['articles', (i+1).toString(), 'paragraphs', (j+1).toString()],
            sourceContent: sourceParagraphs[j],
            targetContent: targetParagraphs[j],
            severity,
            impact: severity === 'minor' ? 'low' : 'medium',
            category: 'structural',
            description: `Modified paragraph ${j+1} in article ${i+1}`
          });
        }
      }
      
      // Add any extra paragraphs in the target document
      for (let j = minParagraphs; j < targetParagraphs.length; j++) {
        changes.push({
          type: 'addition',
          location: `document/articles/${i+1}/paragraphs/${j+1}`,
          path: ['articles', (i+1).toString(), 'paragraphs', (j+1).toString()],
          targetContent: targetParagraphs[j],
          severity: 'minor',
          impact: 'medium',
          category: 'structural',
          description: `Added paragraph ${j+1} in article ${i+1}`
        });
      }
      
      // Remove any extra paragraphs from the source document
      for (let j = minParagraphs; j < sourceParagraphs.length; j++) {
        changes.push({
          type: 'removal',
          location: `document/articles/${i+1}/paragraphs/${j+1}`,
          path: ['articles', (i+1).toString(), 'paragraphs', (j+1).toString()],
          sourceContent: sourceParagraphs[j],
          severity: 'minor',
          impact: 'medium',
          category: 'structural',
          description: `Removed paragraph ${j+1} from article ${i+1}`
        });
      }
    }
    
    return changes;
  }
  
  /**
   * Find semantic level differences in the content (obligations, rights, etc.)
   */
  private findSemanticChanges(sourceContent: string, targetContent: string): SemanticChange[] {
    const changes: SemanticChange[] = [];
    
    // Add semantic analysis for key legal modality terms
    const legalTerms = [
      // Obligation terms
      { term: 'shall', category: 'obligation', severity: 'critical' },
      { term: 'must', category: 'obligation', severity: 'critical' },
      { term: 'required', category: 'obligation', severity: 'critical' },
      { term: 'obligated', category: 'obligation', severity: 'critical' },
      
      // Permission terms
      { term: 'may', category: 'permission', severity: 'major' },
      { term: 'permitted', category: 'permission', severity: 'major' },
      { term: 'authorized', category: 'permission', severity: 'major' },
      
      // Prohibition terms
      { term: 'shall not', category: 'prohibition', severity: 'critical' },
      { term: 'must not', category: 'prohibition', severity: 'critical' },
      { term: 'prohibited', category: 'prohibition', severity: 'critical' },
      { term: 'not permitted', category: 'prohibition', severity: 'critical' },
      
      // Right terms
      { term: 'entitled', category: 'right', severity: 'major' },
      { term: 'right to', category: 'right', severity: 'major' },
      { term: 'claim', category: 'right', severity: 'major' }
    ];
    
    // Search for contextual changes around key legal terms
    for (const { term, category, severity } of legalTerms) {
      const sourceContexts = this.findTermContext(sourceContent, term);
      const targetContexts = this.findTermContext(targetContent, term);
      
      // Find context matches and differences
      const matchingContexts = this.matchContexts(sourceContexts, targetContexts);
      
      // Identify deleted contexts (in source but not in target)
      for (const sourceContext of sourceContexts) {
        const match = matchingContexts.find(m => m.source === sourceContext);
        if (!match) {
          changes.push({
            type: 'removal',
            location: `unknown/semantic/${category}/${term}`,
            path: ['semantic', category, term],
            sourceContent: sourceContext,
            severity: severity as any,
            impact: 'high',
            category: category as any,
            description: `Removed ${category}: "${this.highlightTerm(sourceContext, term)}"`
          });
        }
      }
      
      // Identify added contexts (in target but not in source)
      for (const targetContext of targetContexts) {
        const match = matchingContexts.find(m => m.target === targetContext);
        if (!match) {
          changes.push({
            type: 'addition',
            location: `unknown/semantic/${category}/${term}`,
            path: ['semantic', category, term],
            targetContent: targetContext,
            severity: severity as any,
            impact: 'high',
            category: category as any,
            description: `Added ${category}: "${this.highlightTerm(targetContext, term)}"`
          });
        }
      }
      
      // Identify modified contexts
      for (const match of matchingContexts) {
        if (match.source !== match.target) {
          changes.push({
            type: 'modification',
            location: `unknown/semantic/${category}/${term}`,
            path: ['semantic', category, term],
            sourceContent: match.source,
            targetContent: match.target,
            severity: severity as any,
            impact: 'high',
            category: category as any,
            description: `Modified ${category}: "${this.highlightDifference(match.source, match.target, term)}"`
          });
        }
      }
    }
    
    return changes;
  }
  
  /**
   * Extract and compare definitions from both documents
   */
  private extractDefinitionChanges(
    sourceContent: string, 
    targetContent: string,
    sourceXml: any,
    targetXml: any
  ): DefinitionChange[] {
    const changes: DefinitionChange[] = [];
    
    // Simple regex-based definition extraction (in a real system, this would be more sophisticated)
    const definitionRegex = /"([^"]+)"\s*(?:means|shall mean|refers to)\s*([^\.]+)/gi;
    
    const sourceDefinitions = new Map<string, string>();
    let match;
    
    // Extract source definitions
    while ((match = definitionRegex.exec(sourceContent)) !== null) {
      const [, term, definition] = match;
      sourceDefinitions.set(term.toLowerCase(), definition.trim());
    }
    
    // Reset regex
    definitionRegex.lastIndex = 0;
    
    // Extract target definitions and compare
    while ((match = definitionRegex.exec(targetContent)) !== null) {
      const [, term, definition] = match;
      const normalizedTerm = term.toLowerCase();
      
      if (sourceDefinitions.has(normalizedTerm)) {
        const sourceDefinition = sourceDefinitions.get(normalizedTerm)!;
        
        if (sourceDefinition !== definition.trim()) {
          // Modified definition
          const similarityScore = this.calculateSimilarityScore(sourceDefinition, definition.trim());
          
          changes.push({
            term,
            sourceDefinition,
            targetDefinition: definition.trim(),
            changeType: 'modified',
            similarityScore
          });
        }
        
        // Remove from source map to track what's left
        sourceDefinitions.delete(normalizedTerm);
      } else {
        // New definition
        changes.push({
          term,
          targetDefinition: definition.trim(),
          changeType: 'added'
        });
      }
    }
    
    // Any remaining source definitions were removed
    Array.from(sourceDefinitions.entries()).forEach(([term, definition]) => {
      changes.push({
        term,
        sourceDefinition: definition,
        changeType: 'removed'
      });
    });
    
    return changes;
  }
  
  /**
   * Analyze changes in references to other legislation or documents
   */
  private analyzeReferenceChanges(sourceContent: string, targetContent: string): ReferenceChange[] {
    const changes: ReferenceChange[] = [];
    
    // Simple detection of legislative references (would be more sophisticated in a real system)
    const referenceRegex = /(?:Article|Section)\s+(\d+(?:\.\d+)?)\s+of\s+(?:the\s+)?([^,.]+)/gi;
    
    const sourceReferences = new Set<string>();
    let match;
    
    // Extract source references
    while ((match = referenceRegex.exec(sourceContent)) !== null) {
      const [fullRef] = match;
      sourceReferences.add(fullRef);
    }
    
    // Reset regex
    referenceRegex.lastIndex = 0;
    
    // Extract target references and compare
    const targetReferences = new Set<string>();
    while ((match = referenceRegex.exec(targetContent)) !== null) {
      const [fullRef] = match;
      targetReferences.add(fullRef);
      
      if (!sourceReferences.has(fullRef)) {
        changes.push({
          targetRef: fullRef,
          changeType: 'added',
          description: `Added reference to ${fullRef}`
        });
      }
    }
    
    // Find removed references
    for (const ref of sourceReferences) {
      if (!targetReferences.has(ref)) {
        changes.push({
          sourceRef: ref,
          changeType: 'removed',
          description: `Removed reference to ${ref}`
        });
      }
    }
    
    return changes;
  }
  
  /**
   * Extract sentences with legal modality terms for deontic analysis
   */
  private performDeonticAnalysis(sourceContent: string, targetContent: string): DeonticAnalysis[] {
    const result: DeonticAnalysis[] = [];
    
    // Break documents into sentences
    const sourceSentences = this.getSentences(sourceContent);
    const targetSentences = this.getSentences(targetContent);
    
    // Analyze each sentence in source document
    for (const sentence of sourceSentences) {
      const deontic = this.extractDeonticElement(sentence);
      if (deontic) {
        // Check if this deontic element exists in target
        const targetMatch = this.findMatchingDeonticElement(deontic, targetSentences);
        
        if (!targetMatch) {
          // It doesn't exist in target, so it was removed
          deontic.changeType = 'removed';
          deontic.sourceLocation = `source/unknown`;
          result.push(deontic);
        } else if (targetMatch !== true) {
          // It exists but was modified
          const modifiedDeontic = { ...deontic };
          modifiedDeontic.changeType = 'modified';
          modifiedDeontic.sourceLocation = `source/unknown`;
          modifiedDeontic.targetLocation = `target/unknown`;
          modifiedDeontic.description = `Changed from "${deontic.description}" to "${targetMatch.description}"`;
          result.push(modifiedDeontic);
        }
      }
    }
    
    // Find added deontic elements in target
    for (const sentence of targetSentences) {
      const deontic = this.extractDeonticElement(sentence);
      if (deontic) {
        // Check if this already exists in source
        const exists = this.findMatchingDeonticElement(deontic, sourceSentences);
        
        if (!exists) {
          // It doesn't exist in source, so it was added
          deontic.changeType = 'added';
          deontic.targetLocation = `target/unknown`;
          result.push(deontic);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Find matching deontic element in a set of sentences
   * Returns true if exact match, the matching element if modified, or false if not found
   */
  private findMatchingDeonticElement(
    deontic: DeonticAnalysis, 
    sentences: string[]
  ): boolean | DeonticAnalysis {
    for (const sentence of sentences) {
      const match = this.extractDeonticElement(sentence);
      
      if (match) {
        // Check if it's the same obligation/right/etc
        if (
          match.type === deontic.type && 
          match.subject === deontic.subject &&
          match.action === deontic.action
        ) {
          // Check if it's exactly the same
          if (match.description === deontic.description) {
            return true;
          }
          
          // It's modified
          return match;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Extract deontic element (obligation, right, permission, prohibition) from a sentence
   */
  private extractDeonticElement(sentence: string): DeonticAnalysis | null {
    // Obligation patterns
    if (sentence.match(/\b(shall|must|is required to)\b/i)) {
      return this.parseDeonticSentence(sentence, 'obligation');
    }
    
    // Right patterns
    if (sentence.match(/\b(is entitled to|has the right to|may claim)\b/i)) {
      return this.parseDeonticSentence(sentence, 'right');
    }
    
    // Permission patterns
    if (sentence.match(/\b(may|is authorized to|is permitted to)\b/i) && 
        !sentence.match(/\b(may not|not permitted)\b/i)) {
      return this.parseDeonticSentence(sentence, 'permission');
    }
    
    // Prohibition patterns
    if (sentence.match(/\b(shall not|must not|may not|is prohibited from|is not permitted to)\b/i)) {
      return this.parseDeonticSentence(sentence, 'prohibition');
    }
    
    return null;
  }
  
  /**
   * Parse a sentence with a deontic modal to extract the subject, action, object
   */
  private parseDeonticSentence(sentence: string, type: 'obligation' | 'right' | 'permission' | 'prohibition'): DeonticAnalysis {
    // Very simplified extraction - just identify the sentence parts
    const parts = sentence.split(/\b(shall|must|may|is required to|is entitled to|has the right to|is authorized to|is permitted to|shall not|must not|may not|is prohibited from|is not permitted to)\b/i);
    
    let subject = 'unknown';
    let action = 'unknown';
    let object = undefined;
    let condition = undefined;
    
    if (parts.length >= 2) {
      // Subject is typically before the modal
      subject = parts[0].trim();
      
      // Action is after the modal
      if (parts.length >= 3) {
        // Check for conditional clauses
        const actionPart = parts[2];
        
        if (actionPart.includes('if') || actionPart.includes('when') || actionPart.includes('unless')) {
          const conditionParts = actionPart.split(/\b(if|when|unless)\b/i);
          
          if (conditionParts.length >= 3) {
            action = conditionParts[0].trim();
            condition = conditionParts.slice(1).join(' ').trim();
          } else {
            action = actionPart.trim();
          }
        } else {
          action = actionPart.trim();
        }
        
        // Try to extract object (very simplified)
        const matches = action.match(/(.+?)\s+(?:the|a|an)\s+(.+?)(?:\.|\s|$)/i);
        if (matches && matches.length >= 3) {
          action = matches[1].trim();
          object = matches[2].trim();
        }
      }
    }
    
    return {
      type,
      subject,
      action,
      object,
      condition,
      description: sentence.trim()
    };
  }
  
  /**
   * Find sentences that contain a specific term
   */
  private findTermContext(text: string, term: string): string[] {
    const contexts: string[] = [];
    const sentences = this.getSentences(text);
    
    for (const sentence of sentences) {
      if (sentence.match(new RegExp(`\\b${term}\\b`, 'i'))) {
        contexts.push(sentence.trim());
      }
    }
    
    return contexts;
  }
  
  /**
   * Match contexts between source and target based on similarity
   */
  private matchContexts(sourceContexts: string[], targetContexts: string[]): Array<{ source: string, target: string }> {
    const matches: Array<{ source: string, target: string }> = [];
    
    for (const source of sourceContexts) {
      // Find the best match in targetContexts
      let bestMatch: string | null = null;
      let bestScore = 0;
      
      for (const target of targetContexts) {
        const score = this.calculateSimilarityScore(source, target);
        if (score > bestScore && score > 0.6) { // 60% similarity threshold
          bestScore = score;
          bestMatch = target;
        }
      }
      
      if (bestMatch) {
        matches.push({ source, target: bestMatch });
      }
    }
    
    return matches;
  }
  
  /**
   * Split text into sentences
   */
  private getSentences(text: string): string[] {
    // Simple sentence splitting - would be more sophisticated in a real system
    return text.split(/(?<=[.!?])\s+/);
  }
  
  /**
   * Calculate similarity score between two texts (0-1)
   */
  private calculateSimilarityScore(textA: string, textB: string): number {
    if (!textA || !textB) return 0;
    
    // Simple word-level Jaccard similarity as a basic metric
    const wordsA = new Set(textA.toLowerCase().split(/\s+/));
    const wordsB = new Set(textB.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    
    return intersection.size / union.size;
  }
  
  /**
   * Highlight the term in context
   */
  private highlightTerm(text: string, term: string): string {
    return text.replace(new RegExp(`(\\b${term}\\b)`, 'gi'), '{$1}');
  }
  
  /**
   * Highlight differences between two texts
   */
  private highlightDifference(textA: string, textB: string, term: string): string {
    // This is a simplified approach, would be more sophisticated in a real system
    return textB.replace(new RegExp(`(\\b${term}\\b)`, 'gi'), '{$1}');
  }
}

export const semanticDiffService = new SemanticDiffService();