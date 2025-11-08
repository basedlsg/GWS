/**
 * Task Statistics Utilities
 * Calculate statistics for tasks and sessions
 */

import type { Task, TaskStats } from '../types';

/**
 * Calculate task statistics
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;

  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  return {
    total,
    completed,
    pending,
    inProgress,
    highPriority,
    mediumPriority,
    lowPriority,
    completionRate,
  };
}

/**
 * Sort tasks by priority
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Sort tasks by creation date
 */
export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Sort tasks by status
 */
export function sortTasksByStatus(tasks: Task[]): Task[] {
  const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
  return [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}

/**
 * Filter tasks by status
 */
export function filterTasksByStatus(tasks: Task[], filter: 'all' | 'active' | 'completed'): Task[] {
  if (filter === 'all') return tasks;
  if (filter === 'completed') return tasks.filter((t) => t.status === 'completed');
  return tasks.filter((t) => t.status !== 'completed'); // active = pending + in-progress
}
