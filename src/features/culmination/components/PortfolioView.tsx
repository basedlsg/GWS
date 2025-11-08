/**
 * PortfolioView Component
 * Display achievements in different layout formats
 */

import { AchievementCard } from './AchievementCard';
import { TimelineView } from './TimelineView';
import type { Achievement, PortfolioLayout } from '../types';

interface PortfolioViewProps {
  achievements: Achievement[];
  layout: PortfolioLayout;
  onAchievementEdit?: (achievement: Achievement) => void;
  onAchievementDelete?: (id: string) => void;
  onAchievementClick?: (achievement: Achievement) => void;
}

export function PortfolioView({
  achievements,
  layout,
  onAchievementEdit,
  onAchievementDelete,
  onAchievementClick,
}: PortfolioViewProps) {
  console.log('🎨 PortfolioView rendering with achievements:', achievements);
  console.log('🎨 achievements.length:', achievements.length);
  console.log('🎨 layout:', layout);

  if (achievements.length === 0) {
    console.log('🎨 No achievements - showing empty state');
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">No achievements in this portfolio yet</p>
        <p className="text-sm">Create your first achievement to get started</p>
      </div>
    );
  }

  switch (layout) {
    case 'timeline':
      return <TimelineView achievements={achievements} onAchievementClick={onAchievementClick} />;

    case 'grid':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={onAchievementEdit}
              onDelete={onAchievementDelete}
              onClick={onAchievementClick}
            />
          ))}
        </div>
      );

    case 'masonry':
      // Masonry layout with CSS Grid
      return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="break-inside-avoid">
              <AchievementCard
                achievement={achievement}
                onEdit={onAchievementEdit}
                onDelete={onAchievementDelete}
                onClick={onAchievementClick}
              />
            </div>
          ))}
        </div>
      );

    case 'cards':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={onAchievementEdit}
              onDelete={onAchievementDelete}
              onClick={onAchievementClick}
            />
          ))}
        </div>
      );

    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={onAchievementEdit}
              onDelete={onAchievementDelete}
              onClick={onAchievementClick}
            />
          ))}
        </div>
      );
  }
}
