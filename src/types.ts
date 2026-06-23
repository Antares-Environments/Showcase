export interface PortfolioItem {
  id: string;
  title: string;
  meta: Record<string, string>;
  description: string;
  attachments: string[];
}
