/**
 * Export Utilities
 * Export documents to various formats (.txt, .md, PDF)
 */

import { Descendant, Element, Text } from 'slate';
import jsPDF from 'jspdf';
import type { TransmuteDocument, CustomElement } from '../types';

/**
 * Extract plain text from Slate node
 */
function extractText(node: Descendant): string {
  if (Text.isText(node)) {
    return node.text;
  }
  if (Element.isElement(node)) {
    return node.children.map(extractText).join('');
  }
  return '';
}

/**
 * Export document as plain text
 */
export function exportAsText(doc: TransmuteDocument): void {
  const text = doc.content.map(node => extractText(node)).join('\n\n');

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(doc.title)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Convert Slate node to Markdown
 */
function nodeToMarkdown(node: Descendant, depth = 0): string {
  if (Text.isText(node)) {
    let text = node.text;
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `*${text}*`;
    if (node.underline) text = `_${text}_`;
    return text;
  }

  if (Element.isElement(node)) {
    const customNode = node as CustomElement;
    const childrenText = customNode.children.map(child => nodeToMarkdown(child, depth + 1)).join('');

    switch (customNode.type) {
      case 'heading-1':
        return `# ${childrenText}\n\n`;
      case 'heading-2':
        return `## ${childrenText}\n\n`;
      case 'heading-3':
        return `### ${childrenText}\n\n`;
      case 'paragraph':
        return childrenText ? `${childrenText}\n\n` : '\n';
      case 'list-item':
        return `- ${childrenText}\n`;
      case 'bulleted-list':
        return customNode.children.map(child => nodeToMarkdown(child, depth)).join('') + '\n';
      case 'numbered-list':
        return customNode.children.map((child, i) => {
          const text = child.children.map(c => nodeToMarkdown(c, depth)).join('');
          return `${i + 1}. ${text}\n`;
        }).join('') + '\n';
      case 'link':
        return `[${childrenText}](${customNode.url})`;
      default:
        return childrenText;
    }
  }

  return '';
}

/**
 * Export document as Markdown
 */
export function exportAsMarkdown(doc: TransmuteDocument): void {
  const markdown = doc.content.map(node => nodeToMarkdown(node)).join('');

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(doc.title)}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export document as PDF (text view)
 */
export function exportAsPDF(doc: TransmuteDocument): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Helper to check if we need a new page
  const checkNewPage = (lineHeight: number) => {
    if (yPosition + lineHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Header - Document title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(doc.title, maxWidth);
  titleLines.forEach((line: string) => {
    checkNewPage(12);
    pdf.text(line, margin, yPosition);
    yPosition += 12;
  });

  yPosition += 5;

  // Metadata
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Created: ${new Date(doc.createdAt).toLocaleDateString()}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Words: ${doc.metadata.wordCount} | Characters: ${doc.metadata.characterCount}`, margin, yPosition);
  yPosition += 10;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Content
  for (const node of doc.content) {
    if (!Element.isElement(node)) continue;

    const customNode = node as CustomElement;
    const text = extractText(node);

    if (!text.trim()) {
      yPosition += 6;
      continue;
    }

    switch (customNode.type) {
      case 'heading-1':
        checkNewPage(12);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, yPosition);
        yPosition += 12;
        break;

      case 'heading-2':
        checkNewPage(10);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, yPosition);
        yPosition += 10;
        break;

      case 'heading-3':
        checkNewPage(9);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, margin, yPosition);
        yPosition += 9;
        break;

      case 'paragraph':
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        const paraLines = pdf.splitTextToSize(text, maxWidth);
        paraLines.forEach((line: string) => {
          checkNewPage(7);
          pdf.text(line, margin, yPosition);
          yPosition += 7;
        });
        yPosition += 3;
        break;

      case 'bulleted-list':
      case 'numbered-list':
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        customNode.children.forEach((item, index) => {
          const itemText = extractText(item);
          const bullet = customNode.type === 'bulleted-list' ? '•' : `${index + 1}.`;
          const itemLines = pdf.splitTextToSize(`${bullet} ${itemText}`, maxWidth - 10);
          itemLines.forEach((line: string, lineIndex: number) => {
            checkNewPage(7);
            const xOffset = lineIndex === 0 ? margin : margin + 10;
            pdf.text(line, xOffset, yPosition);
            yPosition += 7;
          });
        });
        yPosition += 3;
        break;

      case 'link':
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 255);
        pdf.text(text, margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 7;
        break;
    }
  }

  // Save PDF
  pdf.save(`${sanitizeFilename(doc.title)}.pdf`);
}

/**
 * Export code view as PDF
 */
export function exportCodeAsPDF(doc: TransmuteDocument, codeText: string): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Header
  pdf.setFontSize(16);
  pdf.setFont('courier', 'bold');
  pdf.text(`${doc.title} [Code View]`, margin, yPosition);
  yPosition += 10;

  // Code content
  pdf.setFontSize(10);
  pdf.setFont('courier', 'normal');

  const lines = codeText.split('\n');

  lines.forEach(line => {
    // Check if we need a new page
    if (yPosition + 5 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    // Remove HTML tags for PDF
    const cleanLine = line.replace(/<[^>]*>/g, '');
    const wrappedLines = pdf.splitTextToSize(cleanLine, maxWidth);

    wrappedLines.forEach((wrappedLine: string) => {
      if (yPosition + 5 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(wrappedLine, margin, yPosition);
      yPosition += 5;
    });
  });

  // Save PDF
  pdf.save(`${sanitizeFilename(doc.title)}_code.pdf`);
}

/**
 * Sanitize filename for download
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-\s]/gi, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);
}
