/**
 * TimelineView Component
 * Display achievements in a chronological timeline
 */

import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CATEGORY_INFO, STATUS_INFO } from '../constants';
import type { Achievement } from '../types';

interface TimelineViewProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
}

export function TimelineView({ achievements, onAchievementClick }: TimelineViewProps) {
  // Sort achievements by target date
  const sorted = [...achievements].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  // Group by year
  const groupedByYear = sorted.reduce<Record<string, Achievement[]>>((acc, achievement) => {
    const year = new Date(achievement.targetDate).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(achievement);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(a) - parseInt(b));

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No achievements to display in timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <div key={year} className="relative">
          {/* Year Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-6">
            <h3 className="text-2xl font-bold text-primary">{year}</h3>
            <div className="h-1 w-16 bg-primary rounded-full mt-2" />
          </div>

          {/* Timeline Items */}
          <div className="relative pl-8 space-y-6">
            {/* Timeline Line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />

            {(groupedByYear[year] || []).map((achievement, index) => (
              <TimelineItem
                key={achievement.id}
                achievement={achievement}
                onClick={onAchievementClick}
                isLast={index === (groupedByYear[year]?.length || 0) - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TimelineItemProps {
  achievement: Achievement;
  onClick?: (achievement: Achievement) => void;
  isLast: boolean;
}

function TimelineItem({ achievement, onClick }: TimelineItemProps) {
  const categoryInfo = CATEGORY_INFO[achievement.category];
  const statusInfo = STATUS_INFO[achievement.status];

  const handleClick = () => {
    if (onClick) {
      onClick(achievement);
    }
  };

  return (
    <div className="relative">
      {/* Timeline Dot */}
      <div
        className={`
          absolute -left-[1.65rem] top-3 w-4 h-4 rounded-full border-2 border-background
          ${achievement.status === 'achieved' ? 'bg-green-500' : achievement.status === 'in_progress' ? 'bg-blue-500' : 'bg-muted'}
        `}
      />

      <Card
        className={`
          transition-all hover:shadow-md
          ${onClick ? 'cursor-pointer' : ''}
          ${achievement.status === 'achieved' ? 'border-green-200 dark:border-green-800' : ''}
        `}
        onClick={onClick ? handleClick : undefined}
      >
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" style={{ borderColor: categoryInfo.color }}>
                    {categoryInfo.icon} {categoryInfo.label}
                  </Badge>

                  <Badge
                    variant={achievement.status === 'achieved' ? 'default' : 'secondary'}
                    className={statusInfo.color}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </Badge>

                  <span className="text-sm text-muted-foreground">
                    {new Date(achievement.targetDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="text-lg font-semibold">{achievement.title}</h4>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>

            {/* Metrics */}
            {achievement.metrics && achievement.metrics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {achievement.metrics.slice(0, 3).map((metric, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs"
                  >
                    <span>{metric.icon}</span>
                    <span className="font-medium">{metric.value}</span>
                    <span className="text-muted-foreground">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {achievement.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {achievement.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {achievement.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{achievement.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Completion Info */}
            {achievement.completionDate && (
              <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <span>✓</span>
                <span>
                  Completed {new Date(achievement.completionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
