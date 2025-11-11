/**
 * Editor Toolbar
 * Rich text formatting controls
 */

import { useSlate } from 'slate-react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Type,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { toggleMark, toggleBlock, isMarkActive, isBlockActive, insertLink, isLinkActive, removeLink } from '../utils/slateHelpers';
import { FONT_FAMILIES, FONT_SIZES } from '../constants';
import type { CustomEditor } from '../types';
import { useState } from 'react';

interface EditorToolbarProps {
  fontSize: number;
  fontFamily: string;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
}

export function EditorToolbar({
  fontSize,
  fontFamily,
  onFontSizeChange,
  onFontFamilyChange,
}: EditorToolbarProps) {
  const editor = useSlate() as CustomEditor;
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      insertLink(editor, linkUrl.trim());
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const handleRemoveLink = () => {
    removeLink(editor);
    setShowLinkDialog(false);
  };

  return (
    <div className="border-b pb-2 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            active={isMarkActive(editor, 'bold')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'bold');
            }}
            icon={<Bold className="h-4 w-4" />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            active={isMarkActive(editor, 'italic')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'italic');
            }}
            icon={<Italic className="h-4 w-4" />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            active={isMarkActive(editor, 'underline')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'underline');
            }}
            icon={<Underline className="h-4 w-4" />}
            title="Underline (Ctrl+U)"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            active={isBlockActive(editor, 'heading-1')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'heading-1');
            }}
            icon={<Heading1 className="h-4 w-4" />}
            title="Heading 1"
          />
          <ToolbarButton
            active={isBlockActive(editor, 'heading-2')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'heading-2');
            }}
            icon={<Heading2 className="h-4 w-4" />}
            title="Heading 2"
          />
          <ToolbarButton
            active={isBlockActive(editor, 'heading-3')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'heading-3');
            }}
            icon={<Heading3 className="h-4 w-4" />}
            title="Heading 3"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            active={isBlockActive(editor, 'bulleted-list')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'bulleted-list');
            }}
            icon={<List className="h-4 w-4" />}
            title="Bulleted List"
          />
          <ToolbarButton
            active={isBlockActive(editor, 'numbered-list')}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleBlock(editor, 'numbered-list');
            }}
            icon={<ListOrdered className="h-4 w-4" />}
            title="Numbered List"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <div className="relative">
          {!showLinkDialog ? (
            <ToolbarButton
              active={isLinkActive(editor)}
              onMouseDown={(e) => {
                e.preventDefault();
                if (isLinkActive(editor)) {
                  handleRemoveLink();
                } else {
                  setShowLinkDialog(true);
                }
              }}
              icon={<LinkIcon className="h-4 w-4" />}
              title={isLinkActive(editor) ? 'Remove Link' : 'Insert Link'}
            />
          ) : (
            <div className="flex items-center gap-2 px-2 py-1 border rounded bg-background">
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInsertLink();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                  }
                }}
                className="w-48 px-2 py-1 text-sm border rounded outline-none"
                autoFocus
              />
              <Button size="sm" onClick={handleInsertLink}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Select value={fontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={fontSize.toString()} onValueChange={(v) => onFontSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Toolbar button component
interface ToolbarButtonProps {
  active: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  title: string;
}

function ToolbarButton({ active, onMouseDown, icon, title }: ToolbarButtonProps) {
  return (
    <button
      onMouseDown={onMouseDown}
      title={title}
      className={`p-2 rounded hover:bg-accent transition-colors ${
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
      }`}
    >
      {icon}
    </button>
  );
}
