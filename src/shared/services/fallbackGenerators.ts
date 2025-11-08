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
      { text: `[HIGH] Define clear success metrics for ${mainKeyword} (1-2 hours)\n   - Write down 3-5 specific, measurable outcomes\n   - Set target numbers or milestones for each metric\n   - Document baseline/starting point`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Research best practices for ${goal} (2-3 hours)\n   - Search Google Scholar and industry publications\n   - Find 5-10 case studies of similar goals\n   - Bookmark resources at reddit.com/r/productivity`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Create roadmap with weekly milestones (1-2 hours)\n   - Break goal into 4-6 major phases\n   - Assign 1-3 week timeframes to each phase\n   - Use Notion, Trello, or Asana to visualize`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Identify risks and mitigation strategies (1 hour)\n   - List 3-5 potential obstacles\n   - Write backup plan for each obstacle\n   - Schedule weekly risk assessment check-ins`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Establish KPIs and tracking system (1 hour)\n   - Choose 3-5 key performance indicators\n   - Set up spreadsheet or app for tracking\n   - Schedule daily/weekly measurement times`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Schedule progress review calendar (30 min)\n   - Block weekly 15-min review sessions\n   - Set monthly deep-dive analysis time\n   - Create review template/questions`, priority: 'low' as TaskPriority },
    ],
    tactical: [
      { text: `[HIGH] Break ${goal} into this week's actions (1 hour)\n   - List 5-10 specific actions for next 7 days\n   - Assign each action to a specific day\n   - Estimate time needed for each action`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Set up daily tracking system (30 min)\n   - Download habit tracker app (Habitica, Streaks, Way of Life)\n   - Create daily checklist in phone or notebook\n   - Set phone reminders for key tasks`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Block calendar time for ${mainKeyword} work (30 min)\n   - Find 2-3 consistent time slots per week\n   - Block time in Google Calendar or phone\n   - Set recurring calendar alerts`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Create immediate action checklist (45 min)\n   - List all tasks needed to start today\n   - Order by what must happen first\n   - Identify the single most important next step`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] List required tools and resources (30 min)\n   - Write down apps, books, courses needed\n   - Research free vs paid options\n   - Purchase or download top 2-3 essentials`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Find accountability partner or system (1 hour)\n   - Post in relevant Reddit community or Facebook group\n   - Ask friend or colleague to check in weekly\n   - Join online accountability group (Focusmate, coach.me)`, priority: 'low' as TaskPriority },
    ],
    creative: [
      { text: `[HIGH] Brainstorm 20+ approaches to ${mainKeyword} (1 hour)\n   - Set 20-minute timer for rapid ideation\n   - Use mind mapping (Miro, Coggle, or paper)\n   - Don't filter - capture all ideas`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Research unconventional methods (2 hours)\n   - Search "[your goal] unconventional methods"\n   - Watch 3-5 TED talks or YouTube videos\n   - Browse r/UnconventionalLifeProTips`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Create vision board for ${goal} (1-2 hours)\n   - Collect 15-20 inspiring images\n   - Use Canva, Pinterest, or physical poster\n   - Place somewhere you'll see daily`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Find 5-10 inspiring examples (1-2 hours)\n   - Search success stories on Medium or blogs\n   - Join relevant Facebook or LinkedIn groups\n   - Save case studies to Evernote or Notion`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Run 3 small experiments this week (ongoing)\n   - Try different techniques for 2-3 days each\n   - Document what works and what doesn't\n   - Iterate based on results`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Start insights journal (15 min/day)\n   - Create document or notebook\n   - Write daily reflections and discoveries\n   - Review weekly for patterns`, priority: 'low' as TaskPriority },
    ],
    philosophical: [
      { text: `[HIGH] Reflect deeply on why ${goal} matters (1 hour)\n   - Write 500 words on personal significance\n   - Ask "why" 5 times to find root motivation\n   - Identify connection to core values`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Identify values driving this goal (1 hour)\n   - List 5-10 personal values\n   - Rank which values this goal serves\n   - Write how goal expresses each value`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Examine alignment with life purpose (1-2 hours)\n   - Write personal mission statement\n   - Map how ${mainKeyword} fits larger vision\n   - Identify any misalignments to address`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Analyze obstacles from multiple perspectives (1 hour)\n   - Write obstacles from 3 viewpoints\n   - Consider worst/best/most likely scenarios\n   - Find lessons in each potential challenge`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Create decision-making framework (1 hour)\n   - Define 3-5 guiding principles\n   - Write criteria for tough choices\n   - Test framework on a sample decision`, priority: 'low' as TaskPriority },
      { text: `[LOW] Begin meaning journal (15 min/day)\n   - Write about journey significance\n   - Record insights and growth\n   - Review monthly for deeper patterns`, priority: 'low' as TaskPriority },
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
 * @param scenarioType - Type of meeting scenario
 * @param participantRole - Role of the AI participant
 * @param userMessage - User's message
 * @param conversationHistory - Previous messages
 * @returns AI response message
 */
export function generateMeetingDialogueFallback(
  scenarioType: ScenarioType,
  participantRole: ParticipantRole,
  userMessage: string,
  _conversationHistory: ConversationMessage[]
): string {
  console.log('🗣️ [generateMeetingDialogueFallback] Called with:');
  console.log('  - scenarioType:', scenarioType);
  console.log('  - participantRole:', participantRole);
  console.log('  - userMessage:', userMessage);

  const userLower = userMessage.toLowerCase();
  const words = userMessage.split(/\s+/);

  // Extract key content words from the user's message (not common words)
  const contentWords = words.filter(word => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    return w.length > 3 && ![
      'that', 'this', 'with', 'have', 'from', 'they', 'been', 'were', 'what',
      'when', 'where', 'which', 'would', 'could', 'should', 'about', 'their'
    ].includes(w);
  });

  console.log('  - contentWords extracted:', contentWords);

  // Build context-aware response that references the user's actual words
  const firstContentWord = contentWords[0] || 'that';
  const secondContentWord = contentWords[1] || 'point';

  console.log('  - firstContentWord:', firstContentWord);
  console.log('  - secondContentWord:', secondContentWord);

  // Scenario-specific contextual responses
  const scenarioResponses = {
    interview: [
      `I appreciate you sharing that about ${firstContentWord}. Can you walk me through a specific example of how you've applied this in a real project?`,
      `That's interesting. When you mention ${firstContentWord}, what specific results or outcomes did you achieve?`,
      `Good point about ${secondContentWord}. How would you handle a situation where ${firstContentWord} didn't work as planned?`,
      `I see you have experience with ${firstContentWord}. How does that prepare you for the challenges you'd face in this role?`,
      `Thanks for that context. Can you tell me more about your thought process when dealing with ${firstContentWord}?`,
    ],
    pitch: [
      `I like what you're saying about ${firstContentWord}. Who specifically is your target customer, and why would they choose you over existing solutions?`,
      `That's compelling. When you mention ${firstContentWord}, what's your go-to-market strategy and timeline?`,
      `Interesting approach with ${secondContentWord}. What are the unit economics, and when do you project profitability?`,
      `I see the vision around ${firstContentWord}. What's the biggest risk to execution, and how are you mitigating it?`,
      `Good traction with ${firstContentWord}. What are your fundraising needs and how will you deploy the capital?`,
    ],
    review: [
      `Thanks for bringing up ${firstContentWord}. I'd like to understand the impact this had on our key metrics. Can you quantify that?`,
      `I appreciate your work on ${firstContentWord}. Looking ahead, how do you plan to build on this momentum next quarter?`,
      `That's a fair point about ${secondContentWord}. What support or resources would help you improve in this area?`,
      `I hear what you're saying regarding ${firstContentWord}. How do you think you could have approached it differently?`,
      `Good reflection on ${firstContentWord}. What are your career development goals for the next 6-12 months?`,
    ],
    negotiation: [
      `I understand your position on ${firstContentWord}. From our side, we need to balance that against ${secondContentWord}. What's your flexibility here?`,
      `That's a reasonable ask regarding ${firstContentWord}. If we can accommodate that, would you be willing to move on ${secondContentWord}?`,
      `I hear you on ${firstContentWord}. Let's explore some creative options that could work for both sides.`,
      `Fair point about ${secondContentWord}. What's your ideal outcome, and what's your walk-away point?`,
      `I appreciate the transparency on ${firstContentWord}. What timeline are you working with for reaching an agreement?`,
    ],
    presentation: [
      `Thank you for that analysis of ${firstContentWord}. What data supports this conclusion, and how confident are you in these projections?`,
      `Interesting findings on ${firstContentWord}. How do you recommend we prioritize this against ${secondContentWord}?`,
      `I see your point about ${secondContentWord}. What are the implementation challenges and resource requirements?`,
      `That's a strong recommendation regarding ${firstContentWord}. What are the risks if we don't act on this?`,
      `Good presentation. Can you clarify how ${firstContentWord} aligns with our strategic objectives?`,
    ],
    custom: [
      `I appreciate you sharing your thoughts on ${firstContentWord}. Can you elaborate on how this connects to ${secondContentWord}?`,
      `That's an interesting perspective. When you think about ${firstContentWord}, what specific outcomes are you hoping for?`,
      `Good point. How have you seen ${firstContentWord} work in practice, and what challenges did you encounter?`,
      `I understand what you're saying about ${secondContentWord}. What led you to this conclusion?`,
      `Thanks for that insight on ${firstContentWord}. What would success look like to you?`,
    ],
  };

  // Content-aware keyword responses (check these first for better relevance)
  if (userLower.includes('hello') || userLower.includes('hi ') || userLower.includes('hey')) {
    const roleGreetings: Record<ParticipantRole, string> = {
      interviewer: `Hi, thanks for coming in today. I'd like to start by having you tell me a bit about yourself and why you're interested in this role.`,
      investor: `Good to meet you! I've looked over your materials briefly. Why don't you start with your elevator pitch?`,
      manager: `Hey, thanks for making time. I wanted to touch base about your recent work and discuss where you're headed.`,
      client: `Hello! I'm looking forward to learning more about what you're proposing. What brings you here today?`,
      colleague: `Hi there! Great to connect. What would you like to discuss?`,
      custom: `Hello! I'm glad we could connect today. What would you like to discuss?`,
    };
    return roleGreetings[participantRole];
  }

  if (userLower.includes('experience') || userLower.includes('background')) {
    return `That experience sounds valuable. Can you tell me about a specific challenge you faced in ${firstContentWord} and how you overcame it?`;
  }

  if (userLower.includes('question') || userLower.includes('ask')) {
    return `Good question. Regarding ${firstContentWord}, I think the key consideration is ${secondContentWord}. What's your take on that?`;
  }

  if (userLower.includes('thank') || userLower.includes('appreciate')) {
    return `You're welcome. Shifting gears, I'd like to hear more about ${firstContentWord}. Can you walk me through your thinking there?`;
  }

  if (userLower.includes('challenge') || userLower.includes('difficult')) {
    return `Challenges are inevitable. When you faced this difficulty with ${firstContentWord}, what specific actions did you take, and what was the result?`;
  }

  if (userLower.includes('success') || userLower.includes('achieve')) {
    return `Success is important. When you achieved results with ${firstContentWord}, what metrics did you use to measure impact?`;
  }

  // Use scenario-specific responses that reference the user's words
  const responses = scenarioResponses[scenarioType] || scenarioResponses.custom;
  const randomIndex = Math.floor(Math.random() * responses.length);
  const response = responses[randomIndex] || `That's interesting what you said about ${firstContentWord}. Can you tell me more about that?`;

  console.log('  - Generated response:', response);

  return response;
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
  console.log('📝 [parseTasksFromText] Called with text:', text);

  const lines = text.split('\n');
  console.log('📝 [parseTasksFromText] Total lines (including empty):', lines.length);

  const tasks: Task[] = [];
  let currentTask: string | null = null;
  let currentSubSteps: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) continue; // Skip undefined lines

    // Check if this is a main task (starts with number or bullet, not indented)
    const mainTaskMatch = line.match(/^(\d+[\.\)]|\-|\*)\s+(.+)$/);

    if (mainTaskMatch && mainTaskMatch[2]) {
      // Save previous task if exists
      if (currentTask) {
        const fullTaskText = currentSubSteps.length > 0
          ? `${currentTask}\n${currentSubSteps.join('\n')}`
          : currentTask;

        console.log(`📝 [parseTasksFromText] Saving task: "${fullTaskText.substring(0, 100)}..."`);

        // Determine priority based on keywords
        let priority: TaskPriority = 'medium';
        const lowerText = fullTaskText.toLowerCase();
        if (lowerText.includes('[high') || lowerText.includes('critical') ||
            lowerText.includes('urgent') || lowerText.includes('first') ||
            lowerText.includes('immediately')) {
          priority = 'high';
        } else if (lowerText.includes('[low') || lowerText.includes('later') ||
                   lowerText.includes('optional') || lowerText.includes('nice to have')) {
          priority = 'low';
        } else if (lowerText.includes('[med')) {
          priority = 'medium';
        }

        tasks.push({
          id: generateId(),
          text: fullTaskText,
          priority,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }

      // Start new task
      currentTask = mainTaskMatch[2].trim();
      currentSubSteps = [];
      console.log(`📝 [parseTasksFromText] Started new task: "${currentTask}"`);

    } else if (line.trim().length > 0 && currentTask) {
      // This is a sub-step or continuation of current task (indented or starts with -)
      const indentedMatch = line.match(/^\s+(.+)$/);
      if (indentedMatch) {
        currentSubSteps.push(line); // Keep the indentation for formatting
        console.log(`📝 [parseTasksFromText] Added sub-step: "${line.trim()}"`);
      }
    }
  }

  // Save the last task
  if (currentTask) {
    const fullTaskText = currentSubSteps.length > 0
      ? `${currentTask}\n${currentSubSteps.join('\n')}`
      : currentTask;

    console.log(`📝 [parseTasksFromText] Saving final task: "${fullTaskText.substring(0, 100)}..."`);

    let priority: TaskPriority = 'medium';
    const lowerText = fullTaskText.toLowerCase();
    if (lowerText.includes('[high') || lowerText.includes('critical') ||
        lowerText.includes('urgent') || lowerText.includes('first')) {
      priority = 'high';
    } else if (lowerText.includes('[low') || lowerText.includes('later') ||
               lowerText.includes('optional')) {
      priority = 'low';
    }

    tasks.push({
      id: generateId(),
      text: fullTaskText,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
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
