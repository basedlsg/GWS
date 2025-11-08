/**
 * ThemeSelector Component
 * Allows selection of transmutation theme
 */

import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { THEMES } from '../constants';
import type { TransmuteTheme } from '../types';

interface ThemeSelectorProps {
  value: TransmuteTheme;
  onChange: (theme: TransmuteTheme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const themes = Object.values(THEMES);

  return (
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(v) => onChange(v as TransmuteTheme)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.name} value={theme.name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: theme.backgroundColor }}
                />
                <span>{theme.displayName}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
