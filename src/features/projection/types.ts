/**
 * Projection Feature Type Definitions
 * Defines types for scenarios, conversations, and simulations
 */

import type { ConversationMessage, MeetingScenario, ScenarioType, ParticipantRole } from '@/shared/types/api';

/**
 * A projection session containing a scenario and conversation history
 */
export interface ProjectionSession {
  id: string;
  scenario: MeetingScenario;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

/**
 * Voice settings for text-to-speech
 */
export interface VoiceSettings {
  voiceName?: string;
  rate: number;
  pitch: number;
  volume: number;
  autoPlay: boolean;
}

/**
 * Scenario template for quick setup
 */
export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  scenarioType: ScenarioType;
  participantRole: ParticipantRole;
  icon: string;
  exampleContext: string;
}

// Re-export API types for convenience
export type { ConversationMessage, MeetingScenario, ScenarioType, ParticipantRole };
