/**
 * Safe localStorage utilities with error handling and type safety
 */

import { STORAGE_LIMITS } from './constants';

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
}

/**
 * Safely get an item from localStorage with JSON parsing
 * @param key - localStorage key
 * @param defaultValue - default value if key doesn't exist or parsing fails
 * @returns parsed value or default value
 */
export function getItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with JSON serialization
 * @param key - localStorage key
 * @param value - value to store
 * @returns true if successful, false otherwise
 */
export function setItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage not available, cannot save:', key);
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);

    // Check if we're approaching storage limit
    const percentage = getStoragePercentage();
    if (percentage > 80) {
      console.warn(
        `localStorage usage is at ${percentage.toFixed(1)}%. Consider clearing old data.`
      );
    }

    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Cannot save data.');
    } else {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - localStorage key to remove
 */
export function removeItem(key: string): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all localStorage items with the app prefix
 */
export function clearAppStorage(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith('gws:'));

    appKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Cleared ${appKeys.length} app storage items`);
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
}

/**
 * Get approximate size of localStorage in bytes
 * @returns size in bytes
 */
export function getStorageSize(): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          // Each character is ~2 bytes in UTF-16
          total += key.length + value.length;
        }
      }
    }
    return total * 2; // Convert to bytes
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}

/**
 * Get percentage of storage quota used
 * @returns percentage (0-100)
 */
export function getStoragePercentage(): number {
  const size = getStorageSize();
  const limit = STORAGE_LIMITS.WARNING_THRESHOLD;
  return (size / limit) * 100;
}

/**
 * Get formatted storage size string
 * @returns human-readable size string (e.g., "1.2 MB")
 */
export function getFormattedStorageSize(): string {
  const bytes = getStorageSize();

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if storage is near quota limit
 * @returns true if usage is above 80%
 */
export function isStorageNearLimit(): boolean {
  return getStoragePercentage() > 80;
}

/**
 * Get all keys with a specific prefix
 * @param prefix - key prefix to filter by
 * @returns array of matching keys
 */
export function getKeysByPrefix(prefix: string): string[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage).filter(key => key.startsWith(prefix));
  } catch (error) {
    console.error('Error getting keys by prefix:', error);
    return [];
  }
}

/**
 * Export all app data as JSON
 * @returns JSON string of all app data
 */
export function exportAllData(): string {
  if (!isStorageAvailable()) {
    return '{}';
  }

  try {
    const data: Record<string, unknown> = {};
    const appKeys = getKeysByPrefix('gws:');

    appKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return '{}';
  }
}

/**
 * Import data from JSON string
 * @param jsonString - JSON string to import
 * @returns true if successful, false otherwise
 */
export function importData(jsonString: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('gws:')) {
        setItem(key, value);
      }
    });

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
