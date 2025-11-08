/**
 * AchievementCard Component
 * Display individual achievement in card format
 */

import { Edit, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { CATEGORY_INFO, STATUS_INFO } from '../constants';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (id: string) => void;
  onClick?: (achievement: Achievement) => void;
  showActions?: boolean;
}

export function AchievementCard({
  achievement,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
}: AchievementCardProps) {
  const categoryInfo = CATEGORY_INFO[achievement.category];
  const statusInfo = STATUS_INFO[achievement.status];

  const handleCardClick = () => {
    if (onClick) {
      onClick(achievement);
    }
  };

  return (
    <Card
      className={`
        group transition-all hover:shadow-lg
        ${onClick ? 'cursor-pointer' : ''}
        ${achievement.status === 'achieved' ? 'border-green-200 dark:border-green-800' : ''}
      `}
      onClick={onClick ? handleCardClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="flex-shrink-0"
                style={{ borderColor: categoryInfo.color }}
              >
                {categoryInfo.icon} {categoryInfo.label}
              </Badge>

              <Badge
                variant={achievement.status === 'achieved' ? 'default' : 'secondary'}
                className={`flex-shrink-0 ${statusInfo.color}`}
              >
                {statusInfo.icon} {statusInfo.label}
              </Badge>
            </div>

            <CardTitle className="text-lg line-clamp-2">{achievement.title}</CardTitle>
          </div>

          {showActions && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(achievement);
                  }}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}

              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Achievement?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{achievement.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(achievement.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>

        {achievement.imageUrl && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-3">{achievement.description}</CardDescription>

        {/* Metrics */}
        {achievement.metrics && achievement.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {achievement.metrics.slice(0, 4).map((metric, index) => (
              <div
                key={index}
                className="p-2 rounded-lg bg-muted/50 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{metric.icon}</span>
                  <span>{metric.label}</span>
                </div>
                <div className="font-semibold text-sm">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {achievement.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {achievement.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {achievement.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{achievement.tags.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Target: {new Date(achievement.targetDate).toLocaleDateString()}</span>
          </div>

          {achievement.completionDate && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Completed: {new Date(achievement.completionDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Narrative indicator */}
        {achievement.narrative && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              📖 Has success story
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
