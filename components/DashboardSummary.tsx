import React from 'react';
import { Stats } from '../types';

interface DashboardSummaryProps {
  stats: Stats;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats }) => {
  return (
    <div className="relative mb-12">
      
      {/* Red Header Double Line - The signature of official docs */}
      <div className="border-b-[4px] border-[var(--color-official-red)] mb-[2px]"></div>
      <div className="border-b-[1px] border-[var(--color-official-red)] mb-8"></div>

      {/* Document Meta */}
      <div className="flex justify-between items-end mb-8 font-official text-sm text-stone-500">
        <div>
          <p>文件编号：AUDIT-2024-001</p>
          <p>签发日期：2024年03月15日</p>
        </div>
        <div className="text-right">
          <p>密级：<span className="font-bold text-black">内部资料</span></p>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-10 relative">
        <h1 className="font-official font-black text-3xl md:text-4xl text-[var(--color-official-red)] leading-snug tracking-widest">
          关于投标文件合规性的<br/>审查意见书
        </h1>
        
        {/* The Realistic Stamp */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none mix-blend-multiply">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--color-stamp)] flex flex-col items-center justify-center text-[var(--color-stamp)] animate-stamp opacity-0" 
                  style={{ animationDelay: '0.8s', boxShadow: 'inset 0 0 0 2px white' }}>
                <div className="w-full h-full rounded-full border border-[var(--color-stamp)] flex flex-col items-center justify-center relative p-1">
                    {/* Star in middle */}
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current absolute top-8">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    
                    {/* Arched Text (Simplified CSS approximation) */}
                    <div className="absolute top-2 font-official font-bold text-[10px] tracking-[4px]">智能审查专用章</div>
                    
                    <div className="font-black text-3xl mt-6 tracking-widest border-t-2 border-b-2 border-[var(--color-stamp)] py-1 px-4 transform -rotate-6">
                        {stats.status === 'FAIL' ? '不合格' : '通过'}
                    </div>
                    
                    <div className="absolute bottom-3 font-mono-code text-[8px] opacity-80">
                        NO. {Date.now().toString().slice(-6)}
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border border-stone-800 animate-print opacity-0" style={{ animationDelay: '0.2s' }}>
         {/* Table Headers with subtle tint */}
         <div className="grid grid-cols-4 border-b border-stone-800 font-bold text-sm">
            <div className="p-3 border-r border-stone-800 text-center bg-stone-100">审查项</div>
            <div className="p-3 border-r border-stone-800 text-center text-[var(--color-official-red)] bg-red-50/30">高风险</div>
            <div className="p-3 border-r border-stone-800 text-center text-[var(--color-warning)] bg-[#FFF7ED]">中风险</div>
            <div className="p-3 text-center text-green-700 bg-green-50/30">低风险</div>
         </div>
         {/* Table Body with Ink Wash Gradients */}
         <div className="grid grid-cols-4 font-official text-lg">
            <div className="p-4 border-r border-stone-800 text-center font-bold flex items-center justify-center">总计</div>
            
            {/* High Risk - Red Gradient */}
            <div className="p-4 border-r border-stone-800 text-center text-[var(--color-official-red)] font-black bg-gradient-to-b from-red-100/60 to-transparent">
                {stats.high}
            </div>
            
            {/* Medium Risk - Light Amber/Ochre Gradient (Custom 15% opacity) */}
            <div className="p-4 border-r border-stone-800 text-center text-[var(--color-warning)] font-bold bg-gradient-to-b from-[#B45309]/15 to-transparent">
                {stats.medium}
            </div>
            
            {/* Low Risk - Green Gradient */}
            <div className="p-4 text-center text-green-700 font-bold bg-gradient-to-b from-green-100/60 to-transparent">
                {stats.low}
            </div>
         </div>
      </div>
      
      <div className="mt-4 text-sm font-official text-stone-600 leading-relaxed indent-8 animate-fade opacity-0" style={{ animationDelay: '0.4s' }}>
        <p>
            经系统自动审查，该投标文件存在<span className="font-bold text-black border-b border-stone-400"> {stats.high} </span>项重大合规风险，
            建议<span className="font-bold text-[var(--color-official-red)]"> 立即整改 </span>。
            具体审查明细如下：
        </p>
      </div>
    </div>
  );
};