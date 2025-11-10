/**
 * ProjectionPage
 * Main page for the Projection feature
 * Practice future scenarios through simulated conversations
 */

import { useState, useEffect } from 'react';
import { MessageSquare, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';
import { useAI } from '@/shared/hooks/useAI';
import { ScenarioSetup } from './components/ScenarioSetup';
import { ConversationView } from './components/ConversationView';
import { MessageInput } from './components/MessageInput';
import { VoiceControls } from './components/VoiceControls';
import { SessionList } from './components/SessionList';
import {
  loadSessions,
  createSession,
  deleteSession,
  getActiveSession,
  setActiveSessionId,
  addMessageToSession,
  loadVoiceSettings,
  saveVoiceSettings,
} from './utils/storage';
import {
  speak,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  isSpeaking as checkIsSpeaking,
  isPaused as checkIsPaused,
} from './utils/speech';
import {
  exportSessionAsMarkdown,
  exportSessionAsJSON,
  exportSessionAsText,
  downloadFile,
  copyToClipboard,
} from './utils/export';
import { OPENING_MESSAGES } from './constants';
import type { ProjectionSession, MeetingScenario, ConversationMessage, VoiceSettings } from './types';

export function ProjectionPage() {
  const { toast } = useToast();
  const { generateCompletion, isLoading } = useAI();

  const [activeSession, setActiveSession] = useState<ProjectionSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<ProjectionSession[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(loadVoiceSettings());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Load initial data
  useEffect(() => {
    setSavedSessions(loadSessions());
    const active = getActiveSession();
    setActiveSession(active);
  }, []);

  // Save voice settings when changed
  useEffect(() => {
    saveVoiceSettings(voiceSettings);
  }, [voiceSettings]);

  // Check speaking status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(checkIsSpeaking());
      setIsPaused(checkIsPaused());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle starting a new scenario
  const handleStartScenario = (scenario: MeetingScenario) => {
    // Create opening message from AI
    const openingMessage: ConversationMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: OPENING_MESSAGES[scenario.type] || OPENING_MESSAGES.custom,
      timestamp: new Date().toISOString(),
    };

    const newSession = createSession(scenario, openingMessage);
    setActiveSession(newSession);
    setSavedSessions(loadSessions());

    // Auto-play opening message if enabled
    if (voiceSettings.autoPlay) {
      handleSpeak(openingMessage.content);
    }

    toast({
      title: 'Simulation Started',
      description: `${scenario.title} is ready`,
    });
  };

  // Handle sending a user message
  const handleSendMessage = async (content: string) => {
    if (!activeSession) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    addMessageToSession(activeSession.id, userMessage);

    // Update local state
    const updated = loadSessions().find((s) => s.id === activeSession.id);
    if (updated) {
      setActiveSession(updated);
      setSavedSessions(loadSessions());
    }

    // Generate AI response
    try {
      const conversationHistory = [...(updated?.messages || []), userMessage];

      // Build conversation history for context
      const historyText = conversationHistory
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.role === 'user' ? 'You' : 'Participant'}: ${msg.content}`)
        .join('\n');

      const prompt = `You are simulating a realistic ${activeSession.scenario.type} scenario. You are playing the role of a ${activeSession.scenario.participantRole}.

${activeSession.scenario.context ? `SCENARIO CONTEXT: ${activeSession.scenario.context}` : ''}

${historyText ? `CONVERSATION HISTORY (this is critical context):\n${historyText}\n` : ''}

CURRENT USER MESSAGE: "${content}"

CRITICAL INSTRUCTIONS:
1. Stay in character as the ${activeSession.scenario.participantRole}
2. Respond DIRECTLY to what the user just said ("${content}")
3. Reference SPECIFIC details from their message - quote their exact words when relevant
4. Build on previous conversation - mention things discussed earlier
5. Ask relevant follow-up questions based on what they said
6. Be realistic and challenging but fair
7. Do NOT give generic responses - make every response specific to this exact conversation

Example of GOOD response: "You mentioned you have 5 years of experience in ${content.split(' ').slice(0, 3).join(' ')}. Can you tell me about a specific challenge you faced?"

Example of BAD response: "That's interesting. Tell me about yourself." (too generic, doesn't reference their actual message)

Your response as ${activeSession.scenario.participantRole}:`;

      const response = await generateCompletion(prompt, {
        temperature: 0.8,
        maxTokens: 300,
      }, async () => {
        // Fallback to template dialogue
        const { generateMeetingDialogueFallback } = await import('@/shared/services/fallbackGenerators');
        return generateMeetingDialogueFallback(
          activeSession.scenario.type,
          activeSession.scenario.participantRole,
          content,
          conversationHistory
        );
      });

      const assistantMessage: ConversationMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
      };

      addMessageToSession(activeSession.id, assistantMessage);

      // Update local state again
      const finalUpdated = loadSessions().find((s) => s.id === activeSession.id);
      if (finalUpdated) {
        setActiveSession(finalUpdated);
        setSavedSessions(loadSessions());
      }

      // Auto-play response if enabled
      if (voiceSettings.autoPlay) {
        handleSpeak(response.text);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle text-to-speech
  const handleSpeak = async (text: string) => {
    try {
      await speak(text, voiceSettings);
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  // Handle session selection
  const handleSessionSelect = (session: ProjectionSession) => {
    setActiveSession(session);
    setActiveSessionId(session.id);
  };

  // Handle session deletion
  const handleSessionDelete = (id: string) => {
    const success = deleteSession(id);

    if (success) {
      setSavedSessions(loadSessions());

      if (activeSession?.id === id) {
        setActiveSession(null);
      }
    }
  };

  // Handle creating new session
  const handleNewSession = () => {
    stopSpeaking();
    setActiveSession(null);
    setActiveSessionId(null);
  };

  // Handle export
  const handleExport = async (format: 'markdown' | 'json' | 'text', copy: boolean = false) => {
    if (!activeSession) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportSessionAsMarkdown(activeSession);
        filename = `${activeSession.scenario.title.substring(0, 30)}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = exportSessionAsJSON(activeSession);
        filename = `${activeSession.scenario.title.substring(0, 30)}.json`;
        mimeType = 'application/json';
        break;
      case 'text':
        content = exportSessionAsText(activeSession);
        filename = `${activeSession.scenario.title.substring(0, 30)}.txt`;
        mimeType = 'text/plain';
        break;
    }

    if (copy) {
      const success = await copyToClipboard(content);
      if (success) {
        toast({
          title: 'Copied!',
          description: `Conversation copied to clipboard as ${format.toUpperCase()}`,
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
        description: `Conversation exported as ${format.toUpperCase()}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Projection</h1>
          </div>

          {activeSession && (
            <div className="flex items-center gap-2">
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
                  <DropdownMenuItem onClick={() => handleExport('markdown', false)}>
                    Download Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json', false)}>
                    Download JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('text', false)}>
                    Download Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleNewSession} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New Scenario
              </Button>
            </div>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          Practice future scenarios through realistic simulated conversations
        </p>
      </div>

      {/* Active Session Header */}
      {activeSession && (
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-base">
              Active Scenario: {activeSession.scenario.title}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Scenario Setup */}
      {!activeSession && (
        <ScenarioSetup onStart={handleStartScenario}  />
      )}

      {/* Active Conversation */}
      {activeSession && (
        <div className="space-y-4">
          {/* Voice Controls */}
          <VoiceControls
            settings={voiceSettings}
            onSettingsChange={setVoiceSettings}
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            onPlay={resumeSpeaking}
            onPause={pauseSpeaking}
            onStop={stopSpeaking}
          />

          {/* Conversation View */}
          <ConversationView
            messages={activeSession.messages}
            participantRole={activeSession.scenario.participantRole}
            isLoading={isLoading}
          />

          {/* Message Input */}
          <MessageInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your response to the conversation..."
          />
        </div>
      )}

      {/* Saved Sessions */}
      {savedSessions.length > 0 && (
        <>
          <Separator />
          <SessionList
            sessions={savedSessions}
            activeSessionId={activeSession?.id || null}
            onSessionSelect={handleSessionSelect}
            onSessionDelete={handleSessionDelete}
          />
        </>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Choose a scenario</strong> - Select from templates (job interview, investor pitch, etc.) or create your own
          </p>
          <p>
            <strong>2. Provide context</strong> - Add details about your background, goals, and the specific situation
          </p>
          <p>
            <strong>3. Practice</strong> - Have a realistic back-and-forth conversation with AI simulating the other participant
          </p>
          <p>
            <strong>4. Listen & learn</strong> - Enable text-to-speech to hear responses spoken aloud for more realistic practice
          </p>
          <p>
            <strong>5. Export & review</strong> - Download your conversation to review your responses and improve
          </p>
          <p className="pt-2 border-t">
            <strong>💡 Tip:</strong> Take your time to respond thoughtfully. Use voice playback to practice hearing the conversation flow naturally.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
