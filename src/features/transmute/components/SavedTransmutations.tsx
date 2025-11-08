/**
 * SavedTransmutations Component
 * Display and manage saved transmutations
 */

import { useState } from 'react';
import { Trash2, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { deleteTransmutation } from '../utils/storage';
import { highlightText, generateThemeCSS } from '../utils/syntax';
import type { Transmutation } from '../types';
import { THEMES } from '../constants';
import { useEffect, useRef } from 'react';

interface SavedTransmutationsProps {
  transmutations: Transmutation[];
  onLoad: (transmutation: Transmutation) => void;
  onDelete: (id: string) => void;
}

export function SavedTransmutations({ transmutations, onLoad, onDelete }: SavedTransmutationsProps) {
  const { toast } = useToast();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const viewing = transmutations.find((t) => t.id === viewingId);

  // Update preview when viewing changes
  useEffect(() => {
    if (viewing && previewRef.current) {
      const highlighted = highlightText(viewing.originalText, viewing.language, viewing.theme);
      previewRef.current.innerHTML = `<pre>${highlighted}</pre>`;

      // Inject theme CSS
      const styleId = 'transmute-dialog-theme-styles';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = generateThemeCSS(viewing.theme);
    }
  }, [viewing]);

  const handleDelete = (id: string, title: string) => {
    const success = deleteTransmutation(id);
    if (success) {
      onDelete(id);
      toast({
        title: 'Deleted',
        description: `"${title}" has been removed`,
      });
      if (viewingId === id) {
        setViewingId(null);
      }
    } else {
      toast({
        title: 'Failed',
        description: 'Could not delete transmutation',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (transmutations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Transmutations</CardTitle>
          <CardDescription>Your saved transmutations will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No saved transmutations yet. Create and save your first one above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Transmutations ({transmutations.length})</CardTitle>
          <CardDescription>Load, view, or delete your saved transmutations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {transmutations.map((transmutation) => {
                const themeConfig = THEMES[transmutation.theme];

                return (
                  <div
                    key={transmutation.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{transmutation.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {themeConfig?.displayName || transmutation.theme}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {transmutation.language}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(transmutation.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {transmutation.originalText.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingId(transmutation.id)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onLoad(transmutation)}
                        title="Load into editor"
                      >
                        <span className="text-xs">📝</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transmutation.id, transmutation.title)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewingId !== null} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing && (
                <>
                  {THEMES[viewing.theme]?.displayName} • {viewing.language} •{' '}
                  {formatDate(viewing.createdAt)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div ref={previewRef} className="transmute-preview" />
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewingId(null)}>
              Close
            </Button>
            {viewing && (
              <Button
                onClick={() => {
                  onLoad(viewing);
                  setViewingId(null);
                  toast({
                    title: 'Loaded',
                    description: `"${viewing.title}" loaded into editor`,
                  });
                }}
              >
                Load into Editor
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
