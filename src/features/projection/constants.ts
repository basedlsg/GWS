/**
 * Projection Feature Constants
 * Scenario templates, storage keys, and default values
 */

import type { ScenarioTemplate, ScenarioType, ParticipantRole } from './types';

/**
 * localStorage key for projection sessions
 */
export const SESSIONS_STORAGE_KEY = 'gws:projection:sessions';

/**
 * localStorage key for active session ID
 */
export const ACTIVE_SESSION_KEY = 'gws:projection:activeSession';

/**
 * localStorage key for voice settings
 */
export const VOICE_SETTINGS_KEY = 'gws:projection:voiceSettings';

/**
 * Maximum number of saved sessions
 */
export const MAX_SAVED_SESSIONS = 20;

/**
 * Default voice settings
 */
export const DEFAULT_VOICE_SETTINGS = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoPlay: false,
};

/**
 * Scenario type labels and icons
 */
export const SCENARIO_TYPE_INFO: Record<ScenarioType, { name: string; icon: string; description: string }> = {
  interview: {
    name: 'Job Interview',
    icon: '💼',
    description: 'Practice answering interview questions and presenting your qualifications',
  },
  pitch: {
    name: 'Investor Pitch',
    icon: '📈',
    description: 'Rehearse pitching your business idea to potential investors',
  },
  review: {
    name: 'Performance Review',
    icon: '📋',
    description: 'Prepare for performance discussions and feedback sessions',
  },
  negotiation: {
    name: 'Negotiation',
    icon: '🤝',
    description: 'Practice negotiating salary, contracts, or business deals',
  },
  presentation: {
    name: 'Presentation',
    icon: '🎤',
    description: 'Rehearse presentations and public speaking engagements',
  },
  custom: {
    name: 'Custom Scenario',
    icon: '⚙️',
    description: 'Create your own custom scenario',
  },
};

/**
 * Participant role labels
 */
export const PARTICIPANT_ROLE_INFO: Record<ParticipantRole, { name: string; icon: string }> = {
  interviewer: {
    name: 'Interviewer',
    icon: '👔',
  },
  investor: {
    name: 'Investor',
    icon: '💰',
  },
  manager: {
    name: 'Manager',
    icon: '👨‍💼',
  },
  colleague: {
    name: 'Colleague',
    icon: '👥',
  },
  client: {
    name: 'Client',
    icon: '🤵',
  },
  custom: {
    name: 'Custom',
    icon: '👤',
  },
};

/**
 * Pre-built scenario templates
 */
export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'software-engineer-interview',
    name: 'Software Engineer Interview',
    description: 'Technical interview for a senior software engineer position',
    scenarioType: 'interview',
    participantRole: 'interviewer',
    icon: '💻',
    exampleContext: 'Senior Software Engineer position at a tech startup. Focus on system design, coding skills, and team collaboration.',
  },
  {
    id: 'startup-pitch',
    name: 'Startup Pitch',
    description: 'Pitch your startup idea to venture capitalists',
    scenarioType: 'pitch',
    participantRole: 'investor',
    icon: '🚀',
    exampleContext: 'Seed round pitch for a SaaS startup. Investors are interested in market size, traction, and team experience.',
  },
  {
    id: 'salary-negotiation',
    name: 'Salary Negotiation',
    description: 'Negotiate compensation for a new role or promotion',
    scenarioType: 'negotiation',
    participantRole: 'manager',
    icon: '💵',
    exampleContext: 'Negotiating compensation package including base salary, equity, and benefits for a senior role.',
  },
  {
    id: 'annual-review',
    name: 'Annual Performance Review',
    description: 'Discuss achievements and goals with your manager',
    scenarioType: 'review',
    participantRole: 'manager',
    icon: '⭐',
    exampleContext: 'Year-end performance review. Prepare to discuss accomplishments, challenges, and career growth goals.',
  },
  {
    id: 'conference-presentation',
    name: 'Conference Presentation',
    description: 'Present your work at a professional conference',
    scenarioType: 'presentation',
    participantRole: 'colleague',
    icon: '🎯',
    exampleContext: 'Technical conference presentation followed by Q&A. Audience includes industry professionals and potential collaborators.',
  },
  {
    id: 'client-proposal',
    name: 'Client Proposal Meeting',
    description: 'Present a solution to a potential client',
    scenarioType: 'pitch',
    participantRole: 'client',
    icon: '📊',
    exampleContext: 'Presenting a custom software solution to a prospective client. They need convincing of ROI and timeline.',
  },
];

/**
 * Example opening messages by scenario type
 */
export const OPENING_MESSAGES: Record<ScenarioType, string> = {
  interview: "Hi, thanks for coming in today. I'd like to start by having you tell me a bit about yourself and why you're interested in this role.",
  pitch: "Thanks for taking the time to meet with us. We're excited to hear about your company. Why don't you start with the problem you're solving?",
  review: "Thanks for meeting with me. I wanted to take some time to discuss your performance over the past year and talk about your goals moving forward.",
  negotiation: "I appreciate you bringing this up. Let's discuss what you're looking for and see if we can find something that works for both of us.",
  presentation: "Thank you for that introduction. I'm looking forward to your presentation today. Please go ahead and begin whenever you're ready.",
  custom: "Hello, I'm ready to begin our conversation. How would you like to start?",
};
