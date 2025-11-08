/**
 * Fallback response generators for when Gemini API is not available
 * These provide contextually relevant mock responses
 */

import { Task, TaskPriority, ConversationMessage, Persona, ScenarioType, ParticipantRole } from '@/shared/types/api';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract keywords from goal text
 */
function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'i', 'want', 'need', 'would', 'like', 'should', 'could', 'will', 'my'
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 3);
}

/**
 * Generate tasks from a goal using template-based approach
 * @param goal - User's goal description
 * @param persona - Coaching persona to use
 * @returns Array of generated tasks
 */
export function generateTasksFallback(goal: string, persona: Persona = 'strategic'): Task[] {
  const keywords = extractKeywords(goal);
  const mainKeyword = keywords[0] || 'goal';

  const personaTemplates = {
    strategic: [
      { text: `Define clear success metrics for ${mainKeyword}`, priority: 'high' as TaskPriority },
      { text: `Research best practices and case studies related to ${goal}`, priority: 'high' as TaskPriority },
      { text: `Create a comprehensive roadmap with milestones`, priority: 'high' as TaskPriority },
      { text: `Identify potential risks and mitigation strategies`, priority: 'medium' as TaskPriority },
      { text: `Establish key performance indicators (KPIs)`, priority: 'medium' as TaskPriority },
      { text: `Schedule regular progress reviews and adjustments`, priority: 'low' as TaskPriority },
    ],
    tactical: [
      { text: `Break down ${goal} into weekly actionable items`, priority: 'high' as TaskPriority },
      { text: `Set up daily tracking system for progress`, priority: 'high' as TaskPriority },
      { text: `Allocate specific time blocks for ${mainKeyword} work`, priority: 'high' as TaskPriority },
      { text: `Create a checklist of immediate next actions`, priority: 'medium' as TaskPriority },
      { text: `Identify tools and resources needed`, priority: 'medium' as TaskPriority },
      { text: `Set up accountability system or find an accountability partner`, priority: 'low' as TaskPriority },
    ],
    creative: [
      { text: `Brainstorm innovative approaches to ${mainKeyword}`, priority: 'high' as TaskPriority },
      { text: `Explore unconventional methods and perspectives`, priority: 'high' as TaskPriority },
      { text: `Create a vision board or visual representation of ${goal}`, priority: 'medium' as TaskPriority },
      { text: `Find inspiring examples and case studies`, priority: 'medium' as TaskPriority },
      { text: `Experiment with different techniques and iterate`, priority: 'medium' as TaskPriority },
      { text: `Document creative insights and breakthroughs`, priority: 'low' as TaskPriority },
    ],
    philosophical: [
      { text: `Reflect on why ${goal} matters to you personally`, priority: 'high' as TaskPriority },
      { text: `Identify underlying values and principles driving this goal`, priority: 'high' as TaskPriority },
      { text: `Consider how ${mainKeyword} aligns with your life purpose`, priority: 'medium' as TaskPriority },
      { text: `Examine potential obstacles from multiple perspectives`, priority: 'medium' as TaskPriority },
      { text: `Develop a philosophical framework for decision-making`, priority: 'low' as TaskPriority },
      { text: `Journal about the deeper meaning of this journey`, priority: 'low' as TaskPriority },
    ],
  };

  const templates = personaTemplates[persona];

  return templates.map((template) => ({
    id: generateId(),
    text: template.text,
    priority: template.priority,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  }));
}

/**
 * Generate meeting dialogue based on scenario
 * @param scenario - Meeting scenario details
 * @param userMessage - User's message
 * @param conversationHistory - Previous messages
 * @returns AI response message
 */
export function generateMeetingDialogueFallback(
  scenarioType: ScenarioType,
  _participantRole: ParticipantRole,
  userMessage: string,
  conversationHistory: ConversationMessage[]
): string {
  const isFirstMessage = conversationHistory.length === 0;

  // Scenario-specific opening responses
  const openingResponses = {
    interview: `Thank you for joining us today. I've reviewed your background and I'm impressed. Let's start with: Can you tell me about a challenging project you've worked on recently and how you approached it?`,
    pitch: `Welcome! I appreciate you taking the time to present today. I've looked over your pitch deck briefly. Before we dive into the details, can you give me the 30-second elevator pitch of what you're building?`,
    review: `Thanks for meeting with me today. I wanted to discuss your recent work and performance. Overall, I've seen some strong contributions. Let's talk about your key achievements this quarter and where you see opportunities for growth.`,
    negotiation: `I appreciate you coming to the table. I think we both want to find a mutually beneficial arrangement here. Let's start by aligning on our respective priorities and constraints. What are your key objectives?`,
    presentation: `Thank you for this presentation. I'm particularly interested in understanding the strategic implications. Could you walk me through your main findings and recommendations?`,
    custom: `I'm glad we could connect today. I'm interested in hearing your perspective on this. What would you like to discuss?`,
  };

  if (isFirstMessage) {
    return openingResponses[scenarioType] || openingResponses.custom;
  }

  // Generate contextual follow-up responses
  const responses = [
    `That's an interesting point. Can you elaborate on how that would work in practice?`,
    `I see what you're saying. How does that align with your overall strategy?`,
    `Good insight. What challenges do you anticipate in implementing that approach?`,
    `I appreciate that perspective. Can you give me a concrete example?`,
    `That makes sense. What metrics would you use to measure success here?`,
    `Interesting approach. Have you considered alternative solutions?`,
    `I understand. What would be your timeline for achieving those milestones?`,
    `That's a valid point. How would you handle potential obstacles or setbacks?`,
    `I see the value in that. What resources would you need to make it happen?`,
    `Fair enough. Let's explore that further. What are the key dependencies?`,
  ];

  // Select response based on message content
  const userLower = userMessage.toLowerCase();

  if (userLower.includes('challenge') || userLower.includes('difficult')) {
    return `Challenges are opportunities for growth. How did you approach overcoming that specific challenge?`;
  }

  if (userLower.includes('timeline') || userLower.includes('when')) {
    return `Timeline is important. What factors influence your proposed schedule, and how confident are you in meeting those deadlines?`;
  }

  if (userLower.includes('cost') || userLower.includes('budget')) {
    return `Budget considerations are crucial. Can you break down the cost structure and explain the return on investment?`;
  }

  if (userLower.includes('team') || userLower.includes('people')) {
    return `Team dynamics are key. How do you plan to build and manage the team needed for this initiative?`;
  }

  // Default to random contextual response
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex] || 'That\'s an interesting perspective. Can you tell me more about that?';
}

/**
 * Generate achievement narrative
 * @param achievement - Achievement details
 * @returns Formatted narrative text
 */
export function generateAchievementNarativeFallback(
  title: string,
  description: string,
  category: string
): string {
  const narratives = {
    transmute: `Successfully transformed and elevated my code presentation skills. ${description} This achievement represents a commitment to professional excellence and attention to detail in technical communication. The ability to present code clearly and beautifully has enhanced my credibility and effectiveness in technical discussions.`,

    distillation: `Demonstrated exceptional goal-setting and execution capabilities. ${description} Through systematic breakdown and prioritization, I transformed abstract ambitions into concrete results. This achievement showcases my ability to think strategically while executing tactically, a critical skill for long-term success.`,

    projection: `Developed advanced preparation and communication skills through scenario practice. ${description} By simulating challenging conversations and high-stakes meetings, I built confidence and refined my approach. This preparation has proven invaluable in real-world situations, leading to more successful outcomes.`,

    culmination: `Reached a significant milestone in personal and professional development. ${description} This achievement represents the culmination of sustained effort, strategic planning, and continuous improvement. It demonstrates my ability to envision success and systematically work toward manifesting it.`,
  };

  const categoryNarrative = narratives[category as keyof typeof narratives] ||
    `Achieved ${title}. ${description} This accomplishment represents growth, dedication, and the successful application of focused effort toward meaningful goals.`;

  return `## ${title}\n\n${categoryNarrative}\n\n**Impact:** This achievement has contributed to both personal growth and professional advancement, creating a foundation for future success.\n\n**Key Learnings:** The journey toward this achievement reinforced the importance of consistent action, strategic planning, and maintaining a growth mindset even when facing challenges.`;
}

/**
 * Parse task list from AI response text
 * Attempts to extract structured tasks from free-form text
 */
export function parseTasksFromText(text: string): Task[] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const tasks: Task[] = [];

  for (const line of lines) {
    // Look for numbered lists, bullet points, or task-like patterns
    const taskMatch = line.match(/^[\d\-\*\.]\s*(.+)$/);
    if (taskMatch && taskMatch[1]) {
      const taskText = taskMatch[1].trim();

      // Determine priority based on keywords
      let priority: TaskPriority = 'medium';
      if (taskText.toLowerCase().includes('critical') ||
          taskText.toLowerCase().includes('urgent') ||
          taskText.toLowerCase().includes('first') ||
          taskText.toLowerCase().includes('immediately')) {
        priority = 'high';
      } else if (taskText.toLowerCase().includes('later') ||
                 taskText.toLowerCase().includes('optional') ||
                 taskText.toLowerCase().includes('nice to have')) {
        priority = 'low';
      }

      tasks.push({
        id: generateId(),
        text: taskText,
        priority,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }
  }

  // If no tasks found in expected format, treat each line as a task
  if (tasks.length === 0) {
    return lines.slice(0, 6).map((line, index) => ({
      id: generateId(),
      text: line.trim(),
      priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }));
  }

  return tasks.slice(0, 8); // Limit to 8 tasks
}
