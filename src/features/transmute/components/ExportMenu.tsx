/**
 * Export Menu
 * Dropdown menu for exporting documents in various formats
 */

import { useState } from 'react';
import { Download, FileText, FileCode, FileDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToast } from '@/shared/hooks/use-toast';
import { exportAsText, exportAsMarkdown, exportAsPDF, exportCodeAsPDF } from '../utils/export';
import type { TransmuteDocument } from '../types';

interface ExportMenuProps {
  document: TransmuteDocument | null;
  codeText: string;
}

export function ExportMenu({ document, codeText }: ExportMenuProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  if (!document) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    );
  }

  const handleExport = async (format: 'txt' | 'md' | 'pdf' | 'pdf-code') => {
    setIsExporting(true);

    try {
      switch (format) {
        case 'txt':
          exportAsText(document);
          toast({
            title: 'Exported as Text',
            description: `${document.title}.txt has been downloaded`,
          });
          break;

        case 'md':
          exportAsMarkdown(document);
          toast({
            title: 'Exported as Markdown',
            description: `${document.title}.md has been downloaded`,
          });
          break;

        case 'pdf':
          exportAsPDF(document);
          toast({
            title: 'Exported as PDF',
            description: `${document.title}.pdf has been downloaded`,
          });
          break;

        case 'pdf-code':
          exportCodeAsPDF(document, codeText);
          toast({
            title: 'Exported Code View as PDF',
            description: `${document.title}_code.pdf has been downloaded`,
          });
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport('txt')}>
          <FileText className="h-4 w-4 mr-2" />
          Plain Text (.txt)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('md')}>
          <FileCode className="h-4 w-4 mr-2" />
          Markdown (.md)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileDown className="h-4 w-4 mr-2" />
          PDF - Text View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('pdf-code')}>
          <FileDown className="h-4 w-4 mr-2" />
          PDF - Code View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
