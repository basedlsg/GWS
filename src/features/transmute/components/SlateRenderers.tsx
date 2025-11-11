/**
 * Slate Custom Renderers
 * Render formatted elements and text
 */

import { RenderElementProps, RenderLeafProps } from 'slate-react';
import type { CustomElement } from '../types';

// Render custom elements (headings, lists, links, etc.)
export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as CustomElement;

  switch (customElement.type) {
    case 'heading-1':
      return (
        <h1 {...attributes} className="text-3xl font-bold mb-4">
          {children}
        </h1>
      );
    case 'heading-2':
      return (
        <h2 {...attributes} className="text-2xl font-bold mb-3">
          {children}
        </h2>
      );
    case 'heading-3':
      return (
        <h3 {...attributes} className="text-xl font-bold mb-2">
          {children}
        </h3>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside mb-2">
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside mb-2">
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li {...attributes} className="mb-1">
          {children}
        </li>
      );
    case 'link':
      return (
        <a
          {...attributes}
          href={customElement.url}
          className="text-blue-500 underline hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    default:
      return (
        <p {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

// Render custom text formatting (bold, italic, underline, color)
export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  if (leaf.color) {
    styledChildren = (
      <span style={{ color: leaf.color, transition: 'color 2s ease-in-out' }}>
        {styledChildren}
      </span>
    );
  }

  return <span {...attributes}>{styledChildren}</span>;
};
