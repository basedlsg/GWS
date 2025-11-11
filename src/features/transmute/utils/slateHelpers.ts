/**
 * Slate Editor Helpers
 * Custom formatting functions and renderers for Slate.js
 */

import { Editor, Transforms, Element as SlateElement } from 'slate';
import type { CustomEditor, CustomElement, CustomText } from '../types';

// Type guards
export const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor: CustomEditor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

// Toggle mark (bold, italic, underline)
export const toggleMark = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Toggle block type (heading, paragraph, list)
export const toggleBlock = (editor: CustomEditor, format: CustomElement['type']) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'bulleted-list' || format === 'numbered-list';

  // Unwrap any existing lists
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === 'bulleted-list' || n.type === 'numbered-list'),
    split: true,
  });

  let newType: CustomElement['type'];
  if (isActive) {
    newType = 'paragraph';
  } else if (isList) {
    newType = 'list-item';
  } else {
    newType = format;
  }

  Transforms.setNodes<SlateElement>(editor, { type: newType } as Partial<SlateElement>);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement;
    Transforms.wrapNodes(editor, block);
  }
};

// Insert link
export const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const wrapLink = (editor: CustomEditor, url: string) => {
  const isActive = isBlockActive(editor, 'link');

  if (isActive) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;

  const link: CustomElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

// Check if link is active
export const isLinkActive = (editor: CustomEditor) => {
  return isBlockActive(editor, 'link');
};

// Remove link
export const removeLink = (editor: CustomEditor) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }
};
