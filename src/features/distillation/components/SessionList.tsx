/**
 * SessionList Component
 * Display and manage saved distillation sessions
 */

import { useState } from 'react';
import { Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Progress } from '@/shared/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { PERSONA_INFO } from '../constants';
import type { DistillationSession } from '../types';

interface SessionListProps {
  sessions: DistillationSession[];
  activeSessionId: string | null;
  onSessionSelect: (session: DistillationSession) => void;
  onSessionDelete: (id: string) => void;
}

export function SessionList({ sessions, activeSessionId, onSessionSelect, onSessionDelete }: SessionListProps) {
  const { toast } = useToast();
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewing = sessions.find((s) => s.id === viewingId);

  const handleDelete = (id: string, goal: string) => {
    onSessionDelete(id);
    toast({
      title: 'Deleted',
      description: `"${goal.substring(0, 30)}..." has been removed`,
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
          <CardDescription>Your distillation sessions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No saved sessions yet. Generate tasks from a goal to create your first session!
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
          <CardDescription>Load, view, or delete your past distillation sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sessions.map((session) => {
                const persona = PERSONA_INFO[session.persona];
                const isActive = session.id === activeSessionId;
                const completionRate = session.totalTaskCount > 0
                  ? (session.completedTaskCount / session.totalTaskCount) * 100
                  : 0;

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
                          {session.goal}
                        </h4>
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">{persona.icon}</span>
                          {persona.name}
                        </Badge>
                        {session.usedAI && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.createdAt)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {session.completedTaskCount}/{session.totalTaskCount} tasks
                          </span>
                          <span>{Math.round(completionRate)}%</span>
                        </div>
                        <Progress value={completionRate} className="h-1.5" />
                      </div>
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
                        onClick={() => handleDelete(session.id, session.goal)}
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
            <DialogTitle>{viewing?.goal}</DialogTitle>
            <DialogDescription>
              {viewing && (
                <>
                  {PERSONA_INFO[viewing.persona].icon} {PERSONA_INFO[viewing.persona].name} •{' '}
                  {formatDate(viewing.createdAt)} •{' '}
                  {viewing.usedAI ? 'AI-generated' : 'Template-based'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {viewing && (
              <div className="space-y-2 pr-4">
                {viewing.tasks.map((task) => (
                  <div key={task.id} className="p-2 rounded border bg-card">
                    <div className="flex items-start gap-2">
                      <span className="text-sm">
                        {task.status === 'completed' ? '✓' : task.status === 'in_progress' ? '→' : '○'}
                      </span>
                      <p className={`text-sm flex-1 ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.text}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
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
                    description: `"${viewing.goal.substring(0, 30)}..." loaded`,
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
