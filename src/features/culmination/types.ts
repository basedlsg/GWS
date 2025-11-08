/**
 * Culmination Feature Types
 * Types for achievement visualization and portfolio creation
 */

/**
 * Achievement categories for organizing accomplishments
 */
export type AchievementCategory =
  | 'career'
  | 'business'
  | 'creative'
  | 'personal'
  | 'health'
  | 'financial'
  | 'social'
  | 'education';

/**
 * Achievement status for timeline visualization
 */
export type AchievementStatus = 'envisioned' | 'in_progress' | 'achieved';

/**
 * Individual achievement entry
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  status: AchievementStatus;
  targetDate: string; // ISO date string
  completionDate?: string; // ISO date string
  imageUrl?: string; // Optional achievement image
  tags: string[];
  metrics?: AchievementMetric[]; // Quantifiable measures
  narrative?: string; // Detailed success story
  createdAt: string;
  updatedAt: string;
}

/**
 * Quantifiable metrics for achievements
 */
export interface AchievementMetric {
  label: string;
  value: string;
  icon?: string;
}

/**
 * Portfolio - Collection of achievements
 */
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  achievements: Achievement[];
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

/**
 * Portfolio visual themes
 */
export type PortfolioTheme = 'professional' | 'creative' | 'minimal' | 'bold';

/**
 * Portfolio layout options
 */
export type PortfolioLayout = 'grid' | 'timeline' | 'masonry' | 'cards';

/**
 * Timeline grouping options
 */
export type TimelineGrouping = 'year' | 'month' | 'category' | 'status';

/**
 * Export formats for portfolios
 */
export type PortfolioExportFormat = 'html' | 'markdown' | 'json' | 'pdf';

/**
 * Filter options for achievement display
 */
export interface AchievementFilter {
  categories: AchievementCategory[];
  statuses: AchievementStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

/**
 * Portfolio statistics
 */
export interface PortfolioStats {
  totalAchievements: number;
  envisionedCount: number;
  inProgressCount: number;
  achievedCount: number;
  categoryCounts: Record<AchievementCategory, number>;
  completionRate: number;
}

/**
 * Achievement template for quick creation
 */
export interface AchievementTemplate {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  exampleMetrics: AchievementMetric[];
  suggestedTags: string[];
}
