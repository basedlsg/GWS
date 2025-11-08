/**
 * DistillationPage
 * Main page for the Distillation feature
 * Converts abstract goals into concrete, actionable task lists
 */

import { useState, useEffect } from 'react';
import { Target, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { useToast } from '@/shared/hooks/use-toast';
import { useAI } from '@/shared/hooks/useAI';
import { parseTasksFromText } from '@/shared/services/fallbackGenerators';
import { GoalInput } from './components/GoalInput';
import { TaskList } from './components/TaskList';
import { SessionList } from './components/SessionList';
import {
  loadSessions,
  createSession,
  deleteSession,
  getActiveSession,
  setActiveSessionId,
  updateTaskInSession,
  deleteTaskFromSession,
} from './utils/storage';
import type { DistillationSession, Persona, TaskStatus } from './types';

export function DistillationPage() {
  const { toast } = useToast();
  const { generateCompletion, isLoading, isConfigured } = useAI();

  const [activeSession, setActiveSession] = useState<DistillationSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<DistillationSession[]>([]);

  // Load initial data
  useEffect(() => {
    setSavedSessions(loadSessions());
    const active = getActiveSession();
    setActiveSession(active);
  }, []);

  // Handle generating tasks from a goal
  const handleGenerateTasks = async (goal: string, persona: Persona) => {
    try {
      const prompt = `You are a ${persona} productivity coach. Break down this goal into 6-8 specific, actionable tasks with detailed sub-steps. Each task should be concrete and measurable.

Goal: ${goal}

For each task, provide:
1. The main action (what needs to be done)
2. 2-3 specific sub-steps
3. Time estimate
4. Priority level (high/medium/low)

Format as a numbered list. Be specific about resources, tools, and concrete actions. Example:
1. [HIGH PRIORITY] Research and evaluate project management tools (2 hours)
   - Visit asana.com, monday.com, and trello.com
   - Compare features and pricing for teams of 5-10
   - Read reviews on g2.com and capterra.com`;

      const response = await generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 1000,
      }, async () => {
        // Fallback to template generation
        const { generateTasksFallback } = await import('@/shared/services/fallbackGenerators');
        const tasks = generateTasksFallback(goal, persona);
        return tasks.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
      });

      // Parse tasks from response
      const tasks = parseTasksFromText(response.text);

      const newSession = createSession(goal, persona, tasks, isConfigured);
      setActiveSession(newSession);
      setSavedSessions(loadSessions());

      toast({
        title: 'Success!',
        description: `Generated ${tasks.length} tasks for your goal`,
      });
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate tasks. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    if (!activeSession) return;

    const success = updateTaskInSession(activeSession.id, taskId, { status });

    if (success) {
      const updated = loadSessions().find((s) => s.id === activeSession.id);
      if (updated) {
        setActiveSession(updated);
        setSavedSessions(loadSessions());
      }
    }
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    if (!activeSession) return;

    const success = deleteTaskFromSession(activeSession.id, taskId);

    if (success) {
      const updated = loadSessions().find((s) => s.id === activeSession.id);
      if (updated) {
        setActiveSession(updated);
        setSavedSessions(loadSessions());
      }

      toast({
        title: 'Deleted',
        description: 'Task removed from session',
      });
    }
  };

  // Handle session selection
  const handleSessionSelect = (session: DistillationSession) => {
    setActiveSession(session);
    setActiveSessionId(session.id);
  };

  // Handle session deletion
  const handleSessionDelete = (id: string) => {
    const success = deleteSession(id);

    if (success) {
      setSavedSessions(loadSessions());

      if (activeSession?.id === id) {
        setActiveSession(null);
      }
    }
  };

  // Handle creating new session
  const handleNewSession = () => {
    setActiveSession(null);
    setActiveSessionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Distillation</h1>
          </div>

          {activeSession && (
            <Button variant="outline" onClick={handleNewSession} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              New Session
            </Button>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          Transform abstract goals into concrete, actionable task lists
        </p>
      </div>

      {/* Active Session Header */}
      {activeSession && (
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-base">Active Goal: {activeSession.goal}</CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Goal Input */}
      {!activeSession && (
        <GoalInput
          onSubmit={handleGenerateTasks}
          isGenerating={isLoading}
          
        />
      )}

      {/* Task List */}
      {activeSession && (
        <TaskList
          session={activeSession}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskDelete={handleTaskDelete}
        />
      )}

      {/* Saved Sessions */}
      {savedSessions.length > 0 && (
        <>
          <Separator />
          <SessionList
            sessions={savedSessions}
            activeSessionId={activeSession?.id || null}
            onSessionSelect={handleSessionSelect}
            onSessionDelete={handleSessionDelete}
          />
        </>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Enter your goal</strong> - Be as specific or abstract as you like. "Get in shape" or "Build a 6-figure business" both work.
          </p>
          <p>
            <strong>2. Choose an approach</strong> - Select a persona that matches your preferred working style:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Coach:</strong> Motivating, milestone-focused tasks</li>
            <li><strong>Analyst:</strong> Logical, systematic breakdown</li>
            <li><strong>Creative:</strong> Innovative, exploratory approaches</li>
            <li><strong>Pragmatist:</strong> Practical, efficient action items</li>
          </ul>
          <p>
            <strong>3. Track progress</strong> - Mark tasks as in-progress or completed as you work through them
          </p>
          <p>
            <strong>4. Export</strong> - Download your action plan as Markdown, JSON, CSV, or plain text
          </p>
          <p className="pt-2 border-t">
            <strong>💡 Tip:</strong> Be specific with your goals for better task breakdown. The more context you provide, the more actionable your tasks will be.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
