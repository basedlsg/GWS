import { Link } from 'react-router-dom';
import { Code2, Target, MessageSquare, Trophy, Sparkles, Lock, Zap, ArrowRight } from 'lucide-react';
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
      tagline: 'Style Your Code',
      description: 'Transform plain text code into beautifully styled, presentation-ready code blocks with cyberpunk aesthetics',
      path: '/transmute',
      color: 'from-cyan-500 to-blue-500',
      highlights: [
        'Syntax highlighting for 20+ languages',
        'Multiple cyberpunk themes',
        'Export to HTML, Markdown, Images',
        'Live preview with instant updates',
      ],
    },
    {
      icon: Target,
      title: 'Distillation',
      emoji: '⚗️',
      tagline: 'Goals to Action',
      description: 'Convert abstract goals and vague ambitions into concrete, actionable task lists with AI-powered insights',
      path: '/distillation',
      color: 'from-purple-500 to-pink-500',
      aiPowered: true,
      highlights: [
        'AI task generation with Gemini',
        '4 coaching personas',
        'Progress tracking & statistics',
        'Export to multiple formats',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Projection',
      emoji: '🎯',
      tagline: 'Practice the Future',
      description: 'Practice future scenarios through realistic simulated conversations with text-to-speech support',
      path: '/projection',
      color: 'from-green-500 to-emerald-500',
      aiPowered: true,
      highlights: [
        'Realistic AI dialogue simulation',
        'Text-to-speech with voice controls',
        '6 scenario types (interviews, pitches, etc)',
        'Session history & replay',
      ],
    },
    {
      icon: Trophy,
      title: 'Culmination',
      emoji: '✨',
      tagline: 'Visualize Success',
      description: 'Document and visualize your achievements as if they\'ve already happened with portfolio creation',
      path: '/culmination',
      color: 'from-amber-500 to-orange-500',
      highlights: [
        'Achievement portfolio builder',
        'Timeline & grid visualizations',
        'Success story narratives',
        'Export as HTML portfolios',
      ],
    },
  ];

  const benefits = [
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'All data stored locally in your browser. No accounts, no tracking, no servers.',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'No signup required. Start using any feature immediately with zero friction.',
    },
    {
      icon: Sparkles,
      title: 'AI-Enhanced',
      description: 'Optional Gemini AI integration for intelligent task generation and dialogue.',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="text-center space-y-6 py-12">
          <div className="inline-block">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
              Four Integrated Manifestation Tools
            </Badge>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              The Great Work Suite
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform for{' '}
            <span className="text-foreground font-semibold">transforming goals into reality</span>.
            Four powerful applications working together to help you plan, practice, and manifest your vision.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            {hasGeminiApiKey ? (
              <Badge variant="default" className="text-sm px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                <Sparkles className="h-3 w-3 mr-2" />
                AI Features Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="text-sm px-4 py-2">
                Template Mode Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Tool</h2>
          <p className="text-muted-foreground">Each application serves a unique purpose in your manifestation journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.path}
              className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                      {feature.emoji}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        {feature.title}
                        {feature.aiPowered && (
                          <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-medium mt-0.5">
                        {feature.tagline}
                      </p>
                    </div>
                  </div>
                  <feature.icon
                    className={`h-10 w-10 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent opacity-40 group-hover:opacity-70 transition-opacity`}
                  />
                </div>

                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Feature highlights */}
                <div className="space-y-1.5">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`h-1 w-1 rounded-full bg-gradient-to-r ${feature.color}`} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Launch button */}
                <Link to={feature.path}>
                  <Button
                    className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${feature.color} hover:shadow-lg transition-all`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Launch {feature.title}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Why The Great Work Suite?</h2>
          <p className="text-muted-foreground">Built with privacy, simplicity, and power in mind</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="text-center border-2">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Your journey from vision to reality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Envision',
              description: 'Use Culmination to visualize your ideal future achievements',
              icon: Trophy,
            },
            {
              step: '2',
              title: 'Plan',
              description: 'Use Distillation to break down goals into actionable tasks',
              icon: Target,
            },
            {
              step: '3',
              title: 'Practice',
              description: 'Use Projection to rehearse important future conversations',
              icon: MessageSquare,
            },
            {
              step: '4',
              title: 'Present',
              description: 'Use Transmute to showcase your work professionally',
              icon: Code2,
            },
          ].map((step) => (
            <Card key={step.step} className="relative text-center">
              <CardHeader>
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <step.icon className="h-5 w-5" />
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started / API Key Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Ready to use immediately</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All features work out of the box with intelligent template-based fallbacks.
              No signup, no configuration required.
            </p>
          </div>

          {!hasGeminiApiKey && (
            <div className="p-4 rounded-lg bg-background border-2 border-dashed">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Unlock AI Features (Optional)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add your Gemini API key in Settings to enable AI-powered task generation
                in Distillation and realistic dialogue in Projection. The free tier is generous!
              </p>
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Add API Key in Settings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="font-semibold text-sm mb-2">Quick Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All data is stored locally in your browser</li>
                <li>• Export your work anytime in multiple formats</li>
                <li>• No internet required after initial load</li>
                <li>• Works on mobile, tablet, and desktop</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Best Practices:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with Culmination to envision your goals</li>
                <li>• Use Distillation to create action plans</li>
                <li>• Practice scenarios with Projection</li>
                <li>• Export and backup your data regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-2xl font-bold">Ready to start your journey?</h2>
        <p className="text-muted-foreground">Choose any tool above to begin manifesting your vision.</p>
      </div>
    </div>
  );
}
