/**
 * Document Management Utilities
 * Handle CRUD operations for documents in localStorage
 */

import { Descendant } from 'slate';
import type { TransmuteDocument } from '../types';
import {
  DOCUMENTS_STORAGE_KEY,
  DOCUMENTS_META_STORAGE_KEY,
  CURRENT_DOC_KEY,
  DEFAULT_DOCUMENT_CONTENT,
  DEFAULT_SETTINGS,
} from '../constants';

/**
 * Document metadata (for fast loading lists)
 */
export interface DocumentMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

/**
 * Generate unique document ID
 */
function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Count words in Slate content
 */
function countWords(content: Descendant[]): number {
  const text = JSON.stringify(content);
  const words = text.match(/\b\w+\b/g);
  return words ? words.length : 0;
}

/**
 * Count characters in Slate content
 */
function countCharacters(content: Descendant[]): number {
  const text = JSON.stringify(content);
  return text.replace(/\s/g, '').length;
}

/**
 * Extract title from content (first heading or paragraph)
 */
function extractTitle(content: Descendant[]): string {
  for (const node of content) {
    if ('type' in node && (node.type === 'heading-1' || node.type === 'paragraph')) {
      if ('children' in node && Array.isArray(node.children)) {
        const text = node.children.map(child => ('text' in child ? child.text : '')).join('');
        if (text.trim()) {
          return text.trim().substring(0, 100);
        }
      }
    }
  }
  return 'Untitled Document';
}

/**
 * Load all document metadata
 */
export function loadDocumentsMeta(): DocumentMeta[] {
  try {
    const stored = localStorage.getItem(DOCUMENTS_META_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading documents metadata:', error);
    return [];
  }
}

/**
 * Save document metadata
 */
function saveDocumentsMeta(meta: DocumentMeta[]): void {
  try {
    localStorage.setItem(DOCUMENTS_META_STORAGE_KEY, JSON.stringify(meta));
  } catch (error) {
    console.error('Error saving documents metadata:', error);
  }
}

/**
 * Load a single document by ID
 */
export function loadDocument(id: string): TransmuteDocument | null {
  try {
    const key = `${DOCUMENTS_STORAGE_KEY}:${id}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error loading document ${id}:`, error);
    return null;
  }
}

/**
 * Save a document
 */
export function saveDocument(doc: TransmuteDocument): void {
  try {
    // Save document content
    const key = `${DOCUMENTS_STORAGE_KEY}:${doc.id}`;
    localStorage.setItem(key, JSON.stringify(doc));

    // Update metadata
    const meta = loadDocumentsMeta();
    const existingIndex = meta.findIndex(m => m.id === doc.id);

    const docMeta: DocumentMeta = {
      id: doc.id,
      title: doc.title,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      wordCount: doc.metadata.wordCount,
    };

    if (existingIndex >= 0) {
      meta[existingIndex] = docMeta;
    } else {
      meta.push(docMeta);
    }

    saveDocumentsMeta(meta);
  } catch (error) {
    console.error(`Error saving document ${doc.id}:`, error);
    throw new Error('Failed to save document. Storage may be full.');
  }
}

/**
 * Create a new document
 */
export function createDocument(): TransmuteDocument {
  const now = new Date().toISOString();
  const content = DEFAULT_DOCUMENT_CONTENT as Descendant[];

  const doc: TransmuteDocument = {
    id: generateId(),
    title: extractTitle(content),
    content,
    createdAt: now,
    updatedAt: now,
    metadata: {
      wordCount: countWords(content),
      characterCount: countCharacters(content),
      selectedLanguage: DEFAULT_SETTINGS.codeLanguage,
      selectedTheme: DEFAULT_SETTINGS.codeTheme,
      fontSize: DEFAULT_SETTINGS.fontSize,
      fontFamily: DEFAULT_SETTINGS.fontFamily,
    },
  };

  saveDocument(doc);
  setCurrentDocumentId(doc.id);

  return doc;
}

/**
 * Update document content
 */
export function updateDocument(id: string, updates: Partial<TransmuteDocument>): void {
  const doc = loadDocument(id);
  if (!doc) {
    console.error(`Document ${id} not found`);
    return;
  }

  const updatedDoc: TransmuteDocument = {
    ...doc,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate metadata if content changed
  if (updates.content) {
    updatedDoc.title = extractTitle(updates.content);
    updatedDoc.metadata.wordCount = countWords(updates.content);
    updatedDoc.metadata.characterCount = countCharacters(updates.content);
  }

  saveDocument(updatedDoc);
}

/**
 * Delete a document
 */
export function deleteDocument(id: string): void {
  try {
    // Remove document content
    const key = `${DOCUMENTS_STORAGE_KEY}:${id}`;
    localStorage.removeItem(key);

    // Update metadata
    const meta = loadDocumentsMeta();
    const filtered = meta.filter(m => m.id !== id);
    saveDocumentsMeta(filtered);

    // Clear current doc if it was deleted
    const currentId = getCurrentDocumentId();
    if (currentId === id) {
      localStorage.removeItem(CURRENT_DOC_KEY);
    }
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
  }
}

/**
 * Get current document ID
 */
export function getCurrentDocumentId(): string | null {
  return localStorage.getItem(CURRENT_DOC_KEY);
}

/**
 * Set current document ID
 */
export function setCurrentDocumentId(id: string): void {
  localStorage.setItem(CURRENT_DOC_KEY, id);
}

/**
 * Search documents by title
 */
export function searchDocuments(query: string): DocumentMeta[] {
  const meta = loadDocumentsMeta();
  const lowerQuery = query.toLowerCase();

  return meta.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort documents
 */
export function sortDocuments(
  docs: DocumentMeta[],
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'wordCount',
  order: 'asc' | 'desc' = 'desc'
): DocumentMeta[] {
  const sorted = [...docs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'wordCount':
        comparison = a.wordCount - b.wordCount;
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Paginate documents
 */
export function paginateDocuments(
  docs: DocumentMeta[],
  page: number,
  perPage: number
): { documents: DocumentMeta[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(docs.length / perPage);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    documents: docs.slice(startIndex, endIndex),
    totalPages,
    currentPage: safePage,
  };
}
