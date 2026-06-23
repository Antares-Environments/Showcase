import { useState, useEffect } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { Honeycomb } from './components/Honeycomb';
import { ProjectDetail } from './components/ProjectDetail';
import type { PortfolioItem } from './types';
import { Sun, Mountain, Gem, Flame, ChevronUp, ChevronDown } from 'lucide-react';

function CustomCoinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <line x1="12" y1="7.5" x2="12" y2="16.5" />
      <path d="M13.5 9.5H11.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H10.5" />
    </svg>
  );
}

export default function App() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [theme, setTheme] = useState<'amber' | 'volcanic' | 'beige' | 'jade' | 'copper'>('amber');
  const [showPipeline, setShowPipeline] = useState(true);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleDataLoaded = (newItems: PortfolioItem[]) => {
    setItems(newItems);
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          AETHER<span>GALLERY</span>
        </h1>
        <p className="subtitle" style={{ marginBottom: '20px' }}>
          Dynamic Honeycomb Portfolio &bull; Custom warm colors only
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <div className="theme-selector">
            <button
              className={`theme-btn ${theme === 'amber' ? 'active' : ''}`}
              onClick={() => setTheme('amber')}
              title="Amber Eclipse"
            >
              <Sun size={20} />
            </button>
            <button
              className={`theme-btn ${theme === 'beige' ? 'active' : ''}`}
              onClick={() => setTheme('beige')}
              title="Beige Dunes"
            >
              <CustomCoinIcon size={20} />
            </button>
            <button
              className={`theme-btn ${theme === 'copper' ? 'active' : ''}`}
              onClick={() => setTheme('copper')}
              title="Copper Canyon"
            >
              <Mountain size={20} />
            </button>
            <button
              className={`theme-btn ${theme === 'jade' ? 'active' : ''}`}
              onClick={() => setTheme('jade')}
              title="Jade & Steel"
            >
              <Gem size={20} />
            </button>
            <button
              className={`theme-btn ${theme === 'volcanic' ? 'active' : ''}`}
              onClick={() => setTheme('volcanic')}
              title="Volcanic Ash"
            >
              <Flame size={20} />
            </button>
          </div>

          <button
            className="custom-btn-secondary"
            onClick={() => setShowPipeline(!showPipeline)}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 10px var(--shadow-color)',
              cursor: 'pointer',
            }}
            title={showPipeline ? 'Hide Controls' : 'Show Controls'}
          >
            {showPipeline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </header>

      <main>
        {showPipeline && <UploadPanel onDataLoaded={handleDataLoaded} />}
        
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
            Portfolio Honeycomb Grid
          </h2>
          <Honeycomb items={items} onItemClick={setSelectedItem} />
        </div>
      </main>

      <ProjectDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
