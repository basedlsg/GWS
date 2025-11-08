/**
 * TaskStats Component
 * Display task statistics in a visual format
 */

import { CheckCircle2, Circle, Loader2, Target } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import type { TaskStats } from '../types';

interface TaskStatsProps {
  stats: TaskStats;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Completion Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Completion
              </span>
              <span className="font-bold">{Math.round(stats.completionRate)}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.completed} of {stats.total} tasks
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.inProgress}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3" />
                In Progress
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {stats.pending}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Circle className="h-3 w-3" />
                Pending
              </p>
            </div>
            <Circle className="h-8 w-8 text-gray-600 dark:text-gray-400 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
