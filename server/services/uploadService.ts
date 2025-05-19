import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { storage } from '../storage';
import { xmlParser } from '../utils/xmlParser';
import { Document, InsertDocument } from '../../shared/schema';

// Define our own File interface since we're using multer
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

class UploadService {
  private uploadDir: string;

  constructor() {
    // Create uploads directory if it doesn't exist
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Process an uploaded document file
   * @param file The file object from multer
   * @param userId The ID of the user who uploaded the file
   */
  async processDocument(file: UploadedFile, userId: string): Promise<Document> {
    try {
      // Extract content based on file type
      const content = await this.extractContent(file);
      
      // Generate XML representation
      const xml = await this.generateXml(file, content);
      
      // Create document in storage
      const document = await this.createDocument(file.originalname, content, xml, userId);
      
      // Clean up the temp file
      await this.cleanupFile(file.path);
      
      return document;
    } catch (error) {
      // Clean up on error
      if (file.path && fs.existsSync(file.path)) {
        await this.cleanupFile(file.path);
      }
      throw error;
    }
  }

  /**
   * Extract content from the uploaded file
   */
  private async extractContent(file: UploadedFile): Promise<string> {
    const extension = path.extname(file.originalname).toLowerCase();
    
    // For now, we'll just use the file content as is for demonstration
    // In a real implementation, we would use different parsers based on file type
    const content = await readFileAsync(file.path, 'utf-8');
    
    // In a production system, we would integrate with proper document parsers:
    // - PDF: pdf.js, pdf-parse, or pdfjs-dist
    // - DOCX: mammoth.js or docx
    // - HTML: cheerio or jsdom
    // - XML: xml2js or fast-xml-parser
    
    return content;
  }

  /**
   * Generate XML representation of the document content
   * In a real implementation, this would convert to Akoma Ntoso or another XML standard
   */
  private async generateXml(file: UploadedFile, content: string): Promise<string> {
    const extension = path.extname(file.originalname).toLowerCase();
    
    // For now, generate a simple XML structure
    // In a real implementation, we would use proper document structure analyzers
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <metadata>
    <title>${file.originalname}</title>
    <createdAt>${new Date().toISOString()}</createdAt>
    <fileType>${file.mimetype}</fileType>
  </metadata>
  <content>
    <![CDATA[${content}]]>
  </content>
</document>`;
    
    return xmlContent;
  }

  /**
   * Create a document in the storage system
   */
  private async createDocument(
    title: string, 
    content: string, 
    xml: string, 
    userId: string
  ): Promise<Document> {
    const docData: InsertDocument = {
      title,
      content,
      xml,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
    };
    
    const document = await storage.createDocument(docData);
    
    // Create an activity record for this upload
    await storage.createActivity({
      type: 'create',
      description: `Document "${title}" was uploaded and created`,
      userId,
      documentId: document.id,
    });
    
    return document;
  }

  /**
   * Clean up temporary file
   */
  private async cleanupFile(filePath: string): Promise<void> {
    try {
      await unlinkAsync(filePath);
    } catch (error) {
      console.error(`Error cleaning up file ${filePath}:`, error);
    }
  }
}

export const uploadService = new UploadService();