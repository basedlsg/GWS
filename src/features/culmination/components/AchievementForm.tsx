/**
 * AchievementForm Component
 * Form for creating and editing achievements
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Lightbulb, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { CATEGORY_INFO, STATUS_INFO, ACHIEVEMENT_TEMPLATES, NARRATIVE_PROMPTS } from '../constants';
import type {
  Achievement,
  AchievementCategory,
  AchievementStatus,
  AchievementMetric,
  AchievementTemplate,
} from '../types';

interface AchievementFormProps {
  onSubmit: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Achievement>;
  isLoading?: boolean;
}

export function AchievementForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AchievementFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<AchievementCategory>(initialData?.category || 'personal');
  const [status, setStatus] = useState<AchievementStatus>(initialData?.status || 'envisioned');
  const [targetDate, setTargetDate] = useState(
    initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : ''
  );
  const [completionDate, setCompletionDate] = useState(
    initialData?.completionDate ? new Date(initialData.completionDate).toISOString().split('T')[0] : ''
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [metrics, setMetrics] = useState<AchievementMetric[]>(initialData?.metrics || []);
  const [narrative, setNarrative] = useState(initialData?.narrative || '');
  const [showTemplates, setShowTemplates] = useState(false);

  // Auto-set completion date when status changes to achieved
  useEffect(() => {
    if (status === 'achieved' && !completionDate) {
      setCompletionDate(new Date().toISOString().split('T')[0]);
    }
  }, [status, completionDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted!');
    console.log('📝 title:', title);
    console.log('📝 targetDate:', targetDate);

    if (!title.trim() || !targetDate) {
      console.warn('⚠️ Form validation failed - missing title or targetDate');
      return;
    }

    const achievementData = {
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      targetDate: new Date(targetDate).toISOString(),
      completionDate: completionDate ? new Date(completionDate).toISOString() : undefined,
      imageUrl: imageUrl.trim() || undefined,
      tags,
      metrics,
      narrative: narrative.trim() || undefined,
    };

    console.log('📝 Calling onSubmit with:', achievementData);
    onSubmit(achievementData);
  };

  const handleTemplateSelect = (template: AchievementTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setCategory(template.category);
    setMetrics(template.exampleMetrics);
    setTags(template.suggestedTags);
    setShowTemplates(false);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { label: '', value: '', icon: '📊' }]);
  };

  const handleUpdateMetric = (index: number, field: keyof AchievementMetric, value: string) => {
    const updated = [...metrics];
    const currentMetric = updated[index];
    if (currentMetric) {
      updated[index] = { ...currentMetric, [field]: value };
      setMetrics(updated);
    }
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {initialData ? 'Edit Achievement' : 'Create Achievement'}
            </CardTitle>
            <CardDescription>
              Document your envisioned or completed accomplishments
            </CardDescription>
          </div>

          {!initialData && (
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Achievement Templates</DialogTitle>
                  <DialogDescription>
                    Start with a pre-filled template and customize to your goal
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3">
                  {ACHIEVEMENT_TEMPLATES.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          <Badge variant="outline">
                            {CATEGORY_INFO[template.category].icon}{' '}
                            {CATEGORY_INFO[template.category].label}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Achievement Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Launched my own startup"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your achievement in detail..."
                className="min-h-[100px]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as AchievementCategory)} disabled={isLoading}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.icon} {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as AchievementStatus)} disabled={isLoading}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.icon} {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {status === 'achieved' && (
                <div className="space-y-2">
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                disabled={isLoading}
              />
              <Button type="button" onClick={handleAddTag} disabled={isLoading}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Key Metrics</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddMetric} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-1" />
                Add Metric
              </Button>
            </div>

            {metrics.map((metric, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={metric.icon}
                  onChange={(e) => handleUpdateMetric(index, 'icon', e.target.value)}
                  placeholder="📊"
                  className="w-16"
                  disabled={isLoading}
                />
                <Input
                  value={metric.label}
                  onChange={(e) => handleUpdateMetric(index, 'label', e.target.value)}
                  placeholder="Label"
                  disabled={isLoading}
                />
                <Input
                  value={metric.value}
                  onChange={(e) => handleUpdateMetric(index, 'value', e.target.value)}
                  placeholder="Value"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveMetric(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Narrative */}
          <div className="space-y-2">
            <Label htmlFor="narrative">Success Story (optional)</Label>
            <p className="text-xs text-muted-foreground">
              Consider: {NARRATIVE_PROMPTS[Math.floor(Math.random() * NARRATIVE_PROMPTS.length)]}
            </p>
            <Textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Tell the story of how you achieved this goal..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!title.trim() || !targetDate || isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {initialData ? 'Update Achievement' : 'Create Achievement'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
