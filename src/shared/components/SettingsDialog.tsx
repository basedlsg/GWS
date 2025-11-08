import { useState } from 'react';
import { Eye, EyeOff, RotateCcw, Save, X } from 'lucide-react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useToast } from '@/shared/hooks/use-toast';
import { getFormattedStorageSize, getStoragePercentage } from '@/shared/utils/localStorage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const {
    settings,
    updateSettings,
    updateTransmuteSettings,
    updateDistillationSettings,
    updateProjectionSettings,
    updateCulminationSettings,
    resetSettings,
    hasGeminiApiKey,
  } = useSettings();

  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey || '');

  const storageSize = getFormattedStorageSize();
  const storagePercentage = getStoragePercentage();

  const handleSave = () => {
    // Update API key if changed
    if (apiKeyInput !== settings.geminiApiKey) {
      updateSettings({ geminiApiKey: apiKeyInput.trim() || undefined });
    }

    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved successfully.',
    });

    onOpenChange(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      setApiKeyInput('');
      toast({
        title: 'Settings reset',
        description: 'All settings have been reset to defaults.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your preferences and API keys for The Great Work Suite
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="transmute">Transmute</TabsTrigger>
            <TabsTrigger value="distillation">Distillation</TabsTrigger>
            <TabsTrigger value="projection">Projection</TabsTrigger>
            <TabsTrigger value="culmination">Culmination</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={settings.theme}
                onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'cyberpunk' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gemini API Key</label>
                {hasGeminiApiKey && (
                  <Badge variant="secondary" className="text-xs">
                    Configured
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your Gemini API key (optional)"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your free API key from{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Google AI Studio
                </a>
                . Your key is stored locally in your browser.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Storage Usage</label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Used:</span>
                  <span>{storageSize}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {storagePercentage.toFixed(1)}% of recommended limit
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Transmute Settings */}
          <TabsContent value="transmute" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Theme</label>
              <Select
                value={settings.transmute.defaultTheme}
                onValueChange={(value) => updateTransmuteSettings({ defaultTheme: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="matrix">Matrix</SelectItem>
                  <SelectItem value="retro">Retro</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="10"
                  max="24"
                  value={settings.transmute.fontSize}
                  onChange={(e) => updateTransmuteSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">px</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="transmute-autosave"
                checked={settings.transmute.autoSave}
                onChange={(e) => updateTransmuteSettings({ autoSave: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="transmute-autosave" className="text-sm font-medium cursor-pointer">
                Auto-save snippets
              </label>
            </div>
          </TabsContent>

          {/* Distillation Settings */}
          <TabsContent value="distillation" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Persona</label>
              <Select
                value={settings.distillation.defaultPersona}
                onValueChange={(value) => updateDistillationSettings({ defaultPersona: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="tactical">Tactical</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="philosophical">Philosophical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="distillation-autogenerate"
                checked={settings.distillation.autoGenerateTasks}
                onChange={(e) => updateDistillationSettings({ autoGenerateTasks: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="distillation-autogenerate" className="text-sm font-medium cursor-pointer">
                Auto-generate tasks on goal input
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="distillation-progress"
                checked={settings.distillation.showProgressIndicator}
                onChange={(e) => updateDistillationSettings({ showProgressIndicator: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="distillation-progress" className="text-sm font-medium cursor-pointer">
                Show progress indicator
              </label>
            </div>
          </TabsContent>

          {/* Projection Settings */}
          <TabsContent value="projection" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Rate</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.projection.speechRate}
                  onChange={(e) => updateProjectionSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">1.0 = normal</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Pitch</label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.projection.speechPitch}
                  onChange={(e) => updateProjectionSettings({ speechPitch: parseFloat(e.target.value) })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">1.0 = normal</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="projection-autoplay"
                checked={settings.projection.autoPlayResponses}
                onChange={(e) => updateProjectionSettings({ autoPlayResponses: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="projection-autoplay" className="text-sm font-medium cursor-pointer">
                Auto-play AI responses
              </label>
            </div>
          </TabsContent>

          {/* Culmination Settings */}
          <TabsContent value="culmination" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select
                value={settings.culmination.exportFormat}
                onValueChange={(value) => updateCulminationSettings({ exportFormat: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="culmination-timeline"
                checked={settings.culmination.showTimeline}
                onChange={(e) => updateCulminationSettings({ showTimeline: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="culmination-timeline" className="text-sm font-medium cursor-pointer">
                Show timeline visualization
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="culmination-all-features"
                checked={settings.culmination.includeAllFeatures}
                onChange={(e) => updateCulminationSettings({ includeAllFeatures: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="culmination-all-features" className="text-sm font-medium cursor-pointer">
                Include all features in portfolio
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
