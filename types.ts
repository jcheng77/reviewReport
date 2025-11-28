
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Issue {
  id: string;
  level: RiskLevel;
  page: number;
  title: string;
  description: string;
  sourceClause?: string; // The original text from the bidding document
  lawReference?: string; // Specific section number e.g., "Section 3.1.2"
}

export interface Stats {
  high: number;
  medium: number;
  low: number;
  status: 'PASS' | 'FAIL';
}
