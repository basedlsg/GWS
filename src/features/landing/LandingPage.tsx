import { Link } from 'react-router-dom';
import { Code2, Target, MessageSquare, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useSettings } from '@/shared/hooks/useSettings';

export function LandingPage() {
  const { hasGeminiApiKey } = useSettings();

  const features = [
    {
      icon: Code2,
      title: 'Transmute',
      emoji: '🔮',
      description: 'Transform plain text code into beautifully styled, presentation-ready code blocks',
      path: '/transmute',
      color: 'text-cyber-cyan',
    },
    {
      icon: Target,
      title: 'Distillation',
      emoji: '⚗️',
      description: 'Convert abstract goals into concrete, actionable tasks with AI coaching',
      path: '/distillation',
      color: 'text-cyber-purple',
      aiPowered: true,
    },
    {
      icon: MessageSquare,
      title: 'Projection',
      emoji: '🎯',
      description: 'Practice future scenarios through simulated conversations and meetings',
      path: '/projection',
      color: 'text-cyber-green',
      aiPowered: true,
    },
    {
      icon: Trophy,
      title: 'Culmination',
      emoji: '✨',
      description: 'Visualize and document your achievements through mock portfolios',
      path: '/culmination',
      color: 'text-cyber-magenta',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          The Great Work Suite
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Four integrated manifestation and productivity applications designed to help you
          transform your goals into reality
        </p>
        {hasGeminiApiKey && (
          <Badge variant="secondary" className="text-sm">
            AI Features Enabled
          </Badge>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.path} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{feature.emoji}</span>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      {feature.aiPowered && (
                        <Badge variant="outline" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                </div>
                <feature.icon className={`h-8 w-8 ${feature.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
              </div>
              <CardDescription className="mt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={feature.path}>
                <Button className="w-full" variant="outline">
                  Launch {feature.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 rounded-lg border bg-muted/50">
        <h2 className="text-lg font-semibold mb-2">Welcome to The Great Work Suite</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This platform combines four powerful tools to help you manifest your goals and maximize productivity.
          All data is stored locally in your browser for complete privacy.
        </p>

        {!hasGeminiApiKey && (
          <div className="p-4 rounded bg-background border">
            <p className="text-sm">
              <strong>Tip:</strong> Add your Gemini API key in Settings to unlock AI-powered features
              for Distillation and Projection. The app works great without it using intelligent fallback templates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
