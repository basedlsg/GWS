/**
 * useDocumentManager Hook
 * Manages document CRUD operations and state
 */

import { useState, useEffect, useCallback } from 'react';
import { Descendant } from 'slate';
import type { TransmuteDocument } from '../types';
import {
  loadDocumentsMeta,
  loadDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getCurrentDocumentId,
  setCurrentDocumentId,
  searchDocuments as searchDocs,
  sortDocuments as sortDocs,
  paginateDocuments,
  type DocumentMeta,
} from '../utils/documentManager';
import { DOCUMENTS_PER_PAGE, AUTOSAVE_DELAY } from '../constants';

export function useDocumentManager() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [currentDocument, setCurrentDocument] = useState<TransmuteDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'wordCount'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [autosaveTimeoutId, setAutosaveTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Load documents metadata on mount
  useEffect(() => {
    const loadDocs = () => {
      try {
        const meta = loadDocumentsMeta();
        setDocuments(meta);

        // Load current document or create new one
        const currentId = getCurrentDocumentId();
        if (currentId) {
          const doc = loadDocument(currentId);
          if (doc) {
            setCurrentDocument(doc);
          } else {
            // Current doc doesn't exist, create new one
            const newDoc = createDocument();
            setCurrentDocument(newDoc);
            setDocuments([...meta, {
              id: newDoc.id,
              title: newDoc.title,
              createdAt: newDoc.createdAt,
              updatedAt: newDoc.updatedAt,
              wordCount: newDoc.metadata.wordCount,
            }]);
          }
        } else {
          // No current document, create new one
          const newDoc = createDocument();
          setCurrentDocument(newDoc);
          setDocuments([...meta, {
            id: newDoc.id,
            title: newDoc.title,
            createdAt: newDoc.createdAt,
            updatedAt: newDoc.updatedAt,
            wordCount: newDoc.metadata.wordCount,
          }]);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocs();
  }, []);

  // Create new document
  const handleCreateDocument = useCallback(() => {
    const newDoc = createDocument();
    setCurrentDocument(newDoc);

    // Refresh documents list
    const meta = loadDocumentsMeta();
    setDocuments(meta);
    setCurrentPage(1);
  }, []);

  // Switch to a different document
  const handleSwitchDocument = useCallback((id: string) => {
    const doc = loadDocument(id);
    if (doc) {
      setCurrentDocument(doc);
      setCurrentDocumentId(id);
    }
  }, []);

  // Update current document content with autosave
  const handleUpdateContent = useCallback((content: Descendant[]) => {
    if (!currentDocument) return;

    // Update local state immediately
    const updatedDoc = {
      ...currentDocument,
      content,
    };
    setCurrentDocument(updatedDoc);

    // Clear existing autosave timeout
    if (autosaveTimeoutId) {
      clearTimeout(autosaveTimeoutId);
    }

    // Schedule autosave
    const timeoutId = setTimeout(() => {
      updateDocument(currentDocument.id, { content });

      // Refresh documents list to update metadata
      const meta = loadDocumentsMeta();
      setDocuments(meta);
    }, AUTOSAVE_DELAY);

    setAutosaveTimeoutId(timeoutId);
  }, [currentDocument, autosaveTimeoutId]);

  // Update document metadata (language, theme, etc.)
  const handleUpdateMetadata = useCallback((updates: Partial<TransmuteDocument['metadata']>) => {
    if (!currentDocument) return;

    const updatedDoc = {
      ...currentDocument,
      metadata: {
        ...currentDocument.metadata,
        ...updates,
      },
    };

    setCurrentDocument(updatedDoc);
    updateDocument(currentDocument.id, { metadata: updatedDoc.metadata });
  }, [currentDocument]);

  // Delete a document
  const handleDeleteDocument = useCallback((id: string) => {
    deleteDocument(id);

    // Refresh documents list
    const meta = loadDocumentsMeta();
    setDocuments(meta);

    // If deleted current document, create new one
    if (currentDocument?.id === id) {
      const newDoc = createDocument();
      setCurrentDocument(newDoc);
      setDocuments([...meta, {
        id: newDoc.id,
        title: newDoc.title,
        createdAt: newDoc.createdAt,
        updatedAt: newDoc.updatedAt,
        wordCount: newDoc.metadata.wordCount,
      }]);
    }
  }, [currentDocument]);

  // Search documents
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Change sort
  const handleSort = useCallback((field: typeof sortBy, order?: typeof sortOrder) => {
    setSortBy(field);
    if (order) setSortOrder(order);
    setCurrentPage(1);
  }, []);

  // Get filtered and sorted documents
  const getDisplayedDocuments = useCallback(() => {
    let filtered = documents;

    // Apply search
    if (searchQuery.trim()) {
      filtered = searchDocs(searchQuery);
    }

    // Apply sort
    filtered = sortDocs(filtered, sortBy, sortOrder);

    // Apply pagination
    return paginateDocuments(filtered, currentPage, DOCUMENTS_PER_PAGE);
  }, [documents, searchQuery, sortBy, sortOrder, currentPage]);

  return {
    documents: getDisplayedDocuments(),
    currentDocument,
    isLoading,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    createDocument: handleCreateDocument,
    switchDocument: handleSwitchDocument,
    updateContent: handleUpdateContent,
    updateMetadata: handleUpdateMetadata,
    deleteDocument: handleDeleteDocument,
    search: handleSearch,
    sort: handleSort,
  };
}
