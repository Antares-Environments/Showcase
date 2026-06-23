import { X, ExternalLink, File, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { PortfolioItem } from '../types';
import { parseMarkdown } from '../utils/markdown';

interface ProjectDetailProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export function ProjectDetail({ item, onClose }: ProjectDetailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!item) return null;

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg|avif)/i.test(url) || url.startsWith('data:image/');
  };

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|ogg)/i.test(url);
  };

  const handleCopyPath = (path: string, index: number) => {
    navigator.clipboard.writeText(path);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getAttachmentName = (path: string) => {
    try {
      const parts = path.split(/[/\\]/);
      return parts[parts.length - 1] || path;
    } catch {
      return path;
    }
  };

  return (
    <div className={`detail-modal-overlay ${item ? 'open' : ''}`} onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-area">
            <h2>{item.title}</h2>
            <div className="modal-metadata">
              {Object.entries(item.meta).map(([key, val]) => (
                <div key={key} className="meta-pill">
                  <span className="meta-pill-key">{key}:</span>
                  {val}
                </div>
              ))}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="description-section">
            {parseMarkdown(item.description)}
          </div>

          {item.attachments.length > 0 && (
            <div className="attachments-section">
              <h3 className="section-title">Attachments & Media</h3>
              <div className="attachment-grid">
                {item.attachments.map((url, idx) => {
                  const name = getAttachmentName(url);
                  const isImage = isImageUrl(url);
                  const isVideo = isVideoUrl(url);
                  const isWebUrl = url.startsWith('http://') || url.startsWith('https://');

                  return (
                    <div key={idx} className="attachment-card">
                      {isImage && (
                        <img
                          src={url}
                          alt={name}
                          className="attachment-preview"
                        />
                      )}
                      {isVideo && (
                        <video
                          src={url}
                          controls
                          className="attachment-preview"
                        />
                      )}
                      {!isImage && !isVideo && (
                        <div
                          className="attachment-preview"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--bg-color)',
                          }}
                        >
                          <File size={32} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                      )}
                      <span className="attachment-link" title={url}>
                        {name}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        {isWebUrl ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="custom-btn"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              textDecoration: 'none',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                          >
                            <ExternalLink size={12} />
                            Open Link
                          </a>
                        ) : (
                          <button
                            className="custom-btn-secondary"
                            onClick={() => handleCopyPath(url, idx)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                            {copiedIndex === idx ? 'Copied!' : 'Copy Path'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
