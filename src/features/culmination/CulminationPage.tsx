/**
 * CulminationPage
 * Main page for the Culmination feature
 * Visualize and document future achievements
 */

import { useState, useEffect } from 'react';
import { Trophy, Plus, Download, Settings, BarChart3, LayoutGrid } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { AchievementForm } from './components/AchievementForm';
import { PortfolioView } from './components/PortfolioView';
import { PortfolioStatsComponent } from './components/PortfolioStats';
import {
  loadPortfolios,
  createPortfolio,
  updatePortfolio,
  getActivePortfolio,
  setActivePortfolioId,
  addAchievementToPortfolio,
  updateAchievementInPortfolio,
  deleteAchievementFromPortfolio,
  calculatePortfolioStats,
} from './utils/storage';
import {
  exportPortfolioAsMarkdown,
  exportPortfolioAsHTML,
  exportPortfolioAsJSON,
  exportPortfolioAsText,
  downloadFile,
  copyToClipboard,
} from './utils/export';
import { THEME_CONFIG, LAYOUT_CONFIG } from './constants';
import type { Portfolio, Achievement, PortfolioTheme, PortfolioLayout } from './types';

export function CulminationPage() {
  const { toast } = useToast();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [showNewPortfolioDialog, setShowNewPortfolioDialog] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showAchievementDetail, setShowAchievementDetail] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // New portfolio form state
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [newPortfolioTheme, setNewPortfolioTheme] = useState<PortfolioTheme>('professional');
  const [newPortfolioLayout, setNewPortfolioLayout] = useState<PortfolioLayout>('grid');

  // Load portfolios on mount
  useEffect(() => {
    const loaded = loadPortfolios();
    setPortfolios(loaded);

    const active = getActivePortfolio();
    if (active) {
      setActivePortfolio(active);
    } else if (loaded.length > 0) {
      const firstPortfolio = loaded[0];
      if (firstPortfolio) {
        setActivePortfolio(firstPortfolio);
        setActivePortfolioId(firstPortfolio.id);
      }
    }
  }, []);

  // Handle creating new portfolio
  const handleCreatePortfolio = () => {
    if (!newPortfolioTitle.trim()) return;

    const newPortfolio = createPortfolio(
      newPortfolioTitle.trim(),
      newPortfolioDescription.trim(),
      newPortfolioTheme,
      newPortfolioLayout
    );

    setPortfolios(loadPortfolios());
    setActivePortfolio(newPortfolio);
    setShowNewPortfolioDialog(false);

    // Reset form
    setNewPortfolioTitle('');
    setNewPortfolioDescription('');
    setNewPortfolioTheme('professional');
    setNewPortfolioLayout('grid');

    toast({
      title: 'Portfolio Created',
      description: `"${newPortfolio.title}" is ready for your achievements`,
    });
  };

  // Handle adding achievement
  const handleAddAchievement = (achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🎯 handleAddAchievement called with:', achievementData);
      console.log('🎯 activePortfolio:', activePortfolio);

      if (!activePortfolio) {
        console.error('❌ No active portfolio!');
        toast({
          title: 'Error',
          description: 'No active portfolio selected',
          variant: 'destructive',
        });
        return;
      }

      const newAchievement = addAchievementToPortfolio(activePortfolio.id, achievementData);
      console.log('🎯 newAchievement returned:', newAchievement);

      if (newAchievement) {
        setPortfolios(loadPortfolios());
        const updated = loadPortfolios().find((p) => p.id === activePortfolio.id);
        console.log('🎯 updated portfolio:', updated);
        console.log('🎯 updated achievements:', updated?.achievements);
        if (updated) setActivePortfolio(updated);

        setShowAchievementForm(false);

        toast({
          title: 'Achievement Added',
          description: `"${newAchievement.title}" has been added to your portfolio`,
        });
      } else {
        console.error('❌ addAchievementToPortfolio returned null!');
        toast({
          title: 'Error',
          description: 'Failed to add achievement to portfolio',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error in handleAddAchievement:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Handle editing achievement
  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowAchievementForm(true);
    setShowAchievementDetail(false);
  };

  // Handle updating achievement
  const handleUpdateAchievement = (achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!activePortfolio || !editingAchievement) return;

    const success = updateAchievementInPortfolio(activePortfolio.id, editingAchievement.id, achievementData);

    if (success) {
      setPortfolios(loadPortfolios());
      const updated = loadPortfolios().find((p) => p.id === activePortfolio.id);
      if (updated) setActivePortfolio(updated);

      setShowAchievementForm(false);
      setEditingAchievement(null);

      toast({
        title: 'Achievement Updated',
        description: 'Your changes have been saved',
      });
    }
  };

  // Handle deleting achievement
  const handleDeleteAchievement = (achievementId: string) => {
    if (!activePortfolio) return;

    const success = deleteAchievementFromPortfolio(activePortfolio.id, achievementId);

    if (success) {
      setPortfolios(loadPortfolios());
      const updated = loadPortfolios().find((p) => p.id === activePortfolio.id);
      if (updated) setActivePortfolio(updated);

      toast({
        title: 'Achievement Deleted',
        description: 'Achievement has been removed from portfolio',
      });
    }
  };

  // Handle achievement click
  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementDetail(true);
  };

  // Handle portfolio selection
  const handlePortfolioSelect = (portfolioId: string) => {
    const portfolio = portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      setActivePortfolio(portfolio);
      setActivePortfolioId(portfolioId);
    }
  };

  // Handle layout change
  const handleLayoutChange = (layout: PortfolioLayout) => {
    if (!activePortfolio) return;

    updatePortfolio(activePortfolio.id, { layout });
    const updated = loadPortfolios().find((p) => p.id === activePortfolio.id);
    if (updated) setActivePortfolio(updated);
  };

  // Handle export
  const handleExport = async (format: 'markdown' | 'html' | 'json' | 'text', copy: boolean = false) => {
    if (!activePortfolio) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportPortfolioAsMarkdown(activePortfolio);
        filename = `${activePortfolio.title.substring(0, 30)}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
        content = exportPortfolioAsHTML(activePortfolio);
        filename = `${activePortfolio.title.substring(0, 30)}.html`;
        mimeType = 'text/html';
        break;
      case 'json':
        content = exportPortfolioAsJSON(activePortfolio);
        filename = `${activePortfolio.title.substring(0, 30)}.json`;
        mimeType = 'application/json';
        break;
      case 'text':
        content = exportPortfolioAsText(activePortfolio);
        filename = `${activePortfolio.title.substring(0, 30)}.txt`;
        mimeType = 'text/plain';
        break;
    }

    if (copy) {
      const success = await copyToClipboard(content);
      if (success) {
        toast({
          title: 'Copied!',
          description: `Portfolio copied to clipboard as ${format.toUpperCase()}`,
        });
      } else {
        toast({
          title: 'Failed',
          description: 'Could not copy to clipboard',
          variant: 'destructive',
        });
      }
    } else {
      downloadFile(content, filename, mimeType);
      toast({
        title: 'Downloaded!',
        description: `Portfolio exported as ${format.toUpperCase()}`,
      });
    }
  };

  const stats = activePortfolio ? calculatePortfolioStats(activePortfolio) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Culmination</h1>
          </div>

          <div className="flex items-center gap-2">
            {activePortfolio && (
              <>
                {/* Export Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('markdown', true)}>
                      Copy as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('text', true)}>
                      Copy as Text
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('html', false)}>
                      Download HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('markdown', false)}>
                      Download Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json', false)}>
                      Download JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => setShowAchievementForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Achievement
                </Button>
              </>
            )}

            <Button onClick={() => setShowNewPortfolioDialog(true)} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Portfolio
            </Button>
          </div>
        </div>

        <p className="text-lg text-muted-foreground">
          Visualize and document your envisioned and accomplished achievements
        </p>
      </div>

      {/* Portfolio Selector */}
      {portfolios.length > 0 && (
        <div className="flex items-center gap-4">
          <Label>Active Portfolio:</Label>
          <Select value={activePortfolio?.id || ''} onValueChange={handlePortfolioSelect}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.title} ({portfolio.achievements.length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activePortfolio && (
            <div className="flex items-center gap-2">
              <Label>Layout:</Label>
              <Select value={activePortfolio.layout} onValueChange={(v) => handleLayoutChange(v as PortfolioLayout)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LAYOUT_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      {activePortfolio ? (
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioView
              achievements={activePortfolio.achievements}
              layout={activePortfolio.layout}
              onAchievementEdit={handleEditAchievement}
              onAchievementDelete={handleDeleteAchievement}
              onAchievementClick={handleAchievementClick}
            />
          </TabsContent>

          <TabsContent value="stats">
            {stats && <PortfolioStatsComponent stats={stats} />}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Portfolio Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first portfolio to start documenting your envisioned and achieved goals
            </p>
            <Button onClick={() => setShowNewPortfolioDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Portfolio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Create a portfolio</strong> - Organize your achievements into themed collections
          </p>
          <p>
            <strong>2. Add achievements</strong> - Document your envisioned goals with details, metrics, and timelines
          </p>
          <p>
            <strong>3. Visualize progress</strong> - See your journey in grid, timeline, or masonry layouts
          </p>
          <p>
            <strong>4. Write success stories</strong> - Add narratives describing how you achieved each goal
          </p>
          <p>
            <strong>5. Export & share</strong> - Download your portfolio as HTML, PDF, or markdown for sharing
          </p>
          <p className="pt-2 border-t">
            <strong>💡 Tip:</strong> Start by envisioning your ideal future, then work backwards to create actionable achievements
          </p>
        </CardContent>
      </Card>

      {/* New Portfolio Dialog */}
      <Dialog open={showNewPortfolioDialog} onOpenChange={setShowNewPortfolioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
            <DialogDescription>
              Create a collection to organize your achievements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-title">Portfolio Title *</Label>
              <Input
                id="portfolio-title"
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                placeholder="e.g., Professional Career Goals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-description">Description</Label>
              <Input
                id="portfolio-description"
                value={newPortfolioDescription}
                onChange={(e) => setNewPortfolioDescription(e.target.value)}
                placeholder="Brief description of this portfolio"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={newPortfolioTheme} onValueChange={(v) => setNewPortfolioTheme(v as PortfolioTheme)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEME_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Layout</Label>
                <Select value={newPortfolioLayout} onValueChange={(v) => setNewPortfolioLayout(v as PortfolioLayout)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LAYOUT_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPortfolioDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePortfolio} disabled={!newPortfolioTitle.trim()}>
                Create Portfolio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievement Form Dialog */}
      <Dialog open={showAchievementForm} onOpenChange={setShowAchievementForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AchievementForm
            onSubmit={editingAchievement ? handleUpdateAchievement : handleAddAchievement}
            onCancel={() => {
              setShowAchievementForm(false);
              setEditingAchievement(null);
            }}
            initialData={editingAchievement || undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Achievement Detail Dialog */}
      {selectedAchievement && (
        <Dialog open={showAchievementDetail} onOpenChange={setShowAchievementDetail}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h2>
                <p className="text-muted-foreground">{selectedAchievement.description}</p>
              </div>

              {selectedAchievement.narrative && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Success Story</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedAchievement.narrative}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleEditAchievement(selectedAchievement)} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => setShowAchievementDetail(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
