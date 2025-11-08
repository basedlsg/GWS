/**
 * API type definitions for The Great Work Suite
 */

/**
 * Task priority levels
 */
export type TaskPriority = 'high' | 'medium' | 'low';

/**
 * Task status
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

/**
 * Task interface for Distillation
 */
export interface Task {
  id: string;
  text: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

/**
 * Scenario participant role
 */
export type ParticipantRole = 'interviewer' | 'investor' | 'manager' | 'colleague' | 'client' | 'custom';

/**
 * Meeting scenario type
 */
export type ScenarioType = 'interview' | 'pitch' | 'review' | 'negotiation' | 'presentation' | 'custom';

/**
 * Conversation message
 */
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Meeting scenario
 */
export interface MeetingScenario {
  id: string;
  type: ScenarioType;
  title: string;
  description: string;
  participantRole: ParticipantRole;
  participantName?: string;
  context: string;
  createdAt: string;
}

/**
 * Achievement entry
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'transmute' | 'distillation' | 'projection' | 'culmination';
  date: string;
  metadata?: Record<string, unknown>;
}

/**
 * Gemini API response format
 */
export interface GeminiResponse {
  text: string;
  finishReason?: string;
  safetyRatings?: Array<{
    category: string;
    probability: string;
  }>;
}

/**
 * AI generation options
 */
export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

/**
 * Persona type for Distillation
 */
export type Persona = 'strategic' | 'tactical' | 'creative' | 'philosophical';

/**
 * API error type
 */
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}
