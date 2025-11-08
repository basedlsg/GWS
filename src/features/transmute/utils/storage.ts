/**
 * Transmute localStorage Utilities
 * Manages persistence of transmutations and drafts
 */

import { getItem, setItem } from '@/shared/utils/localStorage';
import type { Transmutation } from '../types';
import { TRANSMUTATIONS_STORAGE_KEY, DRAFT_STORAGE_KEY, MAX_SAVED_TRANSMUTATIONS } from '../constants';

/**
 * Draft state for current work in progress
 */
export interface TransmuteDraft {
  text: string;
  theme: string;
  language: string;
  title: string;
}

/**
 * Load all saved transmutations
 */
export function loadTransmutations(): Transmutation[] {
  return getItem<Transmutation[]>(TRANSMUTATIONS_STORAGE_KEY, []);
}

/**
 * Save a new transmutation
 */
export function saveTransmutation(transmutation: Omit<Transmutation, 'id' | 'createdAt' | 'updatedAt'>): Transmutation {
  const transmutations = loadTransmutations();

  const newTransmutation: Transmutation = {
    ...transmutation,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to beginning of array (most recent first)
  const updated = [newTransmutation, ...transmutations];

  // Enforce max limit
  const trimmed = updated.slice(0, MAX_SAVED_TRANSMUTATIONS);

  setItem(TRANSMUTATIONS_STORAGE_KEY, trimmed);

  return newTransmutation;
}

/**
 * Update an existing transmutation
 */
export function updateTransmutation(id: string, updates: Partial<Omit<Transmutation, 'id' | 'createdAt'>>): boolean {
  const transmutations = loadTransmutations();
  const index = transmutations.findIndex(t => t.id === id);

  if (index === -1) {
    return false;
  }

  transmutations[index] = {
    ...transmutations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Transmutation;

  return setItem(TRANSMUTATIONS_STORAGE_KEY, transmutations);
}

/**
 * Delete a transmutation
 */
export function deleteTransmutation(id: string): boolean {
  const transmutations = loadTransmutations();
  const filtered = transmutations.filter(t => t.id !== id);

  if (filtered.length === transmutations.length) {
    return false; // Nothing was deleted
  }

  return setItem(TRANSMUTATIONS_STORAGE_KEY, filtered);
}

/**
 * Load the current draft
 */
export function loadDraft(): TransmuteDraft | null {
  return getItem<TransmuteDraft | null>(DRAFT_STORAGE_KEY, null);
}

/**
 * Save the current draft
 */
export function saveDraft(draft: TransmuteDraft): boolean {
  return setItem(DRAFT_STORAGE_KEY, draft);
}

/**
 * Clear the current draft
 */
export function clearDraft(): boolean {
  return setItem(DRAFT_STORAGE_KEY, null);
}

/**
 * Generate a unique ID for a transmutation
 */
function generateId(): string {
  return `transmute_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Export transmutations as JSON
 */
export function exportTransmutationsJSON(): string {
  const transmutations = loadTransmutations();
  return JSON.stringify(transmutations, null, 2);
}

/**
 * Import transmutations from JSON
 */
export function importTransmutationsJSON(json: string): { success: boolean; count: number; error?: string } {
  try {
    const imported = JSON.parse(json) as Transmutation[];

    if (!Array.isArray(imported)) {
      return { success: false, count: 0, error: 'Invalid format: expected an array' };
    }

    // Validate structure
    const valid = imported.every(
      t =>
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        typeof t.originalText === 'string' &&
        typeof t.theme === 'string' &&
        typeof t.language === 'string'
    );

    if (!valid) {
      return { success: false, count: 0, error: 'Invalid transmutation structure' };
    }

    const existing = loadTransmutations();
    const merged = [...imported, ...existing];
    const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());
    const trimmed = unique.slice(0, MAX_SAVED_TRANSMUTATIONS);

    setItem(TRANSMUTATIONS_STORAGE_KEY, trimmed);

    return { success: true, count: imported.length };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
