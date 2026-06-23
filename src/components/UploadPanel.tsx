import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { parsePortfolioText } from '../utils/parser';
import { fetchGithubPortfolio } from '../utils/github';
import type { PortfolioItem } from '../types';

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface UploadPanelProps {
  onDataLoaded: (items: PortfolioItem[]) => void;
}

export function UploadPanel({ onDataLoaded }: UploadPanelProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'github'>('file');
  const [githubUser, setGithubUser] = useState('');
  const [isOrg, setIsOrg] = useState(false);
  const [rawText, setRawText] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus({ type: 'loading', message: 'Extracting data from file...' });
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setStatus({ type: 'loading', message: 'Transforming and loading portfolio items...' });
        const items = parsePortfolioText(text);
        if (items.length === 0) {
          setStatus({ type: 'error', message: 'No valid portfolio items found in the file.' });
        } else {
          onDataLoaded(items);
          setStatus({ type: 'success', message: `Successfully loaded ${items.length} items from ${file.name}.` });
        }
      } catch (err: any) {
        setStatus({ type: 'error', message: `Transformation error: ${err.message || err}` });
      }
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Failed to read file.' });
    };
    reader.readAsText(file);
  };

  const handleTextLoad = () => {
    if (!rawText.trim()) {
      setStatus({ type: 'error', message: 'Please enter portfolio text first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Transforming text data...' });
    try {
      const items = parsePortfolioText(rawText);
      if (items.length === 0) {
        setStatus({ type: 'error', message: 'No valid portfolio items parsed. Check schema layout.' });
      } else {
        onDataLoaded(items);
        setStatus({ type: 'success', message: `Successfully loaded ${items.length} items.` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `Transformation error: ${err.message || err}` });
    }
  };

  const handleGithubLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUser.trim()) {
      setStatus({ type: 'error', message: 'Please enter a GitHub username or org name.' });
      return;
    }

    setStatus({ type: 'loading', message: `Connecting to GitHub API for ${githubUser}...` });
    try {
      const items = await fetchGithubPortfolio(githubUser.trim(), isOrg);
      if (items.length === 0) {
        setStatus({ type: 'error', message: 'No public repositories found for this account.' });
      } else {
        onDataLoaded(items);
        setStatus({ type: 'success', message: `Successfully loaded ${items.length} repos from GitHub.` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `Pipeline execution failed: ${err.message || err}` });
    }
  };

  return (
    <div className="pipeline-panel">
      <div className="panel-title">
        <Upload size={20} className="text-lime-green" style={{ color: 'var(--lime-green)' }} />
        Portfolio Data Pipeline
      </div>

      <div className="custom-tabs">
        <button
          className={`custom-tab-btn ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => { setActiveTab('file'); setStatus({ type: 'idle', message: '' }); }}
        >
          File Upload
        </button>
        <button
          className={`custom-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => { setActiveTab('text'); setStatus({ type: 'idle', message: '' }); }}
        >
          Paste Data
        </button>
        <button
          className={`custom-tab-btn ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => { setActiveTab('github'); setStatus({ type: 'idle', message: '' }); }}
        >
          GitHub API
        </button>
      </div>

      {status.type !== 'idle' && (
        <div className="notification-banner">
          <div className="notification-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {status.type === 'loading' && <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
            {status.type === 'success' && <CheckCircle size={16} style={{ color: 'var(--lime-green)' }} />}
            {status.type === 'error' && <AlertTriangle size={16} style={{ color: 'var(--error-color)' }} />}
            <span>{status.message}</span>
          </div>
          <button className="notification-close" onClick={() => setStatus({ type: 'idle', message: '' })}>
            &times;
          </button>
        </div>
      )}

      {activeTab === 'file' && (
        <div className="pipeline-form">
          <div className="form-row">
            <div className="file-upload-wrapper">
              <label className="file-upload-label">
                <FileText size={18} />
                Choose Portfolio Data File (.txt)
                <input
                  type="file"
                  accept=".txt"
                  className="file-upload-input"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
              </label>
            </div>
            {fileInputRef.current?.files?.[0] && (
              <button
                className="custom-btn-secondary"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  setStatus({ type: 'idle', message: '' });
                }}
              >
                Clear
              </button>
            )}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Upload a text file conforming to the schema [TITLE] / metadata / "description" / media
          </span>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="pipeline-form">
          <textarea
            className="custom-input"
            rows={6}
            placeholder={`[My Project]\nRole: Architect\n"A dynamic honeycomb project showcase."\nhttps://example.com/logo.png`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{ fontFamily: 'monospace', resize: 'vertical' }}
          />
          <button className="custom-btn" onClick={handleTextLoad} style={{ alignSelf: 'flex-start' }}>
            Transform & Load
          </button>
        </div>
      )}

      {activeTab === 'github' && (
        <form onSubmit={handleGithubLoad} className="pipeline-form">
          <div className="form-row">
            <input
              type="text"
              className="custom-input"
              placeholder="Enter GitHub username or organization"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
            />
            <div
              className="custom-checkbox-container"
              onClick={() => setIsOrg(!isOrg)}
            >
              <div className={`custom-checkbox ${isOrg ? 'checked' : ''}`} />
              <span>Is Organization</span>
            </div>
            <button type="submit" className="custom-btn">
              <GithubIcon size={18} />
              Run Pipeline
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
