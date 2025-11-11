import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Extend Slate types for our custom editor
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string; // For weighted random colors
};

export type HeadingElement = {
  type: 'heading-1' | 'heading-2' | 'heading-3';
  children: CustomText[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: ListItemElement[];
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: CustomText[];
};

export type CustomElement =
  | HeadingElement
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement
  | LinkElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Document types
export interface TransmuteDocument {
  id: string;
  title: string;
  content: Descendant[];
  createdAt: string;
  updatedAt: string;
  metadata: {
    wordCount: number;
    characterCount: number;
    selectedLanguage: CodeLanguage;
    selectedTheme: string;
    fontSize: number;
    fontFamily: string;
  };
}

// Code transformation types
export type CodeLanguage = 'javascript' | 'python' | 'rust' | 'go' | 'cpp' | 'ruby' | 'java';

export interface CodeTheme {
  name: string;
  background: string;
  textColor: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  variable: string;
  className: string;
  operator: string;
}

// Color animation types
export interface ColorWeight {
  color: string;
  weight: number;
}

export const COLOR_WEIGHTS: ColorWeight[] = [
  { color: '#00FFFF', weight: 0.25 }, // cyan
  { color: '#FF00FF', weight: 0.20 }, // magenta
  { color: '#00FF00', weight: 0.20 }, // green
  { color: '#FFFF00', weight: 0.15 }, // yellow
  { color: '#9D00FF', weight: 0.10 }, // purple
  { color: '#FF8800', weight: 0.10 }, // orange
];

// Settings types
export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  showRandomColors: boolean;
  colorAnimationSpeed: number; // milliseconds
  codeLanguage: CodeLanguage;
  codeTheme: string;
}

// Export types
export type ExportFormat = 'txt' | 'md' | 'pdf' | 'pdf-code';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
}
