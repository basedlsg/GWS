/**
 * TaskList Component
 * Display and manage a list of tasks with filtering and sorting
 */

import { useState } from 'react';
import { Filter, SortAsc, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { TaskItem } from './TaskItem';
import { TaskStats as TaskStatsComponent } from './TaskStats';
import {
  filterTasksByStatus,
  sortTasksByPriority,
  sortTasksByDate,
  sortTasksByStatus,
  calculateTaskStats,
} from '../utils/stats';
import {
  exportTasksAsMarkdown,
  exportTasksAsJSON,
  exportTasksAsText,
  exportTasksAsCSV,
  downloadFile,
  copyToClipboard,
} from '../utils/export';
import { useToast } from '@/shared/hooks/use-toast';
import type { TaskFilter, TaskSort, DistillationSession } from '../types';

interface TaskListProps {
  session: DistillationSession;
  onTaskStatusChange: (taskId: string, status: any) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskList({ session, onTaskStatusChange, onTaskDelete }: TaskListProps) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('priority');

  // Apply filtering and sorting
  let displayedTasks = filterTasksByStatus(session.tasks, filter);

  switch (sort) {
    case 'priority':
      displayedTasks = sortTasksByPriority(displayedTasks);
      break;
    case 'created':
      displayedTasks = sortTasksByDate(displayedTasks);
      break;
    case 'status':
      displayedTasks = sortTasksByStatus(displayedTasks);
      break;
  }

  const stats = calculateTaskStats(session.tasks);

  const handleExport = async (format: 'markdown' | 'json' | 'text' | 'csv', copy: boolean = false) => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportTasksAsMarkdown(session);
        filename = `${session.goal.substring(0, 30)}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = exportTasksAsJSON(session);
        filename = `${session.goal.substring(0, 30)}.json`;
        mimeType = 'application/json';
        break;
      case 'text':
        content = exportTasksAsText(session);
        filename = `${session.goal.substring(0, 30)}.txt`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = exportTasksAsCSV(session);
        filename = `${session.goal.substring(0, 30)}.csv`;
        mimeType = 'text/csv';
        break;
    }

    if (copy) {
      const success = await copyToClipboard(content);
      if (success) {
        toast({
          title: 'Copied!',
          description: `Tasks copied to clipboard as ${format.toUpperCase()}`,
        });
      } else {
        toast({
          title: 'Failed',
          description: 'Could not copy to clipboard',
          variant: 'destructive',
        });
      }
    } else {
      downloadFile(content, filename, mimeType);
      toast({
        title: 'Downloaded!',
        description: `Tasks exported as ${format.toUpperCase()}`,
      });
    }
  };

  if (session.tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Tasks Yet</CardTitle>
          <CardDescription>Generate tasks from your goal above to get started</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <TaskStatsComponent stats={stats} />

      {/* Task List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Action Plan</CardTitle>
              <CardDescription>
                {displayedTasks.length} {displayedTasks.length === 1 ? 'task' : 'tasks'}
                {filter !== 'all' && ` (${filter})`}
              </CardDescription>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Filter */}
              <Select value={filter} onValueChange={(v) => setFilter(v as TaskFilter)}>
                <SelectTrigger className="w-[130px] gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sort} onValueChange={(v) => setSort(v as TaskSort)}>
                <SelectTrigger className="w-[130px] gap-2">
                  <SortAsc className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('markdown', true)}>
                    Copy as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('text', true)}>
                    Copy as Text
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('markdown', false)}>
                    Download Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json', false)}>
                    Download JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('text', false)}>
                    Download Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv', false)}>
                    Download CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              {displayedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={onTaskStatusChange}
                  onDelete={onTaskDelete}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
