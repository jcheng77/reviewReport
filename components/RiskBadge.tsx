import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  // In official docs, "badges" are often just bold text or bracketed text
  // Medium is now Ochre (Rust/Gold) using the css variable
  const colorClass = level === 'HIGH' ? 'text-[var(--color-official-red)]' : 
                     level === 'MEDIUM' ? 'text-[var(--color-warning)]' : 'text-green-700';
  
  const label = level === 'HIGH' ? '重大风险' : level === 'MEDIUM' ? '中度风险' : '低度风险';

  return (
    <span className={`font-bold font-official tracking-wide ${colorClass} inline-flex items-center gap-1`}>
      <span>【{label}】</span>
    </span>
  );
};