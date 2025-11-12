/**
 * Document Sidebar
 * Shows list of documents with search and pagination
 */

import { useState } from 'react';
import { FileText, Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { DocumentMeta } from '../utils/documentManager';

interface DocumentSidebarProps {
  documents: DocumentMeta[];
  currentDocumentId: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  onCreateDocument: () => void;
  onSwitchDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onClose?: () => void;
}

export function DocumentSidebar({
  documents,
  currentDocumentId,
  currentPage,
  totalPages,
  searchQuery,
  onCreateDocument,
  onSwitchDocument,
  onDeleteDocument,
  onSearch,
  onPageChange,
  onClose,
}: DocumentSidebarProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteDocument(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Documents</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* New Document Button */}
        <Button onClick={onCreateDocument} className="w-full mt-3" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Document List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    doc.id === currentDocumentId
                      ? 'bg-accent border-primary'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => onSwitchDocument(doc.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(doc.updatedAt)}</span>
                        <span>•</span>
                        <span>{doc.wordCount} words</span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className={`h-8 w-8 p-0 ${
                        deleteConfirm === doc.id
                          ? 'bg-destructive text-destructive-foreground'
                          : ''
                      }`}
                      title={deleteConfirm === doc.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
