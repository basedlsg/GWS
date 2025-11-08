/**
 * Distillation Feature Type Definitions
 * Defines types for goals, tasks, and distillation sessions
 */

import type { Task, TaskPriority, TaskStatus, Persona } from '@/shared/types/api';

/**
 * A distillation session containing a goal and its generated tasks
 */
export interface DistillationSession {
  id: string;
  goal: string;
  persona: Persona;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  completedTaskCount: number;
  totalTaskCount: number;
  usedAI: boolean;
}

/**
 * Filter options for task list
 */
export type TaskFilter = 'all' | 'active' | 'completed';

/**
 * Sort options for task list
 */
export type TaskSort = 'priority' | 'created' | 'status';

/**
 * Export format for tasks
 */
export type TaskExportFormat = 'markdown' | 'json' | 'text' | 'csv';

/**
 * Task statistics
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  completionRate: number;
}

// Re-export API types for convenience
export type { Task, TaskPriority, TaskStatus, Persona };
