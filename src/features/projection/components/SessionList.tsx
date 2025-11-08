/**
 * SessionList Component
 * Display and manage saved projection sessions
 */

import { useState } from 'react';
import { Trash2, Eye, Calendar, MessageCircle } from 'lucide-react';
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
import { SCENARIO_TYPE_INFO } from '../constants';
import type { ProjectionSession } from '../types';

interface SessionListProps {
  sessions: ProjectionSession[];
  activeSessionId: string | null;
  onSessionSelect: (session: ProjectionSession) => void;
  onSessionDelete: (id: string) => void;
}

export function SessionList({ sessions, activeSessionId, onSessionSelect, onSessionDelete }: SessionListProps) {
  const { toast } = useToast();
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewing = sessions.find((s) => s.id === viewingId);

  const handleDelete = (id: string, title: string) => {
    onSessionDelete(id);
    toast({
      title: 'Deleted',
      description: `"${title.substring(0, 30)}..." has been removed`,
    });
    if (viewingId === id) {
      setViewingId(null);
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

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Sessions</CardTitle>
          <CardDescription>Your projection sessions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No saved sessions yet. Create your first simulation to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Saved Sessions ({sessions.length})</CardTitle>
          <CardDescription>Load, view, or delete your past projection sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sessions.map((session) => {
                const scenarioInfo = SCENARIO_TYPE_INFO[session.scenario.type];
                const isActive = session.id === activeSessionId;

                return (
                  <div
                    key={session.id}
                    className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-primary/5 border-primary'
                        : 'bg-card hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm truncate flex-1">
                          {session.scenario.title}
                        </h4>
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">{scenarioInfo.icon}</span>
                          {scenarioInfo.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {session.messageCount} messages
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.createdAt)}
                        </span>
                      </div>

                      {session.scenario.context && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {session.scenario.context}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingId(session.id)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSessionSelect(session)}
                        title="Load session"
                      >
                        <span className="text-xs">📂</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(session.id, session.scenario.title)}
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

      {/* Preview Dialog */}
      <Dialog open={viewingId !== null} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{viewing?.scenario.title}</DialogTitle>
            <DialogDescription>
              {viewing && (
                <>
                  {SCENARIO_TYPE_INFO[viewing.scenario.type].icon}{' '}
                  {SCENARIO_TYPE_INFO[viewing.scenario.type].name} •{' '}
                  {formatDate(viewing.createdAt)} •{' '}
                  {viewing.messageCount} messages
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {viewing && (
              <div className="space-y-3 pr-4">
                {viewing.scenario.context && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Context:</p>
                    <p className="text-sm text-muted-foreground">{viewing.scenario.context}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {viewing.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary/10 ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">
                        {message.role === 'user' ? 'You' : viewing.scenario.participantRole}
                      </p>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setViewingId(null)}>
              Close
            </Button>
            {viewing && (
              <Button
                onClick={() => {
                  onSessionSelect(viewing);
                  setViewingId(null);
                  toast({
                    title: 'Loaded',
                    description: `"${viewing.scenario.title.substring(0, 30)}..." loaded`,
                  });
                }}
              >
                Load Session
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
