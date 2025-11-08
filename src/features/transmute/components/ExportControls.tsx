/**
 * ExportControls Component
 * Handles export operations (clipboard, HTML, markdown, PNG)
 */

import { useState } from 'react';
import { Download, Copy, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';
import {
  generateHTML,
  generateMarkdown,
  copyHTMLToClipboard,
  copyTextToClipboard,
  downloadHTML,
  downloadMarkdown,
  downloadPNG,
} from '../utils/export';
import type { TransmuteTheme } from '../types';

interface ExportControlsProps {
  text: string;
  language: string;
  theme: TransmuteTheme;
  title: string;
}

export function ExportControls({ text, language, theme, title }: ExportControlsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Plain text copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: 'Failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleCopyHTML = async () => {
    const html = generateHTML(text, language, theme, title);
    const success = await copyHTMLToClipboard(html);
    if (success) {
      toast({
        title: 'Copied!',
        description: 'HTML copied to clipboard',
      });
    } else {
      toast({
        title: 'Failed',
        description: 'Could not copy HTML to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadHTML = () => {
    const html = generateHTML(text, language, theme, title);
    downloadHTML(html, title || 'transmutation');
    toast({
      title: 'Downloaded!',
      description: 'HTML file saved',
    });
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdown(text, language, title);
    downloadMarkdown(markdown, title || 'transmutation');
    toast({
      title: 'Downloaded!',
      description: 'Markdown file saved',
    });
  };

  const handleDownloadPNG = async () => {
    const result = await downloadPNG('transmute-preview', title || 'transmutation');
    if (result.success) {
      toast({
        title: 'Downloaded!',
        description: 'PNG image saved',
      });
    } else {
      toast({
        title: 'PNG Export Unavailable',
        description: result.error || 'PNG export is not yet implemented',
        variant: 'destructive',
      });
    }
  };

  const hasContent = text.trim().length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Quick Copy Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyText}
        disabled={!hasContent}
        className="gap-2"
      >
        {copied ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Text
          </>
        )}
      </Button>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!hasContent} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyHTML}>
            <Copy className="mr-2 h-4 w-4" />
            Copy as HTML
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownloadHTML}>
            <FileText className="mr-2 h-4 w-4" />
            Download HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadMarkdown}>
            <FileText className="mr-2 h-4 w-4" />
            Download Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPNG}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Download PNG (Beta)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
