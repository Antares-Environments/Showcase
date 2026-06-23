# AetherGallery

AetherGallery is a dynamic, data-agnostic portfolio browser that showcases projects or patents in an interlocking hexagonal honeycomb layout. It is built under a strict design system where all active user interface colors must satisfy the mathematical constraint $r \ge b$ and $g \ge b$, ensuring warm hues (yellows, reds, browns, oranges, and warm-toned greens).

## System Nomenclature
*   **UI**: Custom CSS and React components rendering the interactive honeycomb grid, collapsible control bar, theme selectors, and media detail modals.
*   **Functional Core**: Text ingestion parsers, recursive GitHub directory scrapers, and color verification utilities.
*   **Imperative Shell**: State bindings, window resize observers, and Vite bundle compilation targets.

## Honeycomb Grid Math
Pointy-topped hexagons are aligned in interlocking rows. To prevent tip-to-tip clashing:
*   Adjacent columns are separated horizontally by the hexagon width plus gap ($W + G$).
*   Subsequent rows overlap vertically by negative margins of $25\%$ of the height (positioning rows at exactly $0.75 \times H$ below the previous row).
*   Odd rows (indices 1, 3, 5...) shift horizontally by exactly half a cell width using padding-left offsets (`calc((W + G) / 2)`).
*   Grid width is dynamically scaled to match the active columns (`calc(cols * (W + G) - G)`), aligning all layers perfectly.

## ETL Porting Pipelines

### Text Ingestion Parser
Accepts uploaded text documents or raw pasted text following this schema:
```text
[PROJECT TITLE]
Meta-Key-1: Value 1
Meta-Key-2: Value 2
"Multi-line project description
enclosed in double quotes."
./relative/path/to/local/image.png
https://external-domain.com/demo/video.mp4
```

### GitHub API Scraper
*   Fetches the public repository catalog for a given username or organization.
*   Pulls `README.md` files to extract description blocks.
*   Recurses the repository's file tree to locate image files in root directories or asset directories (`static`, `assets`, `images`), scoring them to extract logos or cover headers to use as thumbnail icons.

## Integrated Warm Themes
The header panel contains an icon-based selector containing 5 distinct color schemes. Every color inside these themes is validated:
1.  **Amber Eclipse** (Sun Icon): Default dark amber charcoal theme.
2.  **Beige Dunes** (FileText Icon): Light sand beige theme with sage highlights.
3.  **Copper Canyon** (Mountain Icon): Rich copper rust theme.
4.  **Jade & Steel** (Gem Icon): Dark steel metallic background with translucent jade glass card backdrops and soft jade glows on hover.
5.  **Volcanic Ash** (Flame Icon): Deep ash black background with red lava and hot gold highlights.

## Local Installation

To install dependencies:
```powershell
npm install
```

To run the local development server:
```powershell
npm run dev
```

To build production bundles:
```powershell
npm run build
```

To configure remote repository targets:
```powershell
git remote add origin REPO_ADDRESS
git branch -M main
git push -u origin main
```
