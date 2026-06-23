import React from 'react';

export function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} style={{ marginLeft: '20px', marginBottom: '16px', listStyleType: 'disc' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (str: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentText = str;
    let index = 0;

    while (currentText.length > 0) {
      const boldMatch = currentText.match(/\*\*(.*?)\*\*/);
      const linkMatch = currentText.match(/\[(.*?)\]\((.*?)\)/);

      const nextBoldIdx = boldMatch && boldMatch.index !== undefined ? boldMatch.index : Infinity;
      const nextLinkIdx = linkMatch && linkMatch.index !== undefined ? linkMatch.index : Infinity;

      if (nextBoldIdx === Infinity && nextLinkIdx === Infinity) {
        parts.push(<span key={index++}>{currentText}</span>);
        break;
      }

      if (nextBoldIdx < nextLinkIdx) {
        if (nextBoldIdx > 0) {
          parts.push(<span key={index++}>{currentText.slice(0, nextBoldIdx)}</span>);
        }
        parts.push(<strong key={index++} style={{ color: 'var(--lime-green)' }}>{boldMatch![1]}</strong>);
        currentText = currentText.slice(nextBoldIdx + boldMatch![0].length);
      } else {
        if (nextLinkIdx > 0) {
          parts.push(<span key={index++}>{currentText.slice(0, nextLinkIdx)}</span>);
        }
        parts.push(
          <a
            key={index++}
            href={linkMatch![2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--lime-green)', textDecoration: 'underline' }}
          >
            {linkMatch![1]}
          </a>
        );
        currentText = currentText.slice(nextLinkIdx + linkMatch![0].length);
      }
    }

    return <>{parts}</>;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList(i);

    if (line === '') {
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.5rem', marginTop: '20px', marginBottom: '10px', color: 'var(--lime-green)' }}>{renderInline(line.slice(2))}</h2>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.25rem', marginTop: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>{renderInline(line.slice(3))}</h3>);
    } else if (line.startsWith('### ')) {
      elements.push(<h4 key={i} style={{ fontSize: '1.1rem', marginTop: '12px', marginBottom: '6px', color: 'var(--text-primary)' }}>{renderInline(line.slice(4))}</h4>);
    } else {
      elements.push(<p key={i} style={{ marginBottom: '12px' }}>{renderInline(line)}</p>);
    }
  }

  flushList(lines.length);
  return elements;
}
