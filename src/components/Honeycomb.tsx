import { useState, useEffect } from 'react';
import type { PortfolioItem } from '../types';

interface HoneycombProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
}

export function Honeycomb({ items, onItemClick }: HoneycombProps) {
  const [rowSize, setRowSize] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1000) {
        setRowSize(4);
      } else if (w >= 700) {
        setRowSize(3);
      } else if (w >= 450) {
        setRowSize(2);
      } else {
        setRowSize(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isImageUrl = (url: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg|avif)/i.test(url) || url.startsWith('data:image/');
  };

  const getRows = () => {
    const rows: PortfolioItem[][] = [];
    let i = 0;
    let isShortRow = false;
    while (i < items.length) {
      const currentSize = isShortRow ? Math.max(1, rowSize - 1) : rowSize;
      rows.push(items.slice(i, i + currentSize));
      i += currentSize;
      if (rowSize > 1) {
        isShortRow = !isShortRow;
      }
    }
    return rows;
  };

  const rows = getRows();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects loaded yet. Use the pipeline above to upload a file or connect to GitHub.</p>
      </div>
    );
  }

  return (
    <div className="honeycomb-container" style={{ '--row-size': rowSize } as React.CSSProperties}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`honeycomb-row ${rowSize > 1 && rowIndex % 2 === 1 ? 'odd-row' : ''}`}>
          {row.map((item) => {
            const thumbnail = item.attachments.find(isImageUrl);
            const primaryTag = Object.values(item.meta)[0] || '';

            return (
              <div
                key={item.id}
                className="hex-card"
                onClick={() => onItemClick(item)}
              >
                <div className="hex-outer" />
                <div className="hex-inner">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={item.title}
                      className="hex-thumbnail"
                    />
                  )}
                  <div className="hex-content">
                    <div className="hex-title">{item.title}</div>
                    {primaryTag && (
                      <span className="hex-tag">{primaryTag}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
