/**
 * DebugPanel - Development testing and validation utility
 * Shows real-time state of settings, API keys, and provider status
 */

import { useState } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useAI } from '@/shared/hooks/useAI';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import {
  generateTasksFallback
} from '@/shared/services/fallbackGenerators';

export function DebugPanel() {
  const { settings, hasGroqApiKey, hasGeminiApiKey, hasAnyAIProvider } = useSettings();
  const { generateCompletion, isLoading, activeProvider } = useAI();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test 1: Check environment variable
  const testEnvVariable = () => {
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    const result = {
      exists: !!envKey,
      value: envKey ? `${envKey.substring(0, 10)}...${envKey.substring(envKey.length - 4)}` : 'NOT FOUND',
      length: envKey?.length || 0
    };
    setTestResults(prev => ({ ...prev, envVariable: result }));
    toast({
      title: result.exists ? '✅ Env Variable Found' : '❌ Env Variable Missing',
      description: JSON.stringify(result, null, 2)
    });
  };

  // Test 2: Check settings state
  const testSettings = () => {
    const result = {
      groqApiKey: settings.groqApiKey ? `${settings.groqApiKey.substring(0, 10)}...` : 'NOT SET',
      geminiApiKey: settings.geminiApiKey ? 'SET' : 'NOT SET',
      preferredAIProvider: settings.preferredAIProvider,
      hasGroqApiKey,
      hasGeminiApiKey,
      hasAnyAIProvider,
    };
    setTestResults(prev => ({ ...prev, settings: result }));
    toast({
      title: '⚙️ Settings State',
      description: JSON.stringify(result, null, 2)
    });
  };

  // Test 3: Test Groq API call
  const testGroqAPI = async () => {
    try {
      const startTime = Date.now();
      const response = await generateCompletion('Say "TEST SUCCESSFUL" and nothing else.', {
        temperature: 0.1,
        maxTokens: 50
      }, () => 'FALLBACK USED');

      const duration = Date.now() - startTime;
      const result = {
        provider: response.provider,
        responseText: response.text.substring(0, 100),
        duration: `${duration}ms`,
        success: response.provider === 'groq'
      };

      setTestResults(prev => ({ ...prev, groqAPI: result }));
      toast({
        title: result.success ? '✅ Groq API Works' : '❌ Groq API Failed',
        description: `Provider: ${response.provider}\nResponse: ${response.text.substring(0, 50)}...`
      });
    } catch (error) {
      const result = { error: error instanceof Error ? error.message : 'Unknown error' };
      setTestResults(prev => ({ ...prev, groqAPI: result }));
      toast({
        title: '❌ Groq API Error',
        description: JSON.stringify(result),
        variant: 'destructive'
      });
    }
  };

  // Test 4: Test Distillation task generation
  const testDistillation = async () => {
    try {
      const testGoal = "buying a car";
      const startTime = Date.now();

      const prompt = `You are a strategic productivity coach helping someone achieve this SPECIFIC goal: "${testGoal}"

CRITICAL: Generate tasks that are 100% relevant to "${testGoal}". Do NOT include generic academic research tasks like "search Google Scholar" unless the goal is explicitly academic. Focus on PRACTICAL, ACTIONABLE steps specific to this exact goal.

Generate 3 specific tasks for: "${testGoal}"`;

      const response = await generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 500
      }, async () => {
        const { generateTasksFallback } = await import('@/shared/services/fallbackGenerators');
        const tasks = generateTasksFallback(testGoal, 'strategic');
        return tasks.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
      });

      const duration = Date.now() - startTime;
      const result = {
        provider: response.provider,
        responsePreview: response.text.substring(0, 200),
        containsGoogleScholar: response.text.toLowerCase().includes('google scholar'),
        duration: `${duration}ms`,
        success: response.provider === 'groq' && !response.text.toLowerCase().includes('google scholar')
      };

      setTestResults(prev => ({ ...prev, distillation: result }));
      toast({
        title: result.success ? '✅ Distillation Works' : '⚠️ Distillation Issues',
        description: `Provider: ${response.provider}\nGoogle Scholar: ${result.containsGoogleScholar ? 'FOUND (BAD)' : 'Not found (GOOD)'}`
      });
    } catch (error) {
      const result = { error: error instanceof Error ? error.message : 'Unknown error' };
      setTestResults(prev => ({ ...prev, distillation: result }));
      toast({
        title: '❌ Distillation Error',
        description: JSON.stringify(result),
        variant: 'destructive'
      });
    }
  };

  // Test 5: Test fallback templates
  const testFallbackTemplates = () => {
    const testGoal = "buying a car";
    const tasks = generateTasksFallback(testGoal, 'strategic');

    const hasGoogleScholar = tasks.some(t => t.text.toLowerCase().includes('google scholar'));
    const hasGoalReference = tasks.some(t => t.text.includes(testGoal));

    const result = {
      tasksGenerated: tasks.length,
      containsGoogleScholar: hasGoogleScholar,
      containsGoalReference: hasGoalReference,
      firstTaskPreview: tasks[0]?.text.substring(0, 100),
      success: !hasGoogleScholar && hasGoalReference && tasks.length >= 6
    };

    setTestResults(prev => ({ ...prev, fallbackTemplates: result }));
    toast({
      title: result.success ? '✅ Templates Work' : '❌ Template Issues',
      description: `Tasks: ${tasks.length}\nGoogle Scholar: ${hasGoogleScholar ? 'FOUND (BAD)' : 'Not found (GOOD)'}\nGoal ref: ${hasGoalReference ? 'Yes' : 'No'}`
    });
  };

  // Test 6: Test localStorage for Culmination
  const testCulminationStorage = () => {
    try {
      // Test write
      const testData = {
        id: 'test-portfolio-' + Date.now(),
        title: 'Test Portfolio',
        achievements: [
          { id: 'test-1', title: 'Test Achievement', status: 'achieved' }
        ]
      };

      localStorage.setItem('gws:test:portfolio', JSON.stringify(testData));

      // Test read
      const retrieved = JSON.parse(localStorage.getItem('gws:test:portfolio') || '{}');

      // Cleanup
      localStorage.removeItem('gws:test:portfolio');

      const result = {
        writeSuccess: true,
        readSuccess: retrieved.id === testData.id,
        achievementsPreserved: retrieved.achievements?.length === 1,
        success: true
      };

      setTestResults(prev => ({ ...prev, culminationStorage: result }));
      toast({
        title: '✅ localStorage Works',
        description: JSON.stringify(result, null, 2)
      });
    } catch (error) {
      const result = { error: error instanceof Error ? error.message : 'Unknown error', success: false };
      setTestResults(prev => ({ ...prev, culminationStorage: result }));
      toast({
        title: '❌ localStorage Error',
        description: JSON.stringify(result),
        variant: 'destructive'
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults({});
    testEnvVariable();
    await new Promise(resolve => setTimeout(resolve, 500));
    testSettings();
    await new Promise(resolve => setTimeout(resolve, 500));
    testFallbackTemplates();
    await new Promise(resolve => setTimeout(resolve, 500));
    testCulminationStorage();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testGroqAPI();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testDistillation();
  };

  return (
    <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Debug & Test Panel
          <Badge variant="outline">Development Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Current Status</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Active Provider:</div>
            <div><Badge>{activeProvider}</Badge></div>
            <div>Groq API Key:</div>
            <div>{hasGroqApiKey ? '✅ Set' : '❌ Missing'}</div>
            <div>Gemini API Key:</div>
            <div>{hasGeminiApiKey ? '✅ Set' : '❌ Missing'}</div>
            <div>Loading:</div>
            <div>{isLoading ? '⏳ Yes' : '✅ No'}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <h3 className="font-semibold">Run Tests</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={testEnvVariable} size="sm" variant="outline">
              1. Test Env Variable
            </Button>
            <Button onClick={testSettings} size="sm" variant="outline">
              2. Test Settings
            </Button>
            <Button onClick={testFallbackTemplates} size="sm" variant="outline">
              3. Test Templates
            </Button>
            <Button onClick={testCulminationStorage} size="sm" variant="outline">
              4. Test localStorage
            </Button>
            <Button onClick={testGroqAPI} size="sm" variant="outline" disabled={isLoading}>
              5. Test Groq API
            </Button>
            <Button onClick={testDistillation} size="sm" variant="outline" disabled={isLoading}>
              6. Test Distillation
            </Button>
          </div>
          <Button onClick={runAllTests} className="w-full" disabled={isLoading}>
            🚀 Run All Tests
          </Button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            <pre className="bg-black text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
