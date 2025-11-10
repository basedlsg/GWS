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
 * Detect goal category for better task generation
 */
function categorizeGoal(goal: string): string {
  const goalLower = goal.toLowerCase();

  // Financial goals
  if (goalLower.match(/buy|purchase|save.*money|invest|afford|finance|budget|car|house|home/)) {
    return 'financial';
  }
  // Career goals
  if (goalLower.match(/job|career|promotion|raise|interview|hire|work|business|startup|company/)) {
    return 'career';
  }
  // Health goals
  if (goalLower.match(/health|fitness|weight|exercise|diet|workout|run|gym|muscle|lose.*pound/)) {
    return 'health';
  }
  // Learning goals
  if (goalLower.match(/learn|study|course|education|skill|master|practice|language|programming|code/)) {
    return 'learning';
  }
  // Relationship goals
  if (goalLower.match(/relationship|dating|marriage|friend|social|network|connect/)) {
    return 'relationship';
  }
  // Creative goals
  if (goalLower.match(/create|build|write|book|art|music|design|project|app|website/)) {
    return 'creative';
  }

  return 'general';
}

/**
 * Generate tasks from a goal using template-based approach
 * @param goal - User's goal description
 * @param persona - Coaching persona to use
 * @returns Array of generated tasks
 */
export function generateTasksFallback(goal: string, _persona: Persona = 'strategic'): Task[] {
  const category = categorizeGoal(goal);

  // Generate category-specific task templates
  const categoryTasks: Record<string, Array<{ text: string; priority: TaskPriority }>> = {
    financial: [
      { text: `[HIGH] Calculate total budget and financial requirements for "${goal}" (1-2 hours)\n   - List all upfront costs and ongoing expenses\n   - Review current income, savings, and debt\n   - Determine realistic monthly payment amount`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Research financing and payment options (2-3 hours)\n   - Compare loan rates from bank, credit union, online lenders\n   - Check eligibility requirements and credit score impact\n   - Calculate total cost with interest for each option`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Identify specific products/services to evaluate (2 hours)\n   - Make list of top 5-10 options that fit budget\n   - Read consumer reviews and ratings on trusted sites\n   - Note pros/cons and key differences for each option`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Create comparison spreadsheet (1 hour)\n   - List all options with price, features, terms\n   - Add columns for total cost, monthly payment, ratings\n   - Highlight top 3 choices based on needs`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Plan timeline and action steps (1 hour)\n   - Set target date for achieving "${goal}"\n   - List what needs to happen each week\n   - Identify any deadlines or time-sensitive steps`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Set up savings/payment tracking (30 min)\n   - Create dedicated spreadsheet or use budgeting app\n   - Set weekly savings target if applicable\n   - Schedule reminders to track progress`, priority: 'low' as TaskPriority },
    ],
    career: [
      { text: `[HIGH] Research target companies/roles for "${goal}" (2-3 hours)\n   - List 10-15 companies hiring for this role\n   - Review job descriptions and requirements\n   - Save positions on LinkedIn, Indeed, Glassdoor`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Update resume and LinkedIn profile (3-4 hours)\n   - Tailor resume to highlight relevant experience\n   - Update LinkedIn with recent accomplishments\n   - Get 2-3 people to review and give feedback`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Prepare for interviews or meetings (2 hours)\n   - Research common interview questions for this field\n   - Prepare STAR method examples of your achievements\n   - Practice answers out loud or with friend`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Expand professional network (ongoing)\n   - Connect with 5-10 people in target industry on LinkedIn\n   - Join relevant professional groups or communities\n   - Attend 1-2 networking events or webinars`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Identify skill gaps and learning needs (1-2 hours)\n   - Compare your skills to job requirements\n   - Find free courses on Coursera, Udemy, YouTube\n   - Schedule 30-60 min daily for skill development`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Set up application tracking system (30 min)\n   - Create spreadsheet with company, role, date applied\n   - Add columns for status, contacts, next steps\n   - Schedule weekly review of all applications`, priority: 'low' as TaskPriority },
    ],
    health: [
      { text: `[HIGH] Define specific, measurable targets for "${goal}" (1 hour)\n   - Set exact target (weight, distance, reps, etc.)\n   - Choose realistic timeline based on safe progress\n   - Break into monthly and weekly mini-goals`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Create detailed weekly plan (2 hours)\n   - Schedule specific workout days/times\n   - Plan meals or track calories using MyFitnessPal\n   - Prepare grocery list with healthy options`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Set up tracking and accountability (1 hour)\n   - Download fitness app (Strava, Fitbit, Apple Health)\n   - Take before photos and measurements\n   - Tell friend/family for accountability`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Research and learn best practices (2 hours)\n   - Watch YouTube videos from certified trainers\n   - Read articles on proper form and technique\n   - Join Reddit community for tips and motivation`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Prepare environment for success (1 hour)\n   - Remove junk food or buy healthy snacks\n   - Set out workout clothes night before\n   - Find workout buddy or online community`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Plan for obstacles and setbacks (30 min)\n   - Identify top 3 barriers (time, energy, motivation)\n   - Write backup plan for each scenario\n   - Schedule rest days to prevent burnout`, priority: 'low' as TaskPriority },
    ],
    learning: [
      { text: `[HIGH] Find best learning resources for "${goal}" (2-3 hours)\n   - Compare top courses on Udemy, Coursera, YouTube\n   - Read reviews and check instructor credentials\n   - Choose 1-2 primary resources to start with`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Create structured learning schedule (1 hour)\n   - Block 30-60 min daily for practice\n   - Set weekly learning goals (chapters, videos, exercises)\n   - Add study sessions to calendar with alerts`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Set up practice/project environment (1-2 hours)\n   - Install necessary software or tools\n   - Create dedicated workspace or folder\n   - Gather materials (books, notebooks, accounts)`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Build small projects to apply knowledge (ongoing)\n   - Start beginner project in week 1\n   - Increase complexity each week\n   - Share work for feedback from others`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Join community for support and questions (1 hour)\n   - Find relevant Reddit, Discord, or Facebook group\n   - Introduce yourself and learning goals\n   - Ask questions and help others when you can`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Track progress and celebrate wins (ongoing)\n   - Keep journal of what you learned each session\n   - Test yourself weekly on key concepts\n   - Reward yourself at milestones`, priority: 'low' as TaskPriority },
    ],
    relationship: [
      { text: `[HIGH] Clarify what you want in "${goal}" (1-2 hours)\n   - Write specific qualities you're looking for\n   - Identify your own values and dealbreakers\n   - Reflect on past experiences and lessons learned`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Put yourself in situations to meet people (ongoing)\n   - Join 2-3 groups/clubs related to your interests\n   - Attend social events or activities weekly\n   - Try apps or platforms relevant to your goal`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Work on personal growth and confidence (ongoing)\n   - Practice conversation skills with strangers\n   - Work on appearance, posture, communication\n   - Address insecurities through therapy or self-help`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Expand social circle and network (ongoing)\n   - Reconnect with old friends or acquaintances\n   - Say yes to invitations and introduce yourself\n   - Host small gatherings or invite people out`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Learn from others' experiences (1-2 hours)\n   - Read books or articles on healthy relationships\n   - Listen to podcasts or watch videos\n   - Ask trusted friends for advice`, priority: 'low' as TaskPriority },
      { text: `[LOW] Stay patient and positive (ongoing)\n   - Remember quality over quantity\n   - Don't take rejection personally\n   - Celebrate small wins and connections`, priority: 'low' as TaskPriority },
    ],
    creative: [
      { text: `[HIGH] Define scope and vision for "${goal}" (2 hours)\n   - Describe the finished product in detail\n   - Sketch mockups, outlines, or storyboards\n   - Identify similar works for inspiration`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Break project into manageable phases (1-2 hours)\n   - List all major components or chapters\n   - Estimate time needed for each part\n   - Create week-by-week production timeline`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Set up tools and workspace (1-2 hours)\n   - Install/purchase necessary software or materials\n   - Organize dedicated workspace\n   - Test equipment and learn basic functions`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Block regular creation time (ongoing)\n   - Schedule 1-3 hour blocks for deep work\n   - Protect this time from distractions\n   - Show up consistently even when unmotivated`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Study craft and learn techniques (2-3 hours/week)\n   - Watch tutorials or take course\n   - Study work of masters in your field\n   - Practice specific skills separately`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Share work and get feedback (ongoing)\n   - Post drafts to relevant communities\n   - Ask trusted friends for honest critique\n   - Iterate based on feedback received`, priority: 'low' as TaskPriority },
    ],
    general: [
      { text: `[HIGH] Define clear success criteria for "${goal}" (1-2 hours)\n   - Write down what success looks like specifically\n   - Set measurable milestones\n   - Determine realistic timeline`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Research how others achieved similar goals (2-3 hours)\n   - Search online for success stories and case studies\n   - Learn common strategies and approaches\n   - Note what worked and what didn't`, priority: 'high' as TaskPriority },
      { text: `[HIGH] Create action plan with specific steps (1-2 hours)\n   - List all tasks needed to achieve goal\n   - Order tasks by priority and dependencies\n   - Assign deadlines to each task`, priority: 'high' as TaskPriority },
      { text: `[MEDIUM] Gather necessary resources and tools (1-2 hours)\n   - List what you need (info, tools, help)\n   - Acquire or purchase top priorities\n   - Set up systems for tracking progress`, priority: 'medium' as TaskPriority },
      { text: `[MEDIUM] Build support system and accountability (1 hour)\n   - Tell friends/family about your goal\n   - Find accountability partner or group\n   - Schedule regular check-ins on progress`, priority: 'medium' as TaskPriority },
      { text: `[LOW] Anticipate obstacles and plan solutions (1 hour)\n   - List potential challenges\n   - Create backup plans for each\n   - Schedule weekly reviews to adjust course`, priority: 'low' as TaskPriority },
    ],
  };

  const templates = categoryTasks[category] ?? categoryTasks.general;
  if (!templates) {
    return [];
  }

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
  const contentWords = words
    .map(word => word.replace(/[^a-zA-Z0-9]/g, '')) // Remove punctuation
    .filter(word => {
      const w = word.toLowerCase();
      return w.length > 3 && ![
        'that', 'this', 'with', 'have', 'from', 'they', 'been', 'were', 'what',
        'when', 'where', 'which', 'would', 'could', 'should', 'about', 'their',
        'your', 'just', 'like', 'some', 'make', 'will', 'more', 'very', 'want'
      ].includes(w);
    });

  console.log('  - contentWords extracted:', contentWords);

  // Build context-aware response that references the user's actual words
  const firstContentWord = contentWords[0]?.toLowerCase() || 'your point';
  const secondContentWord = contentWords[1]?.toLowerCase() || 'that topic';

  console.log('  - firstContentWord:', firstContentWord);
  console.log('  - secondContentWord:', secondContentWord);

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
    return `That experience sounds valuable. Can you tell me about a specific challenge you faced and how you overcame it?`;
  }

  if (userLower.includes('question') || userLower.includes('ask')) {
    return `Good question. Let me think about that... I believe the key consideration is understanding the full context. What's your take on that?`;
  }

  if (userLower.includes('thank') || userLower.includes('appreciate')) {
    return `You're welcome. Shifting gears, what else would you like to discuss?`;
  }

  if (userLower.includes('challenge') || userLower.includes('difficult')) {
    return `Challenges are inevitable. When you faced this difficulty, what specific actions did you take, and what was the result?`;
  }

  if (userLower.includes('success') || userLower.includes('achieve')) {
    return `Success is important. What metrics did you use to measure impact?`;
  }

  // Scenario-specific contextual responses
  const scenarioResponses: Record<ScenarioType, string[]> = {
    interview: [
      `I appreciate you sharing that. Can you walk me through a specific example of how you've applied this in a real project?`,
      `That's interesting. What specific results or outcomes did you achieve?`,
      `Good point. How would you handle a situation where things didn't work as planned?`,
      `I see you have relevant experience. How does that prepare you for the challenges you'd face in this role?`,
      `Thanks for that context. Can you tell me more about your thought process when dealing with complex problems?`,
    ],
    pitch: [
      `I like what you're saying. Who specifically is your target customer, and why would they choose you over existing solutions?`,
      `That's compelling. What's your go-to-market strategy and timeline?`,
      `Interesting approach. What are the unit economics, and when do you project profitability?`,
      `I see the vision. What's the biggest risk to execution, and how are you mitigating it?`,
      `Good traction so far. What are your fundraising needs and how will you deploy the capital?`,
    ],
    review: [
      `Thanks for bringing that up. I'd like to understand the impact this had on our key metrics. Can you quantify that?`,
      `I appreciate your work. Looking ahead, how do you plan to build on this momentum next quarter?`,
      `That's a fair point. What support or resources would help you improve in this area?`,
      `I hear what you're saying. How do you think you could have approached it differently?`,
      `Good reflection. What are your career development goals for the next 6-12 months?`,
    ],
    negotiation: [
      `I understand your position. From our side, we need to balance competing priorities. What's your flexibility here?`,
      `That's a reasonable ask. If we can accommodate that, would you be willing to make some concessions as well?`,
      `I hear you. Let's explore some creative options that could work for both sides.`,
      `Fair point. What's your ideal outcome, and what's your walk-away point?`,
      `I appreciate the transparency. What timeline are you working with for reaching an agreement?`,
    ],
    presentation: [
      `Thank you for that analysis. What data supports this conclusion, and how confident are you in these projections?`,
      `Interesting findings. How do you recommend we prioritize this against other initiatives?`,
      `I see your point. What are the implementation challenges and resource requirements?`,
      `That's a strong recommendation. What are the risks if we don't act on this?`,
      `Good presentation. Can you clarify how this aligns with our strategic objectives?`,
    ],
    custom: [
      `I appreciate you sharing your thoughts. Can you elaborate on what you're thinking?`,
      `That's an interesting perspective. What specific outcomes are you hoping for?`,
      `Good point. How have you seen this work in practice, and what challenges did you encounter?`,
      `I understand what you're saying. What led you to this conclusion?`,
      `Thanks for that insight. What would success look like to you?`,
    ],
  };

  // Use scenario-specific responses
  const responses = scenarioResponses[scenarioType] || scenarioResponses.custom;
  const randomIndex = Math.floor(Math.random() * responses.length);
  const response = responses[randomIndex] || `That's interesting. Can you tell me more about that?`;

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
