# The Great Work Suite - Architectural Reference

## Project Overview

**The Great Work Suite** is a comprehensive manifestation and productivity platform consisting of four integrated applications, all running as a single-page React application. The suite is designed to be entirely client-side with no authentication or database requirements, making it lightweight, privacy-focused, and instantly deployable.

### The Four Applications

#### 1. Transmute
**Purpose:** Transform plain text code into beautifully styled, presentation-ready code blocks

**Features:**
- Paste raw code and instantly get cyberpunk-aesthetic styled output
- Syntax highlighting with a distinctive cyberpunk color scheme
- Multiple export formats (image, HTML, markdown)
- Customizable themes within the cyberpunk aesthetic family
- Copy-to-clipboard functionality
- Support for 20+ programming languages

**Design Philosophy:** Dark, neon-accented, Matrix-inspired visual treatment. Think glowing green/cyan text on deep blacks with occasional magenta/purple accents.

#### 2. Distillation
**Purpose:** Convert abstract goals and vague ambitions into concrete, actionable task lists

**Features:**
- Input high-level goals or abstract desires
- AI-powered breakdown into specific, measurable tasks
- Task prioritization and dependency mapping
- Progress tracking with localStorage persistence
- Optional Gemini API integration for intelligent task generation
- Functional fallback using template-based task generation
- Export tasks to various formats (markdown, JSON, plain text)

**Design Philosophy:** Clean, professional interface focused on clarity and action. Uses Gemini 2.5 Pro API when available, but gracefully degrades to rule-based task generation.

#### 3. Projection
**Purpose:** Practice future scenarios through simulated conversations and meetings

**Features:**
- Define a future scenario (job interview, pitch meeting, difficult conversation)
- AI generates realistic dialogue simulations
- Text-to-speech using Web Speech API for realistic practice
- Multiple perspective simulation (interviewer, investor, manager, etc.)
- Scenario templates for common situations
- Record and review session history
- Performance feedback and improvement suggestions

**Design Philosophy:** Immersive and focused. Interface should fade into the background during simulations. Uses Gemini API for generating realistic dialogue with template-based fallback.

#### 4. Culmination
**Purpose:** Visualize and document future achievements as if they've already happened

**Features:**
- Create mock portfolios showcasing imagined completed projects
- Generate success narratives and achievement timelines
- Visual mockups of future accomplishments
- Inspirational dashboard combining all visualizations
- Export capabilities for vision boarding
- Rich text editor for detailed success stories

**Design Philosophy:** Aspirational and polished. Should feel like looking at a successful person's portfolio. Emphasis on visual impact and emotional resonance.

---

## Tech Stack

### Core Framework
**React 18.3+ with TypeScript 5.0+**
- **Rationale:** Industry standard for complex SPAs, excellent TypeScript support, robust ecosystem
- **Mode:** Strict mode enabled for all TypeScript compilation
- **Component Style:** Functional components exclusively with React Hooks

### Build Tool
**Vite 5.0+**
- **Rationale:** Fastest dev server, optimal production builds, native ESM support
- **Benefits:** Instant HMR, minimal configuration, excellent TypeScript integration
- **Build Target:** ES2020+ for modern browsers

### Styling
**Tailwind CSS 3.4+ with shadcn/ui**
- **Rationale:** Utility-first CSS for rapid development, shadcn/ui for high-quality prebuilt components
- **Customization:** Extended Tailwind config for cyberpunk themes and custom color palettes
- **Components:** All UI components from shadcn/ui library (buttons, dialogs, forms, etc.)

### Routing
**React Router 6.20+**
- **Rationale:** Standard routing solution with excellent TypeScript support
- **Structure:** Feature-based routing with lazy loading for code splitting
- **Routes:**
  - `/` - Landing page with suite overview
  - `/transmute` - Transmute application
  - `/distillation` - Distillation application
  - `/projection` - Projection application
  - `/culmination` - Culmination application
  - `/settings` - Global settings (API keys, preferences)

### State Management
**React Context API + Custom Hooks**
- **Rationale:** Sufficient for client-side-only app, no external state management needed
- **Global State:** Settings, API keys, theme preferences
- **Local State:** Component-specific data, form inputs
- **Persistence:** Custom hooks wrapping localStorage operations

### Data Persistence
**localStorage with JSON serialization**
- **Rationale:** No backend needed, instant access, sufficient for client-side app
- **Structure:** Namespaced keys (`gws:transmute:*`, `gws:distillation:*`, etc.)
- **Size Management:** Monitoring and warnings when approaching 5MB limit
- **Migration:** Version tracking for future schema changes

### AI Integration
**Gemini 2.5 Pro API (Optional)**
- **Rationale:** Powerful, cost-effective, generous free tier
- **Usage:** Distillation task generation, Projection dialogue simulation
- **Fallback:** Template-based generation when API unavailable or key not provided
- **Safety:** API keys stored in localStorage, never sent to any server except Google

### Text-to-Speech
**Web Speech API (SpeechSynthesis)**
- **Rationale:** Native browser API, no external dependencies, zero cost
- **Usage:** Projection app for realistic dialogue practice
- **Features:** Voice selection, rate/pitch control, pause/resume
- **Compatibility:** Graceful degradation with visual-only mode

### Deployment
**Vercel**
- **Rationale:** Zero-config deployment, excellent Vite support, generous free tier
- **Process:** Git push triggers automatic deployment
- **Environment:** No environment variables needed (client-side only)

---

## Architecture Decisions

### 1. No Authentication System
**Decision:** Completely client-side application with no user accounts

**Rationale:**
- Eliminates complexity and maintenance burden
- Ensures privacy (no data sent to servers)
- Instant usability (no signup friction)
- Reduces attack surface

**Implications:**
- All data stored locally in browser
- No cross-device sync (acceptable tradeoff)
- Users responsible for data backup/export
- No user analytics or tracking

### 2. No Database / Backend
**Decision:** Pure client-side application using localStorage

**Rationale:**
- Simplifies deployment and hosting
- Zero backend costs
- Instant data access with no latency
- Privacy-first architecture

**Implications:**
- 5-10MB storage limit per domain
- No server-side processing
- Export/import features critical for data portability
- Gemini API called directly from browser (CORS permitting)

### 3. Google APIs Future Integration
**Decision:** Design for future integration but don't implement initially

**Rationale:**
- Avoid scope creep in v1
- OAuth flow adds complexity
- Most features work without Google integration

**Future Possibilities:**
- Google Calendar integration (Distillation tasks)
- Google Docs export (Culmination portfolios)
- Google Drive backup (all data)

**Design Consideration:** Abstract data access layer to make integration easier later

### 4. Gemini API as Optional Enhancement
**Decision:** All features must work without Gemini API

**Rationale:**
- Users shouldn't need API key to use app
- API costs shouldn't be barrier to entry
- Template-based fallbacks provide value

**Implementation:**
- Check for API key in settings
- Show prompt to add key for enhanced features
- Graceful fallback to rule-based generation
- Clear UX indication of which mode is active

### 5. Single-Page Application
**Decision:** One React app with client-side routing

**Rationale:**
- Shared components and state
- Seamless navigation between tools
- Unified styling and UX
- Simpler deployment

**Code Splitting:**
- Lazy load each application route
- Shared components in core bundle
- Dynamic imports for large dependencies

---

## File Structure

```
gws/
├── .claude/
│   └── CLAUDE.md                 # This file - architectural reference
├── public/
│   ├── favicon.ico
│   └── assets/                   # Static images, fonts
├── src/
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Root component with router
│   ├── vite-env.d.ts            # Vite type definitions
│   │
│   ├── features/                 # Feature-based organization
│   │   ├── transmute/
│   │   │   ├── components/      # Transmute-specific components
│   │   │   ├── hooks/           # Transmute-specific hooks
│   │   │   ├── utils/           # Transmute utilities
│   │   │   ├── types.ts         # Transmute TypeScript types
│   │   │   └── TransmutePage.tsx
│   │   │
│   │   ├── distillation/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types.ts
│   │   │   └── DistillationPage.tsx
│   │   │
│   │   ├── projection/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types.ts
│   │   │   └── ProjectionPage.tsx
│   │   │
│   │   ├── culmination/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types.ts
│   │   │   └── CulminationPage.tsx
│   │   │
│   │   └── landing/
│   │       ├── components/
│   │       └── LandingPage.tsx
│   │
│   ├── shared/                   # Shared across features
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── hooks/               # Shared custom hooks
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useGeminiAPI.ts
│   │   │   └── useSpeechSynthesis.ts
│   │   │
│   │   ├── context/             # Global context providers
│   │   │   ├── SettingsContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── utils/               # Shared utilities
│   │   │   ├── localStorage.ts
│   │   │   ├── export.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── types/               # Shared TypeScript types
│   │       ├── common.ts
│   │       └── api.ts
│   │
│   ├── styles/
│   │   ├── globals.css          # Global styles, Tailwind imports
│   │   └── themes/              # Theme configurations
│   │       ├── cyberpunk.css
│   │       └── default.css
│   │
│   └── lib/                      # Third-party integrations
│       ├── gemini.ts            # Gemini API client
│       └── speech.ts            # Web Speech API wrapper
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### File Structure Conventions

1. **Feature-based organization:** Each app gets its own directory under `features/`
2. **Colocation:** Keep related files close (components, hooks, utils within feature)
3. **Shared code:** Only share when used by 2+ features
4. **Index exports:** Use barrel exports sparingly, prefer explicit imports
5. **Test adjacency:** Place tests adjacent to source files with `.test.ts(x)` suffix

---

## Code Style Guide

### TypeScript Standards

**Strict Mode:** All code must compile with `strict: true`

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Annotations:**
- Explicit return types for exported functions
- Inferred types for local variables when obvious
- No `any` types (use `unknown` and narrow)
- Prefer interfaces for object shapes, types for unions/primitives

```typescript
// Good
export function processGoal(goal: string): Task[] {
  const tasks: Task[] = [];
  // ...
  return tasks;
}

// Avoid
export function processGoal(goal: any): any {
  // ...
}
```

### Component Conventions

**Function Components Only:** No class components

```typescript
// Good - Named export with explicit props interface
interface TransmuteEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
}

export function TransmuteEditor({ code, language, onChange }: TransmuteEditorProps) {
  // Component implementation
  return <div>...</div>;
}
```

**Component File Structure:**
1. Imports (React, third-party, local)
2. Type definitions
3. Component definition
4. Styled components (if any)
5. Helper functions (if not extracted)

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `TaskList.tsx`)
- Hooks: `camelCase.ts` starting with "use" (e.g., `useLocalStorage.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` or `types.ts`
- Constants: `UPPER_SNAKE_CASE` or `constants.ts`

**Variables:**
- `camelCase` for variables and functions
- `PascalCase` for components and types/interfaces
- `UPPER_SNAKE_CASE` for true constants

**Boolean Naming:**
- Prefix with `is`, `has`, `should`, `can`
- Examples: `isLoading`, `hasError`, `shouldShowModal`, `canSubmit`

### Import Organization

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// 3. Absolute imports from src
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Task } from '@/shared/types/common';

// 4. Relative imports
import { TaskItem } from './TaskItem';
import { formatTask } from './utils';

// 5. Type-only imports (if needed separately)
import type { TaskStatus } from './types';
```

### React Hooks Rules

**Dependencies:** Always include all dependencies in dependency arrays

```typescript
// Good
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Bad - missing dependency
useEffect(() => {
  fetchData(userId);
}, []);
```

**Custom Hooks:**
- Start with "use"
- Return arrays for 2 values, objects for 3+
- Document complex hooks with JSDoc

```typescript
/**
 * Manages localStorage with automatic JSON serialization
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Implementation
  return [value, setValue] as const;
}
```

### Error Handling

**Always handle errors explicitly:**

```typescript
// API calls
try {
  const result = await callGeminiAPI(prompt);
  return result;
} catch (error) {
  console.error('Gemini API error:', error);
  return generateFallbackResponse(prompt);
}

// localStorage operations
try {
  const data = JSON.parse(localStorage.getItem(key) ?? '{}');
  return data;
} catch (error) {
  console.error('localStorage parse error:', error);
  return defaultValue;
}
```

### Comments and Documentation

**JSDoc for exported functions:**

```typescript
/**
 * Converts abstract goal text into structured tasks
 * @param goal - User's goal description
 * @param options - Configuration options for task generation
 * @returns Array of generated tasks with priorities
 */
export function distillGoal(goal: string, options: DistillOptions): Task[] {
  // Implementation
}
```

**Inline comments for complex logic:**

```typescript
// Extract code language from first line if specified (e.g., ```python)
const languageMatch = code.match(/^```(\w+)/);
const detectedLanguage = languageMatch?.[1] ?? 'plaintext';
```

**No obvious comments:**

```typescript
// Bad
// Increment counter by 1
counter += 1;

// Good - no comment needed
counter += 1;
```

---

## Component Patterns

### Presentational vs Container Components

**Presentational Components:**
- Pure rendering logic
- Receive data via props
- No side effects or data fetching
- Highly reusable

```typescript
interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string) => void;
}

export function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onComplete={onTaskComplete} />
      ))}
    </ul>
  );
}
```

**Container Components:**
- Handle data fetching and state
- Orchestrate presentational components
- Contain business logic

```typescript
export function DistillationPage() {
  const [goal, setGoal] = useState('');
  const [tasks, setTasks] = useLocalStorage<Task[]>('gws:distillation:tasks', []);
  const { generateTasks } = useGeminiAPI();

  const handleSubmit = async () => {
    const newTasks = await generateTasks(goal);
    setTasks([...tasks, ...newTasks]);
  };

  return (
    <div>
      <GoalInput value={goal} onChange={setGoal} onSubmit={handleSubmit} />
      <TaskList tasks={tasks} onTaskComplete={handleTaskComplete} />
    </div>
  );
}
```

### Composition Patterns

**Compound Components:**

```typescript
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pb-0">{children}</div>;
};

Card.Content = function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

**Render Props (when needed):**

```typescript
interface DataFetcherProps<T> {
  fetchFn: () => Promise<T>;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher<T>({ fetchFn, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetchFn]);

  return <>{children(data, loading, error)}</>;
}
```

### Custom Hook Patterns

**State + Side Effect:**

```typescript
export function useTaskPersistence(featureKey: string) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(`gws:${featureKey}:tasks`, []);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, [setTasks]);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTasks]);

  return { tasks, addTask, removeTask, updateTask };
}
```

### Form Handling

**Controlled inputs with validation:**

```typescript
export function GoalInputForm({ onSubmit }: { onSubmit: (goal: string) => void }) {
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (goal.trim().length < 10) {
      setError('Goal must be at least 10 characters');
      return;
    }

    setError('');
    onSubmit(goal);
    setGoal('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal..."
        className="w-full p-4"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Generate Tasks</button>
    </form>
  );
}
```

---

## State Management

### Global State: Context API

**Settings Context:**

```typescript
// src/shared/context/SettingsContext.tsx

interface Settings {
  geminiApiKey?: string;
  preferredVoice?: string;
  theme: 'light' | 'dark' | 'cyberpunk';
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('gws:settings', {
    theme: 'dark',
  });

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
```

### Local State: Component State

**Guidelines:**
- Use `useState` for simple component state
- Use `useReducer` for complex state with multiple sub-values
- Lift state only when needed by multiple components
- Keep state as local as possible

### localStorage Persistence

**Namespacing Convention:**
```
gws:{feature}:{dataType}

Examples:
gws:settings
gws:transmute:snippets
gws:distillation:tasks
gws:projection:scenarios
gws:culmination:portfolios
```

**Versioning for Migrations:**

```typescript
interface StorageData<T> {
  version: number;
  data: T;
}

export function useVersionedStorage<T>(
  key: string,
  currentVersion: number,
  initialValue: T,
  migrate?: (oldVersion: number, oldData: any) => T
) {
  const [storedData, setStoredData] = useLocalStorage<StorageData<T>>(
    key,
    { version: currentVersion, data: initialValue }
  );

  useEffect(() => {
    if (storedData.version < currentVersion && migrate) {
      const migratedData = migrate(storedData.version, storedData.data);
      setStoredData({ version: currentVersion, data: migratedData });
    }
  }, [storedData.version, currentVersion]);

  return [storedData.data, (data: T) => setStoredData({ version: currentVersion, data })];
}
```

**Storage Quota Management:**

```typescript
export function useStorageQuota() {
  const [usage, setUsage] = useState(0);
  const [quota, setQuota] = useState(0);

  useEffect(() => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        setUsage(usage ?? 0);
        setQuota(quota ?? 0);
      });
    }
  }, []);

  const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

  return { usage, quota, percentUsed };
}
```

---

## Testing Requirements

### Testing Philosophy

**Coverage Goals:**
- Utilities: 90%+ coverage
- Hooks: 80%+ coverage
- Components: 70%+ coverage (focus on logic, not rendering)
- Integration: Critical user flows

**What to Test:**
- Business logic and data transformations
- Custom hooks behavior
- Error handling and edge cases
- localStorage interactions
- API integration (with mocks)

**What NOT to Test:**
- Third-party library internals
- Trivial presentational components
- Type definitions

### Unit Testing

**Tool:** Vitest (Vite-native test runner)

**Utilities Testing:**

```typescript
// src/features/distillation/utils/taskGenerator.test.ts

import { describe, it, expect } from 'vitest';
import { generateTasks } from './taskGenerator';

describe('generateTasks', () => {
  it('should generate at least 3 tasks for a valid goal', () => {
    const tasks = generateTasks('Learn React');
    expect(tasks.length).toBeGreaterThanOrEqual(3);
  });

  it('should prioritize tasks appropriately', () => {
    const tasks = generateTasks('Build a startup');
    const priorities = tasks.map(t => t.priority);
    expect(priorities).toContain('high');
  });

  it('should handle empty input gracefully', () => {
    const tasks = generateTasks('');
    expect(tasks).toEqual([]);
  });
});
```

**Hook Testing:**

```typescript
// src/shared/hooks/useLocalStorage.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should persist value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', ''));

    act(() => {
      result.current[1]('new value');
    });

    expect(localStorage.getItem('test')).toBe(JSON.stringify('new value'));
  });
});
```

### Integration Testing

**Tool:** Testing Library + Vitest

**Focus:** Feature-level workflows

```typescript
// src/features/distillation/DistillationPage.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DistillationPage } from './DistillationPage';

describe('DistillationPage', () => {
  it('should allow user to input goal and generate tasks', async () => {
    render(<DistillationPage />);

    const input = screen.getByPlaceholderText(/enter your goal/i);
    const button = screen.getByRole('button', { name: /generate/i });

    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Learn TypeScript/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing (Optional for v1)

**Tool:** Playwright

**Critical Flows:**
1. User enters goal → tasks generated → tasks saved
2. User inputs code → styled output → exported
3. User creates scenario → simulation runs → TTS speaks
4. User creates portfolio → visualized → exported

---

## API Integration Patterns

### Gemini API Integration

**Client Setup:**

```typescript
// src/lib/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private client: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
      this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-pro' });
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}
```

**Hook with Fallback:**

```typescript
// src/shared/hooks/useGeminiAPI.ts

export function useGeminiAPI() {
  const { settings } = useSettings();
  const [isUsingAI, setIsUsingAI] = useState(false);

  const client = useMemo(
    () => new GeminiClient(settings.geminiApiKey),
    [settings.geminiApiKey]
  );

  const generateTasks = useCallback(async (goal: string): Promise<Task[]> => {
    if (client.isConfigured()) {
      try {
        setIsUsingAI(true);
        const prompt = `Break down this goal into specific actionable tasks: ${goal}`;
        const response = await client.generateContent(prompt);
        return parseTasksFromResponse(response);
      } catch (error) {
        console.error('AI generation failed, using fallback:', error);
        return generateTasksFallback(goal);
      } finally {
        setIsUsingAI(false);
      }
    }

    return generateTasksFallback(goal);
  }, [client]);

  return { generateTasks, isUsingAI, hasAPIKey: client.isConfigured() };
}
```

**Fallback Templates:**

```typescript
// src/features/distillation/utils/fallback.ts

export function generateTasksFallback(goal: string): Task[] {
  const templates = [
    { id: '1', text: `Research and understand ${goal}`, priority: 'high' },
    { id: '2', text: `Create a plan for achieving ${goal}`, priority: 'high' },
    { id: '3', text: `Break down ${goal} into smaller milestones`, priority: 'medium' },
    { id: '4', text: `Gather resources needed for ${goal}`, priority: 'medium' },
    { id: '5', text: `Set deadlines for ${goal}`, priority: 'low' },
  ];

  return templates.map(t => ({
    ...t,
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));
}
```

### Web Speech API Integration

**TTS Wrapper:**

```typescript
// src/lib/speech.ts

export class SpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();

    if (this.voices.length === 0) {
      // Voices load asynchronously in some browsers
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  speak(text: string, voiceName?: string, options?: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      if (voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) utterance.voice = voice;
      }

      utterance.rate = options?.rate ?? 1;
      utterance.pitch = options?.pitch ?? 1;
      utterance.volume = options?.volume ?? 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synth.speak(utterance);
    });
  }

  stop() {
    this.synth.cancel();
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}
```

**React Hook:**

```typescript
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechService = useRef(new SpeechService());

  const speak = useCallback(async (text: string, voiceName?: string) => {
    try {
      setIsSpeaking(true);
      await speechService.current.speak(text, voiceName);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    speechService.current.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechService.current.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    speechService.current.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported: speechService.current.isSupported(),
  };
}
```

### Future Google APIs Pattern

**Abstract Data Layer:**

```typescript
// src/shared/services/storage.ts

export interface StorageAdapter {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}

export class LocalStorageAdapter implements StorageAdapter {
  async save(key: string, data: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async load(key: string): Promise<any> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async list(): Promise<string[]> {
    return Object.keys(localStorage);
  }
}

// Future implementation
export class GoogleDriveAdapter implements StorageAdapter {
  // Implementation using Google Drive API
}

// Usage in app - easy to swap
export const storage: StorageAdapter = new LocalStorageAdapter();
// Future: export const storage: StorageAdapter = new GoogleDriveAdapter();
```

---

## Deployment Process

### Vercel Deployment

**Initial Setup:**

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Set Node version: 18.x or 20.x

**Continuous Deployment:**

- Push to `main` branch triggers production deployment
- Push to other branches triggers preview deployments
- Pull requests get automatic preview URLs

**Build Configuration:**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Environment Variables:**

None required (client-side only app). API keys entered by users in settings.

**Custom Domain (Optional):**

1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL automatically provisioned

### Production Optimizations

**Vite Build Configuration:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

**Code Splitting:**

```typescript
// Lazy load feature pages
const TransmutePage = lazy(() => import('./features/transmute/TransmutePage'));
const DistillationPage = lazy(() => import('./features/distillation/DistillationPage'));
const ProjectionPage = lazy(() => import('./features/projection/ProjectionPage'));
const CulminationPage = lazy(() => import('./features/culmination/CulminationPage'));
```

**Performance Monitoring:**

- Use Vercel Analytics (free tier)
- Monitor Core Web Vitals
- Track bundle sizes with `vite-bundle-visualizer`

---

## Future Considerations

### Potential Enhancements (Post-v1)

1. **Google Calendar Integration**
   - Export Distillation tasks to Google Calendar
   - Set reminders and deadlines
   - Requires OAuth flow implementation

2. **Google Drive Backup**
   - Automatic backup of all localStorage data
   - Cross-device sync
   - Import/restore functionality

3. **Export Improvements**
   - PDF generation for portfolios
   - Rich export formats
   - Batch export capabilities

4. **Progressive Web App (PWA)**
   - Offline functionality
   - Install as desktop/mobile app
   - Background sync when online

5. **Collaboration Features**
   - Share portfolios via links
   - Export scenarios for team practice
   - Requires backend for share links

6. **Advanced AI Features**
   - Multi-turn conversations in Projection
   - Adaptive task difficulty in Distillation
   - AI-generated portfolio content

### Migration Paths

**localStorage → Google Drive:**

```typescript
async function migrateToGoogleDrive() {
  const localData = getAllLocalStorageData();
  const driveAdapter = new GoogleDriveAdapter(apiKey);

  for (const [key, value] of Object.entries(localData)) {
    await driveAdapter.save(key, value);
  }

  // Keep localStorage as cache
}
```

**Template-based → AI-powered:**

All fallback functions already in place, so adding AI is pure enhancement:

```typescript
// No code changes needed - just add API key
const tasks = await generateTasks(goal); // Uses AI if key present, templates if not
```

---

## Getting Started Checklist

When beginning development:

- [ ] Initialize Vite project with React + TypeScript template
- [ ] Install dependencies: React Router, Tailwind, shadcn/ui
- [ ] Set up Tailwind configuration with custom cyberpunk theme
- [ ] Create base file structure (`features/`, `shared/`, etc.)
- [ ] Implement core utilities (`localStorage`, `constants`)
- [ ] Create SettingsContext and useLocalStorage hook
- [ ] Set up React Router with lazy-loaded routes
- [ ] Build Layout and Navigation components
- [ ] Implement one feature end-to-end (suggest Transmute first)
- [ ] Add Gemini API integration with fallback
- [ ] Test deployment to Vercel

---

## Questions for Implementation

Before starting implementation, consider:

1. **Design System:** Should we use shadcn/ui's default theme or create a fully custom design system?
2. **Code Highlighting:** Which library for Transmute? (Prism? Highlight.js? Shiki?)
3. **Export Formats:** What specific formats for each app? (PNG, SVG, PDF, markdown?)
4. **Testing Coverage:** What's the minimum viable test coverage for v1?
5. **Analytics:** Should we add privacy-preserving analytics (Plausible, Fathom)?

---

**Last Updated:** 2025-11-06
**Version:** 1.0.0
**Status:** Ready for Implementation
