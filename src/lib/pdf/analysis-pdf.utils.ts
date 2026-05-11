import { Position } from '../interfaces';

export type MarkdownElement =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'li'; text: string }
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string };

export function parseMarkdownContent(content: string): MarkdownElement[] {
  if (!content) return [];
  const lines = content.split('\n');
  const elements: MarkdownElement[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('# ')) {
      elements.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '').replace(/🌌|🎯|🔑|💼|🌟|📈|🩹|🛠️|💫/g, '') });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '').replace(/🌌|🎯|🔑|💼|🌟|📈|🩹|🛠️|💫/g, '') });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }
    if (trimmed.match(/^[•\-\d]+\.?\s+/)) {
      const cleanText = trimmed
        .replace(/^[•\-]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/\*\*(.*?)\*\*/g, '$1');
      elements.push({ type: 'li', text: cleanText });
      continue;
    }
    if (trimmed) {
      // Parse bold text
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          elements.push({ type: 'bold', text: part.replace(/\*\*/g, '') });
        } else if (part) {
          elements.push({ type: 'text', text: part });
        }
      }
    }
  }
  return elements;
}

export function formatPosition(pos: Position, index: number): string {
  const name = pos.planete || pos.astre || `Position ${index + 1}`;
  const sign = pos.signe || 'N/A';
  const house = pos.maison !== undefined ? `Maison ${pos.maison}` : '';
  const retro = pos.retrograde ? ' RÉTROGRADE' : '';
  return `${name}${retro} en ${sign}${house ? ' - ' + house : ''}`;
}

export function splitMarkdownIntoSections(content: string): string[] {
  const sections: string[] = [];
  const lines = content.split('\n');
  let currentSection = '';
  let lineCount = 0;
  const MAX_LINES_PER_SECTION = 35;
  for (const line of lines) {
    currentSection += line + '\n';
    lineCount++;
    const isHeader = line.trim().startsWith('# ') || line.trim().startsWith('## ');
    if (lineCount >= MAX_LINES_PER_SECTION || (isHeader && lineCount > 10)) {
      sections.push(currentSection);
      currentSection = '';
      lineCount = 0;
    }
  }
  if (currentSection.trim()) {
    sections.push(currentSection);
  }
  return sections;
}