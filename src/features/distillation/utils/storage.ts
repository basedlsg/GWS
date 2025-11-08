/**
 * Distillation localStorage Utilities
 * Manages persistence of distillation sessions and tasks
 */

import { getItem, setItem } from '@/shared/utils/localStorage';
import type { DistillationSession, Task } from '../types';
import { SESSIONS_STORAGE_KEY, ACTIVE_SESSION_KEY, MAX_SAVED_SESSIONS } from '../constants';

/**
 * Load all saved sessions
 */
export function loadSessions(): DistillationSession[] {
  return getItem<DistillationSession[]>(SESSIONS_STORAGE_KEY, []);
}

/**
 * Create a new session
 */
export function createSession(
  goal: string,
  persona: string,
  tasks: Task[],
  usedAI: boolean
): DistillationSession {
  const sessions = loadSessions();

  const newSession: DistillationSession = {
    id: generateId(),
    goal,
    persona: persona as any,
    tasks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedTaskCount: 0,
    totalTaskCount: tasks.length,
    usedAI,
  };

  // Add to beginning of array (most recent first)
  const updated = [newSession, ...sessions];

  // Enforce max limit
  const trimmed = updated.slice(0, MAX_SAVED_SESSIONS);

  setItem(SESSIONS_STORAGE_KEY, trimmed);
  setItem(ACTIVE_SESSION_KEY, newSession.id);

  return newSession;
}

/**
 * Update an existing session
 */
export function updateSession(
  id: string,
  updates: Partial<Omit<DistillationSession, 'id' | 'createdAt'>>
): boolean {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === id);

  if (index === -1) {
    return false;
  }

  // Calculate stats if tasks were updated
  if (updates.tasks) {
    const completedCount = updates.tasks.filter((t) => t.status === 'completed').length;
    updates.completedTaskCount = completedCount;
    updates.totalTaskCount = updates.tasks.length;
  }

  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as DistillationSession;

  return setItem(SESSIONS_STORAGE_KEY, sessions);
}

/**
 * Delete a session
 */
export function deleteSession(id: string): boolean {
  const sessions = loadSessions();
  const filtered = sessions.filter((s) => s.id !== id);

  if (filtered.length === sessions.length) {
    return false; // Nothing was deleted
  }

  // If we deleted the active session, clear it
  const activeId = getActiveSessionId();
  if (activeId === id) {
    setItem(ACTIVE_SESSION_KEY, null);
  }

  return setItem(SESSIONS_STORAGE_KEY, filtered);
}

/**
 * Get the active session ID
 */
export function getActiveSessionId(): string | null {
  return getItem<string | null>(ACTIVE_SESSION_KEY, null);
}

/**
 * Set the active session ID
 */
export function setActiveSessionId(id: string | null): boolean {
  return setItem(ACTIVE_SESSION_KEY, id);
}

/**
 * Get the active session
 */
export function getActiveSession(): DistillationSession | null {
  const activeId = getActiveSessionId();
  if (!activeId) return null;

  const sessions = loadSessions();
  return sessions.find((s) => s.id === activeId) || null;
}

/**
 * Update a task within a session
 */
export function updateTaskInSession(sessionId: string, taskId: string, updates: Partial<Task>): boolean {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return false;

  const taskIndex = session.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return false;

  session.tasks[taskIndex] = {
    ...session.tasks[taskIndex],
    ...updates,
  } as Task;

  // Update completed timestamp if status changed to completed
  if (updates.status === 'completed' && !session.tasks[taskIndex].completedAt) {
    session.tasks[taskIndex].completedAt = new Date().toISOString();
  }

  // Clear completed timestamp if status changed from completed
  if (updates.status && updates.status !== 'completed') {
    session.tasks[taskIndex].completedAt = undefined;
  }

  return updateSession(sessionId, { tasks: session.tasks });
}

/**
 * Add tasks to a session
 */
export function addTasksToSession(sessionId: string, tasks: Task[]): boolean {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return false;

  const updatedTasks = [...session.tasks, ...tasks];
  return updateSession(sessionId, { tasks: updatedTasks });
}

/**
 * Delete a task from a session
 */
export function deleteTaskFromSession(sessionId: string, taskId: string): boolean {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return false;

  const updatedTasks = session.tasks.filter((t) => t.id !== taskId);
  return updateSession(sessionId, { tasks: updatedTasks });
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Export sessions as JSON
 */
export function exportSessionsJSON(): string {
  const sessions = loadSessions();
  return JSON.stringify(sessions, null, 2);
}

/**
 * Import sessions from JSON
 */
export function importSessionsJSON(json: string): { success: boolean; count: number; error?: string } {
  try {
    const imported = JSON.parse(json) as DistillationSession[];

    if (!Array.isArray(imported)) {
      return { success: false, count: 0, error: 'Invalid format: expected an array' };
    }

    // Validate structure
    const valid = imported.every(
      (s) =>
        typeof s.id === 'string' &&
        typeof s.goal === 'string' &&
        Array.isArray(s.tasks) &&
        typeof s.persona === 'string'
    );

    if (!valid) {
      return { success: false, count: 0, error: 'Invalid session structure' };
    }

    const existing = loadSessions();
    const merged = [...imported, ...existing];
    const unique = Array.from(new Map(merged.map((s) => [s.id, s])).values());
    const trimmed = unique.slice(0, MAX_SAVED_SESSIONS);

    setItem(SESSIONS_STORAGE_KEY, trimmed);

    return { success: true, count: imported.length };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
