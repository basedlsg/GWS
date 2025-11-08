/**
 * GoalInput Component
 * Input form for entering goals and selecting persona
 */

import { useState } from 'react';
import { Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { PERSONA_INFO, EXAMPLE_GOALS } from '../constants';
import type { Persona } from '../types';

interface GoalInputProps {
  onSubmit: (goal: string, persona: Persona) => void;
  isGenerating: boolean;
  hasAPIKey: boolean;
}

export function GoalInput({ onSubmit, isGenerating, hasAPIKey }: GoalInputProps) {
  const [goal, setGoal] = useState('');
  const [persona, setPersona] = useState<Persona>('strategic');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit(goal.trim(), persona);
    }
  };

  const handleExampleClick = (example: string) => {
    setGoal(example);
    setShowExamples(false);
  };

  const selectedPersona = PERSONA_INFO[persona];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Enter Your Goal
            </CardTitle>
            <CardDescription>
              Describe what you want to achieve. Be specific or abstract - we'll break it down either way.
            </CardDescription>
          </div>
          <Badge variant={hasAPIKey ? 'default' : 'secondary'}>
            {hasAPIKey ? '✨ AI Mode' : '📝 Template Mode'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="goal" className="block text-sm font-medium">
                Your Goal
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowExamples(!showExamples)}
                className="gap-2 text-xs"
              >
                <Lightbulb className="h-3 w-3" />
                {showExamples ? 'Hide' : 'Show'} Examples
              </Button>
            </div>

            {showExamples && (
              <div className="p-3 rounded-lg bg-muted space-y-2">
                <p className="text-xs text-muted-foreground">Click an example to use it:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_GOALS.map((example) => (
                    <Button
                      key={example}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="E.g., 'Build a successful online business' or 'Get in the best shape of my life'"
              className="min-h-[100px] resize-y"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">{goal.length} characters</p>
          </div>

          {/* Persona Selector */}
          <div className="space-y-2">
            <label htmlFor="persona" className="block text-sm font-medium">
              Approach Style
            </label>
            <Select value={persona} onValueChange={(v) => setPersona(v as Persona)} disabled={isGenerating}>
              <SelectTrigger id="persona">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PERSONA_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Persona Description */}
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-start gap-2">
                <span className="text-2xl">{selectedPersona.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedPersona.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedPersona.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={!goal.trim() || isGenerating} className="w-full gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Action Plan
              </>
            )}
          </Button>

          {/* Info Message */}
          {!hasAPIKey && (
            <p className="text-xs text-muted-foreground text-center">
              💡 Add a Gemini API key in Settings for AI-powered task generation
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
