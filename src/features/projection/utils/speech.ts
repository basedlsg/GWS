/**
 * Speech Utilities
 * Text-to-speech functionality using Web Speech API
 */

import type { VoiceSettings } from '../types';

/**
 * Check if text-to-speech is supported
 */
export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Speak text with given settings
 */
export function speak(text: string, settings: VoiceSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isTTSSupported()) {
      reject(new Error('Text-to-speech is not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply settings
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Set voice if specified
    if (settings.voiceName) {
      const voices = getAvailableVoices();
      const voice = voices.find((v) => v.name === settings.voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Pause speech
 */
export function pauseSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume speech
 */
export function resumeSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.resume();
  }
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  if (!isTTSSupported()) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Check if speech is paused
 */
export function isPaused(): boolean {
  if (!isTTSSupported()) return false;
  return window.speechSynthesis.paused;
}

/**
 * Get a default voice
 */
export function getDefaultVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();

  // Try to find an English voice
  const englishVoice = voices.find((v) => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  // Otherwise return first available voice
  return voices[0] || null;
}

/**
 * Group voices by language
 */
export function groupVoicesByLanguage(): Record<string, SpeechSynthesisVoice[]> {
  const voices = getAvailableVoices();
  const grouped: Record<string, SpeechSynthesisVoice[]> = {};

  voices.forEach((voice) => {
    const lang = voice.lang.split('-')[0] || 'other';
    if (!grouped[lang]) {
      grouped[lang] = [];
    }
    grouped[lang].push(voice);
  });

  return grouped;
}
