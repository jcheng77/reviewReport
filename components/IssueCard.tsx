import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, ScrollText } from 'lucide-react';
import { Issue } from '../types';
import { RiskBadge } from './RiskBadge';

interface IssueCardProps {
  issue: Issue;
  index: number;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, index }) => {
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  // Convert number to Chinese numeral roughly for the 'Section' feel
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const sectionNum = chineseNumbers[index] || (index + 1);

  return (
    <div className="group mb-8 pb-6 border-b border-stone-300 relative transition-all duration-300">
      
      {/* Header Line */}
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-xl font-bold font-official text-stone-900 group-hover:text-[var(--color-official-red)] transition-colors duration-300">
            {sectionNum}、{issue.title}
        </h3>
      </div>

      <div className="pl-0 md:pl-8">
        {/* Meta Line */}
        <div className="flex items-center gap-4 mb-3 text-sm">
            <RiskBadge level={issue.level} />
            <span className="font-mono-code text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-sm">
                第 {issue.page} 页
            </span>
        </div>

        {/* Content Body */}
        <p className="font-official text-stone-700 text-base leading-7 text-justify mb-4">
            {issue.description}
        </p>

        {/* Action Link - Moved to Left (justify-start) */}
        <div className="flex justify-start">
            <button 
                onClick={() => setIsSourceOpen(!isSourceOpen)}
                className={`
                    text-xs font-bold font-official flex items-center gap-1 transition-all px-0 py-1.5 rounded
                    ${isSourceOpen 
                        ? 'text-[var(--color-official-red)]' 
                        : 'text-stone-500 hover:text-[var(--color-official-red)]'
                    }
                `}
            >
                {isSourceOpen ? '收起招标文件条款' : '查看招标文件条款'} 
                {isSourceOpen ? <ChevronUp size={12} /> : <ArrowRight size={12} />}
            </button>
        </div>

        {/* Source Tracing Box - Expandable "Attachment" Style */}
        <div 
            className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${isSourceOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
            `}
        >
            <div className="bg-[#EBEBE8] border-l-[3px] border-stone-400 p-4 rounded-r-sm relative">
                {/* Visual anchor icon */}
                <div className="absolute top-3 right-3 opacity-10">
                    <ScrollText size={48} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.5 border border-stone-300">原文对照</span>
                    <span className="text-xs font-bold text-stone-600 font-official">
                        {issue.lawReference || '相关条款'}
                    </span>
                </div>

                <p className="font-serif text-sm text-stone-800 leading-6 text-justify italic mix-blend-multiply">
                    “{issue.sourceClause || '暂无对应原文条款内容。'}”
                </p>

                {/* Subtle highlight effect to simulate marker */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-20"></div>
            </div>
        </div>
      </div>
    </div>
  );
};