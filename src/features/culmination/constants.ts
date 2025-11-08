/**
 * Culmination Feature Constants
 * Templates, defaults, and configuration for achievement visualization
 */

import type {
  AchievementCategory,
  AchievementStatus,
  AchievementTemplate,
  PortfolioTheme,
  PortfolioLayout,
} from './types';

/**
 * Achievement category metadata
 */
export const CATEGORY_INFO: Record<
  AchievementCategory,
  { label: string; icon: string; color: string; description: string }
> = {
  career: {
    label: 'Career',
    icon: '💼',
    color: 'hsl(var(--chart-1))',
    description: 'Professional growth and career milestones',
  },
  business: {
    label: 'Business',
    icon: '🚀',
    color: 'hsl(var(--chart-2))',
    description: 'Entrepreneurial ventures and business achievements',
  },
  creative: {
    label: 'Creative',
    icon: '🎨',
    color: 'hsl(var(--chart-3))',
    description: 'Artistic projects and creative accomplishments',
  },
  personal: {
    label: 'Personal',
    icon: '⭐',
    color: 'hsl(var(--chart-4))',
    description: 'Personal development and life goals',
  },
  health: {
    label: 'Health',
    icon: '💪',
    color: 'hsl(var(--chart-5))',
    description: 'Physical and mental wellness achievements',
  },
  financial: {
    label: 'Financial',
    icon: '💰',
    color: 'hsl(220 70% 50%)',
    description: 'Financial goals and wealth building',
  },
  social: {
    label: 'Social',
    icon: '🤝',
    color: 'hsl(280 70% 50%)',
    description: 'Relationships and community impact',
  },
  education: {
    label: 'Education',
    icon: '📚',
    color: 'hsl(160 70% 50%)',
    description: 'Learning milestones and educational achievements',
  },
};

/**
 * Achievement status metadata
 */
export const STATUS_INFO: Record<
  AchievementStatus,
  { label: string; icon: string; color: string }
> = {
  envisioned: {
    label: 'Envisioned',
    icon: '💭',
    color: 'text-muted-foreground',
  },
  in_progress: {
    label: 'In Progress',
    icon: '🔄',
    color: 'text-blue-500',
  },
  achieved: {
    label: 'Achieved',
    icon: '✅',
    color: 'text-green-500',
  },
};

/**
 * Portfolio theme configurations
 */
export const THEME_CONFIG: Record<
  PortfolioTheme,
  { label: string; description: string; className: string }
> = {
  professional: {
    label: 'Professional',
    description: 'Clean and corporate aesthetic',
    className: 'theme-professional',
  },
  creative: {
    label: 'Creative',
    description: 'Vibrant and expressive design',
    className: 'theme-creative',
  },
  minimal: {
    label: 'Minimal',
    description: 'Simple and elegant layout',
    className: 'theme-minimal',
  },
  bold: {
    label: 'Bold',
    description: 'High-impact visual presentation',
    className: 'theme-bold',
  },
};

/**
 * Portfolio layout configurations
 */
export const LAYOUT_CONFIG: Record<
  PortfolioLayout,
  { label: string; description: string; icon: string }
> = {
  grid: {
    label: 'Grid',
    description: 'Organized in uniform grid',
    icon: '▦',
  },
  timeline: {
    label: 'Timeline',
    description: 'Chronological timeline view',
    icon: '━',
  },
  masonry: {
    label: 'Masonry',
    description: 'Dynamic Pinterest-style layout',
    icon: '▦',
  },
  cards: {
    label: 'Cards',
    description: 'Individual card presentation',
    icon: '▢',
  },
};

/**
 * Achievement templates for quick creation
 */
export const ACHIEVEMENT_TEMPLATES: AchievementTemplate[] = [
  {
    id: 'career-promotion',
    title: 'Promoted to [Position]',
    description: 'Earned promotion to leadership role through exceptional performance and dedication',
    category: 'career',
    exampleMetrics: [
      { label: 'Team Size', value: '10 people', icon: '👥' },
      { label: 'Revenue Impact', value: '$1M+', icon: '💵' },
    ],
    suggestedTags: ['leadership', 'promotion', 'management'],
  },
  {
    id: 'business-launch',
    title: 'Launched [Business Name]',
    description: 'Successfully launched and grew a sustainable business venture',
    category: 'business',
    exampleMetrics: [
      { label: 'Customers', value: '1,000+', icon: '👥' },
      { label: 'Revenue', value: '$100K ARR', icon: '💰' },
      { label: 'Growth', value: '+50% MoM', icon: '📈' },
    ],
    suggestedTags: ['startup', 'entrepreneurship', 'business'],
  },
  {
    id: 'creative-project',
    title: 'Completed [Creative Project]',
    description: 'Finished major creative work and shared it with the world',
    category: 'creative',
    exampleMetrics: [
      { label: 'Audience', value: '10K+ views', icon: '👁️' },
      { label: 'Recognition', value: 'Featured', icon: '⭐' },
    ],
    suggestedTags: ['creative', 'art', 'project'],
  },
  {
    id: 'health-transformation',
    title: 'Achieved Health Goal',
    description: 'Transformed physical and mental health through consistent effort',
    category: 'health',
    exampleMetrics: [
      { label: 'Weight', value: '-30 lbs', icon: '⚖️' },
      { label: 'Consistency', value: '6 months', icon: '📅' },
    ],
    suggestedTags: ['fitness', 'health', 'transformation'],
  },
  {
    id: 'financial-milestone',
    title: 'Reached Financial Milestone',
    description: 'Achieved significant financial goal through disciplined saving and investing',
    category: 'financial',
    exampleMetrics: [
      { label: 'Net Worth', value: '$100K', icon: '💎' },
      { label: 'Passive Income', value: '$1K/mo', icon: '💵' },
    ],
    suggestedTags: ['finance', 'investing', 'wealth'],
  },
  {
    id: 'education-degree',
    title: 'Earned [Degree/Certification]',
    description: 'Completed advanced education program with distinction',
    category: 'education',
    exampleMetrics: [
      { label: 'GPA', value: '3.8/4.0', icon: '📊' },
      { label: 'Duration', value: '2 years', icon: '⏱️' },
    ],
    suggestedTags: ['education', 'learning', 'certification'],
  },
  {
    id: 'social-impact',
    title: 'Made Community Impact',
    description: 'Created meaningful positive change in the community',
    category: 'social',
    exampleMetrics: [
      { label: 'People Helped', value: '500+', icon: '❤️' },
      { label: 'Hours', value: '100+', icon: '⏰' },
    ],
    suggestedTags: ['community', 'impact', 'volunteering'],
  },
  {
    id: 'personal-growth',
    title: 'Personal Transformation',
    description: 'Achieved significant personal growth and self-improvement',
    category: 'personal',
    exampleMetrics: [
      { label: 'Skills Learned', value: '5+', icon: '🎯' },
      { label: 'Books Read', value: '50+', icon: '📚' },
    ],
    suggestedTags: ['personal-growth', 'self-improvement', 'habits'],
  },
];

/**
 * Default achievement for new entries
 */
export const DEFAULT_ACHIEVEMENT = {
  title: '',
  description: '',
  category: 'personal' as AchievementCategory,
  status: 'envisioned' as AchievementStatus,
  tags: [],
  metrics: [],
};

/**
 * Default portfolio settings
 */
export const DEFAULT_PORTFOLIO = {
  title: 'My Achievement Portfolio',
  description: 'A collection of my envisioned and accomplished goals',
  theme: 'professional' as PortfolioTheme,
  layout: 'grid' as PortfolioLayout,
  isPublic: false,
};

/**
 * Maximum stored portfolios
 */
export const MAX_PORTFOLIOS = 20;

/**
 * Maximum achievements per portfolio
 */
export const MAX_ACHIEVEMENTS_PER_PORTFOLIO = 100;

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  PORTFOLIOS: 'gws:culmination:portfolios',
  ACTIVE_PORTFOLIO: 'gws:culmination:active',
  DRAFT_ACHIEVEMENT: 'gws:culmination:draft',
};

/**
 * Example portfolio narrative prompts
 */
export const NARRATIVE_PROMPTS = [
  'What challenges did you overcome to achieve this?',
  'How did this achievement change your life?',
  'What skills did you develop along the way?',
  'Who helped you reach this milestone?',
  'What advice would you give to someone pursuing this goal?',
  'How does this achievement align with your long-term vision?',
  'What surprised you most about this journey?',
  'What would you do differently if starting over?',
];

/**
 * Portfolio export templates
 */
export const EXPORT_TEMPLATES = {
  html: {
    title: 'HTML Portfolio',
    description: 'Shareable web page',
    extension: '.html',
  },
  markdown: {
    title: 'Markdown',
    description: 'Plain text with formatting',
    extension: '.md',
  },
  json: {
    title: 'JSON',
    description: 'Structured data backup',
    extension: '.json',
  },
  pdf: {
    title: 'PDF',
    description: 'Professional document',
    extension: '.pdf',
  },
};
