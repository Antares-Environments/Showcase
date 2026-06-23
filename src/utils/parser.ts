import type { PortfolioItem } from '../types';

export function parsePortfolioText(text: string): PortfolioItem[] {
  const lines = text.split(/\r?\n/);
  const items: PortfolioItem[] = [];
  let currentItem: Partial<PortfolioItem> | null = null;
  let inDescription = false;
  let descriptionLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line && !inDescription) continue;

    if (!inDescription && line.startsWith('[') && line.endsWith(']')) {
      if (currentItem) {
        if (descriptionLines.length > 0) {
          currentItem.description = descriptionLines.join('\n');
        }
        items.push({
          id: currentItem.id || Math.random().toString(36).substring(2, 9),
          title: currentItem.title || 'Untitled',
          meta: currentItem.meta || {},
          description: currentItem.description || '',
          attachments: currentItem.attachments || [],
        });
        descriptionLines = [];
      }

      currentItem = {
        title: line.slice(1, -1),
        meta: {},
        attachments: [],
      };
      continue;
    }

    if (currentItem) {
      if (inDescription) {
        if (line.endsWith('"') && !line.endsWith('\\"')) {
          descriptionLines.push(line.slice(0, -1));
          inDescription = false;
          currentItem.description = descriptionLines.join('\n');
          descriptionLines = [];
        } else {
          descriptionLines.push(line);
        }
      } else if (line.startsWith('"')) {
        if (line.endsWith('"') && line.length > 1 && !line.endsWith('\\"')) {
          currentItem.description = line.slice(1, -1);
        } else {
          inDescription = true;
          descriptionLines.push(line.slice(1));
        }
      } else if (line.includes(':')) {
        const colonIndex = line.indexOf(':');
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        if (currentItem.meta) {
          currentItem.meta[key] = value;
        }
      } else {
        if (currentItem.attachments) {
          currentItem.attachments.push(line);
        }
      }
    }
  }

  if (currentItem) {
    if (descriptionLines.length > 0) {
      currentItem.description = descriptionLines.join('\n');
    }
    items.push({
      id: currentItem.id || Math.random().toString(36).substring(2, 9),
      title: currentItem.title || 'Untitled',
      meta: currentItem.meta || {},
      description: currentItem.description || '',
      attachments: currentItem.attachments || [],
    });
  }

  return items;
}
