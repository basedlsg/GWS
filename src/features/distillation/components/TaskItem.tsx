/**
 * TaskItem Component
 * Individual task with status controls
 */

import { CheckCircle2, Circle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { PRIORITY_COLORS, STATUS_LABELS } from '../constants';
import type { Task, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const handleToggleComplete = () => {
    if (task.status === 'completed') {
      onStatusChange(task.id, 'pending');
    } else {
      onStatusChange(task.id, 'completed');
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    onStatusChange(task.id, status);
  };

  const StatusIcon = task.status === 'completed' ? CheckCircle2 : task.status === 'in_progress' ? Loader2 : Circle;

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${
        isCompleted
          ? 'bg-muted/50 border-muted'
          : isInProgress
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
          : 'bg-card hover:bg-accent/50'
      }`}
    >
      {/* Status Toggle Button */}
      <button
        onClick={handleToggleComplete}
        className={`mt-0.5 flex-shrink-0 transition-colors ${
          isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <StatusIcon className={`h-5 w-5 ${isInProgress ? 'animate-spin' : ''}`} />
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm whitespace-pre-wrap ${
            isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {task.text}
        </p>

        {/* Task Meta */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority.toUpperCase()}
          </Badge>

          {task.status === 'in_progress' && (
            <Badge variant="secondary" className="text-xs">
              {STATUS_LABELS[task.status]}
            </Badge>
          )}

          {task.completedAt && (
            <span className="text-xs text-muted-foreground">
              ✓ {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="text-xs">⋮</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
              <Circle className="mr-2 h-4 w-4" />
              Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
              <Loader2 className="mr-2 h-4 w-4" />
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
