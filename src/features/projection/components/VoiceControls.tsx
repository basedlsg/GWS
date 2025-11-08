/**
 * VoiceControls Component
 * Controls for text-to-speech settings
 */

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Settings2 } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
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
import { Badge } from '@/shared/components/ui/badge';
import { getAvailableVoices, isTTSSupported } from '../utils/speech';
import type { VoiceSettings } from '../types';

interface VoiceControlsProps {
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  isSpeaking: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function VoiceControls({
  settings,
  onSettingsChange,
  isSpeaking,
  isPaused,
  onPlay,
  onPause,
  onStop,
}: VoiceControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isTTSSupported()) {
      const loadVoices = () => {
        setVoices(getAvailableVoices());
      };

      loadVoices();

      // Voices might load asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  if (!isTTSSupported()) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <VolumeX className="h-4 w-4" />
            Text-to-Speech Unavailable
          </CardTitle>
          <CardDescription className="text-xs">
            Your browser doesn't support text-to-speech. Conversation will appear as text only.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleRateChange = (value: string) => {
    onSettingsChange({ ...settings, rate: parseFloat(value) });
  };

  const handlePitchChange = (value: string) => {
    onSettingsChange({ ...settings, pitch: parseFloat(value) });
  };

  const handleVolumeChange = (value: string) => {
    onSettingsChange({ ...settings, volume: parseFloat(value) });
  };

  const handleVoiceChange = (voiceName: string) => {
    onSettingsChange({ ...settings, voiceName });
  };

  const handleAutoPlayToggle = () => {
    onSettingsChange({ ...settings, autoPlay: !settings.autoPlay });
  };

  const selectedVoice = voices.find((v) => v.name === settings.voiceName);

  return (
    <div className="space-y-3">
      {/* Quick Controls */}
      <div className="flex items-center gap-2">
        {isSpeaking && !isPaused && (
          <Button size="sm" variant="outline" onClick={onPause} className="gap-2">
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        )}

        {isSpeaking && isPaused && (
          <Button size="sm" variant="outline" onClick={onPlay} className="gap-2">
            <Play className="h-4 w-4" />
            Resume
          </Button>
        )}

        {isSpeaking && (
          <Button size="sm" variant="outline" onClick={onStop} className="gap-2">
            <VolumeX className="h-4 w-4" />
            Stop
          </Button>
        )}

        <Button
          size="sm"
          variant={settings.autoPlay ? 'default' : 'outline'}
          onClick={handleAutoPlayToggle}
          className="gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Auto-play {settings.autoPlay ? 'ON' : 'OFF'}
        </Button>

        {/* Settings Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Voice Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Text-to-Speech Settings</DialogTitle>
              <DialogDescription>
                Customize how the AI's responses sound
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Voice Selection */}
              <div className="space-y-2">
                <Label>Voice</Label>
                <Select value={settings.voiceName} onValueChange={handleVoiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVoice && (
                  <p className="text-xs text-muted-foreground">
                    {selectedVoice.lang} • {selectedVoice.localService ? 'Local' : 'Remote'}
                  </p>
                )}
              </div>

              <Separator />

              {/* Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Speed</Label>
                  <Badge variant="outline">{settings.rate.toFixed(1)}x</Badge>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Pitch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Pitch</Label>
                  <Badge variant="outline">{settings.pitch.toFixed(1)}</Badge>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => handlePitchChange(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Volume</Label>
                  <Badge variant="outline">{Math.round(settings.volume * 100)}%</Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleVolumeChange(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quiet</span>
                  <span>Loud</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Badge */}
      {isSpeaking && (
        <Badge variant="secondary" className="text-xs">
          <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
          {isPaused ? 'Paused' : 'Speaking...'}
        </Badge>
      )}
    </div>
  );
}
