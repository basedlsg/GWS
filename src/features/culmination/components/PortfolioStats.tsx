/**
 * PortfolioStats Component
 * Display statistics and insights about achievements
 */

import { TrendingUp, Target, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import type { PortfolioStats } from '../types';
import { CATEGORY_INFO } from '../constants';

interface PortfolioStatsProps {
  stats: PortfolioStats;
}

export function PortfolioStatsComponent({ stats }: PortfolioStatsProps) {
  const {
    totalAchievements,
    envisionedCount,
    inProgressCount,
    achievedCount,
    categoryCounts,
    completionRate,
  } = stats;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Achievements"
          value={totalAchievements}
          icon={<Target className="h-4 w-4" />}
          description="All envisioned goals"
        />

        <StatCard
          title="Achieved"
          value={achievedCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          description="Successfully completed"
          valueColor="text-green-600 dark:text-green-400"
        />

        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={<Loader2 className="h-4 w-4" />}
          description="Currently working on"
          valueColor="text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Overall progress"
          valueColor="text-primary"
        />
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={completionRate} className="h-3" />

            <div className="flex justify-between text-sm">
              <div className="flex gap-4">
                <span className="text-muted-foreground">
                  Envisioned: <span className="font-medium">{envisionedCount}</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  In Progress: <span className="font-medium">{inProgressCount}</span>
                </span>
                <span className="text-green-600 dark:text-green-400">
                  Achieved: <span className="font-medium">{achievedCount}</span>
                </span>
              </div>
              <span className="font-semibold">{achievedCount}/{totalAchievements}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Achievements by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryCounts)
              .filter(([_, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => {
                const info = CATEGORY_INFO[category as keyof typeof categoryCounts];
                return (
                  <div
                    key={category}
                    className="flex items-center gap-2 p-3 rounded-lg border"
                    style={{ borderColor: info.color }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1 text-sm font-medium mb-1">
                        <span>{info.icon}</span>
                        <span>{info.label}</span>
                      </div>
                      <div className="text-2xl font-bold">{count}</div>
                    </div>
                  </div>
                );
              })}
          </div>

          {Object.values(categoryCounts).every((c) => c === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No achievements yet. Start by creating your first goal!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  valueColor?: string;
}

function StatCard({ title, value, icon, description, valueColor = 'text-foreground' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
