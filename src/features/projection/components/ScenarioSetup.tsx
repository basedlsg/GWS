/**
 * ScenarioSetup Component
 * Form for creating and configuring projection scenarios
 */

import { useState } from 'react';
import { Play, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
// import { Badge } from '@/shared/components/ui/badge';
import {
  SCENARIO_TYPE_INFO,
  PARTICIPANT_ROLE_INFO,
  SCENARIO_TEMPLATES,
} from '../constants';
import type { ScenarioType, ParticipantRole, ScenarioTemplate, MeetingScenario } from '../types';

interface ScenarioSetupProps {
  onStart: (scenario: MeetingScenario) => void;
  hasAPIKey?: boolean; // Optional for backward compatibility
}

export function ScenarioSetup({ onStart }: ScenarioSetupProps) {
  const [title, setTitle] = useState('');
  const [scenarioType, setScenarioType] = useState<ScenarioType>('interview');
  const [participantRole, setParticipantRole] = useState<ParticipantRole>('interviewer');
  const [context, setContext] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scenario: MeetingScenario = {
      id: generateId(),
      title: title.trim() || SCENARIO_TYPE_INFO[scenarioType].name,
      type: scenarioType,
      description: '',
      participantRole,
      context: context.trim(),
      createdAt: new Date().toISOString(),
    };

    onStart(scenario);
  };

  const handleLoadTemplate = (template: ScenarioTemplate) => {
    setTitle(template.name);
    setScenarioType(template.scenarioType);
    setParticipantRole(template.participantRole);
    setContext(template.exampleContext);
    setShowTemplates(false);
  };

  const scenarioInfo = SCENARIO_TYPE_INFO[scenarioType];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              🎭 Setup Your Scenario
            </CardTitle>
            <CardDescription>
              Configure the scenario you want to practice. AI will simulate realistic conversation.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Quick Start</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="gap-2 text-xs"
              >
                <Lightbulb className="h-3 w-3" />
                {showTemplates ? 'Hide' : 'Show'} Templates
              </Button>
            </div>

            {showTemplates && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SCENARIO_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleLoadTemplate(template)}
                    className="p-3 rounded-lg border bg-card hover:bg-accent text-left transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Scenario Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Senior Engineer Interview at Google"
            />
          </div>

          {/* Scenario Type */}
          <div className="space-y-2">
            <label htmlFor="scenarioType" className="block text-sm font-medium">
              Scenario Type
            </label>
            <Select value={scenarioType} onValueChange={(v) => setScenarioType(v as ScenarioType)}>
              <SelectTrigger id="scenarioType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SCENARIO_TYPE_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">{scenarioInfo.description}</p>
            </div>
          </div>

          {/* Participant Role */}
          <div className="space-y-2">
            <label htmlFor="participantRole" className="block text-sm font-medium">
              Who Are You Speaking With?
            </label>
            <Select
              value={participantRole}
              onValueChange={(v) => setParticipantRole(v as ParticipantRole)}
            >
              <SelectTrigger id="participantRole">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PARTICIPANT_ROLE_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <label htmlFor="context" className="block text-sm font-medium">
              Context & Background
            </label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide context about the scenario, your background, goals, etc."
              className="min-h-[100px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              More context helps generate more relevant and realistic responses
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Simulation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function generateId(): string {
  return `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
