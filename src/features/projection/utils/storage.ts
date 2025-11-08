/**
 * Projection localStorage Utilities
 * Manages persistence of projection sessions and settings
 */

import { getItem, setItem } from '@/shared/utils/localStorage';
import type { ProjectionSession, VoiceSettings, MeetingScenario, ConversationMessage } from '../types';
import {
  SESSIONS_STORAGE_KEY,
  ACTIVE_SESSION_KEY,
  VOICE_SETTINGS_KEY,
  MAX_SAVED_SESSIONS,
  DEFAULT_VOICE_SETTINGS,
} from '../constants';

/**
 * Load all saved sessions
 */
export function loadSessions(): ProjectionSession[] {
  return getItem<ProjectionSession[]>(SESSIONS_STORAGE_KEY, []);
}

/**
 * Create a new session
 */
export function createSession(scenario: MeetingScenario, initialMessage?: ConversationMessage): ProjectionSession {
  const sessions = loadSessions();

  const messages: ConversationMessage[] = initialMessage ? [initialMessage] : [];

  const newSession: ProjectionSession = {
    id: generateId(),
    scenario,
    messages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: messages.length,
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
  updates: Partial<Omit<ProjectionSession, 'id' | 'createdAt'>>
): boolean {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === id);

  if (index === -1) {
    return false;
  }

  // Calculate message count if messages were updated
  if (updates.messages) {
    updates.messageCount = updates.messages.length;
  }

  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as ProjectionSession;

  return setItem(SESSIONS_STORAGE_KEY, sessions);
}

/**
 * Add a message to a session
 */
export function addMessageToSession(sessionId: string, message: ConversationMessage): boolean {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return false;

  const updatedMessages = [...session.messages, message];
  return updateSession(sessionId, { messages: updatedMessages });
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
export function getActiveSession(): ProjectionSession | null {
  const activeId = getActiveSessionId();
  if (!activeId) return null;

  const sessions = loadSessions();
  return sessions.find((s) => s.id === activeId) || null;
}

/**
 * Load voice settings
 */
export function loadVoiceSettings(): VoiceSettings {
  return getItem<VoiceSettings>(VOICE_SETTINGS_KEY, DEFAULT_VOICE_SETTINGS);
}

/**
 * Save voice settings
 */
export function saveVoiceSettings(settings: VoiceSettings): boolean {
  return setItem(VOICE_SETTINGS_KEY, settings);
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `projection_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
    const imported = JSON.parse(json) as ProjectionSession[];

    if (!Array.isArray(imported)) {
      return { success: false, count: 0, error: 'Invalid format: expected an array' };
    }

    // Validate structure
    const valid = imported.every(
      (s) =>
        typeof s.id === 'string' &&
        typeof s.scenario === 'object' &&
        Array.isArray(s.messages)
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
