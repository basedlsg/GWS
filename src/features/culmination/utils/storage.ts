/**
 * Culmination Storage Utilities
 * Handle persistence of portfolios and achievements in localStorage
 */

import type { Portfolio, Achievement, PortfolioStats } from '../types';
import { STORAGE_KEYS, MAX_PORTFOLIOS } from '../constants';

/**
 * Load all portfolios from localStorage
 */
export function loadPortfolios(): Portfolio[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
    if (!stored) return [];

    const portfolios = JSON.parse(stored) as Portfolio[];
    return portfolios.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to load portfolios:', error);
    return [];
  }
}

/**
 * Save portfolios to localStorage
 */
function savePortfolios(portfolios: Portfolio[]): boolean {
  try {
    // Limit number of portfolios
    const limited = portfolios.slice(0, MAX_PORTFOLIOS);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Failed to save portfolios:', error);
    return false;
  }
}

/**
 * Create a new portfolio
 */
export function createPortfolio(
  title: string,
  description: string,
  theme: Portfolio['theme'],
  layout: Portfolio['layout']
): Portfolio {
  const now = new Date().toISOString();
  const newPortfolio: Portfolio = {
    id: generateId(),
    title,
    description,
    achievements: [],
    theme,
    layout,
    createdAt: now,
    updatedAt: now,
    isPublic: false,
  };

  const portfolios = loadPortfolios();
  portfolios.unshift(newPortfolio);
  savePortfolios(portfolios);

  // Set as active portfolio
  setActivePortfolioId(newPortfolio.id);

  return newPortfolio;
}

/**
 * Update an existing portfolio
 */
export function updatePortfolio(id: string, updates: Partial<Portfolio>): boolean {
  const portfolios = loadPortfolios();
  const index = portfolios.findIndex((p) => p.id === id);

  if (index === -1) return false;

  portfolios[index] = {
    ...portfolios[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Portfolio;

  return savePortfolios(portfolios);
}

/**
 * Delete a portfolio
 */
export function deletePortfolio(id: string): boolean {
  const portfolios = loadPortfolios();
  const filtered = portfolios.filter((p) => p.id !== id);

  if (filtered.length === portfolios.length) return false;

  // Clear active if deleted
  const activeId = getActivePortfolioId();
  if (activeId === id) {
    setActivePortfolioId(null);
  }

  return savePortfolios(filtered);
}

/**
 * Add achievement to portfolio
 */
export function addAchievementToPortfolio(
  portfolioId: string,
  achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>
): Achievement | null {
  const portfolios = loadPortfolios();
  const portfolio = portfolios.find((p) => p.id === portfolioId);

  if (!portfolio) return null;

  const now = new Date().toISOString();
  const newAchievement: Achievement = {
    ...achievement,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  portfolio.achievements.push(newAchievement);
  portfolio.updatedAt = now;

  savePortfolios(portfolios);
  return newAchievement;
}

/**
 * Update achievement in portfolio
 */
export function updateAchievementInPortfolio(
  portfolioId: string,
  achievementId: string,
  updates: Partial<Achievement>
): boolean {
  const portfolios = loadPortfolios();
  const portfolio = portfolios.find((p) => p.id === portfolioId);

  if (!portfolio) return false;

  const achievementIndex = portfolio.achievements.findIndex((a) => a.id === achievementId);
  if (achievementIndex === -1) return false;

  portfolio.achievements[achievementIndex] = {
    ...portfolio.achievements[achievementIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as Achievement;

  portfolio.updatedAt = new Date().toISOString();

  return savePortfolios(portfolios);
}

/**
 * Delete achievement from portfolio
 */
export function deleteAchievementFromPortfolio(
  portfolioId: string,
  achievementId: string
): boolean {
  const portfolios = loadPortfolios();
  const portfolio = portfolios.find((p) => p.id === portfolioId);

  if (!portfolio) return false;

  const filtered = portfolio.achievements.filter((a) => a.id !== achievementId);
  if (filtered.length === portfolio.achievements.length) return false;

  portfolio.achievements = filtered;
  portfolio.updatedAt = new Date().toISOString();

  return savePortfolios(portfolios);
}

/**
 * Get active portfolio ID
 */
export function getActivePortfolioId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PORTFOLIO);
  } catch {
    return null;
  }
}

/**
 * Set active portfolio ID
 */
export function setActivePortfolioId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PORTFOLIO);
    }
  } catch (error) {
    console.error('Failed to set active portfolio:', error);
  }
}

/**
 * Get active portfolio
 */
export function getActivePortfolio(): Portfolio | null {
  const activeId = getActivePortfolioId();
  if (!activeId) return null;

  const portfolios = loadPortfolios();
  return portfolios.find((p) => p.id === activeId) || null;
}

/**
 * Save draft achievement
 */
export function saveDraftAchievement(achievement: Partial<Achievement>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_ACHIEVEMENT, JSON.stringify(achievement));
  } catch (error) {
    console.error('Failed to save draft achievement:', error);
  }
}

/**
 * Load draft achievement
 */
export function loadDraftAchievement(): Partial<Achievement> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFT_ACHIEVEMENT);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Clear draft achievement
 */
export function clearDraftAchievement(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_ACHIEVEMENT);
  } catch (error) {
    console.error('Failed to clear draft achievement:', error);
  }
}

/**
 * Calculate portfolio statistics
 */
export function calculatePortfolioStats(portfolio: Portfolio): PortfolioStats {
  const { achievements } = portfolio;

  const envisionedCount = achievements.filter((a) => a.status === 'envisioned').length;
  const inProgressCount = achievements.filter((a) => a.status === 'in_progress').length;
  const achievedCount = achievements.filter((a) => a.status === 'achieved').length;

  const categoryCounts = {
    career: achievements.filter((a) => a.category === 'career').length,
    business: achievements.filter((a) => a.category === 'business').length,
    creative: achievements.filter((a) => a.category === 'creative').length,
    personal: achievements.filter((a) => a.category === 'personal').length,
    health: achievements.filter((a) => a.category === 'health').length,
    financial: achievements.filter((a) => a.category === 'financial').length,
    social: achievements.filter((a) => a.category === 'social').length,
    education: achievements.filter((a) => a.category === 'education').length,
  };

  const completionRate =
    achievements.length > 0 ? (achievedCount / achievements.length) * 100 : 0;

  return {
    totalAchievements: achievements.length,
    envisionedCount,
    inProgressCount,
    achievedCount,
    categoryCounts,
    completionRate,
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Export all data (for backup)
 */
export function exportAllData(): string {
  const portfolios = loadPortfolios();
  return JSON.stringify(
    {
      version: 1,
      exportDate: new Date().toISOString(),
      portfolios,
    },
    null,
    2
  );
}

/**
 * Import data (from backup)
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (!data.portfolios || !Array.isArray(data.portfolios)) {
      throw new Error('Invalid data format');
    }

    return savePortfolios(data.portfolios);
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
