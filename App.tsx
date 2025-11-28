import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Issue, Stats, RiskLevel } from './types';
import { IssueCard } from './components/IssueCard';
import { DashboardSummary } from './components/DashboardSummary';

const MOCK_STATS: Stats = {
  high: 11,
  medium: 2,
  low: 0,
  status: 'FAIL'
};

const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    level: 'HIGH',
    page: 3,
    title: '竞选函缺少法定代表人签字',
    description: '在投标文件第3页的“竞选函”中，要求法定代表人或其委托代理人签字或盖章的位置为空白，未签署。此项缺失违反招标文件关于签署有效性的强制性规定。',
    sourceClause: '3.1.2 投标文件签署要求：竞选函、授权委托书及报价文件必须由投标人法定代表人或其委托代理人签字并加盖公章。未按要求签字或盖章的，将作为废标处理。',
    lawReference: '招标文件第三章 §3.1.2'
  },
  {
    id: '2',
    level: 'HIGH',
    page: 5,
    title: '授权委托书效力瑕疵',
    description: '在投标文件第5页的“授权委托书”中，法定代表人和委托代理人的签字栏均为空白，且未加盖公章，无法确认代理权限的合法性。',
    sourceClause: '3.2.4 授权委托书应明确代理权限、代理期限，并附法定代表人及代理人身份证复印件。委托书必须由法定代表人签字并加盖公章。',
    lawReference: '招标文件第三章 §3.2.4'
  },
  {
    id: '3',
    level: 'MEDIUM',
    page: 7,
    title: '财务报表年份不完整',
    description: '投标文件提供的财务审计报告缺失2022年度利润表，仅提供了资产负债表。虽然不构成废标条款，但属于评分扣分项。',
    sourceClause: '4.1.1 财务状况：投标人需提供近三年（2021-2023）经审计的完整财务报告，包括资产负债表、利润表及现金流量表。',
    lawReference: '招标文件第四章 §4.1.1'
  },
  {
    id: '4',
    level: 'HIGH',
    page: 9,
    title: '报价明细表计算逻辑错误',
    description: '投标报价明细表中分项合计与总价不符，第9页单价汇总计算有误，差异金额超过允许误差范围（0.5%），需重新核对。',
    sourceClause: '5.3.1 报价计算错误修正原则：分项报价之和与总价不一致的，以分项报价之和为准修正总价；大写金额与小写金额不一致的，以大写金额为准。',
    lawReference: '招标文件第五章 §5.3.1'
  }
];

type FilterType = 'ALL' | RiskLevel;

// --- Mock PDF Content Component ---
const MockPDFContent = () => (
  <div className="bg-white w-full h-full shadow-lg p-12 md:p-16 text-stone-800 font-serif leading-loose text-justify relative select-none">
    {/* PDF Page Header */}
    <div className="absolute top-8 left-12 right-12 border-b border-stone-200 pb-2 flex justify-between text-xs text-stone-400 font-sans">
      <span>智慧城市建设项目投标文件</span>
      <span>机密 · 2024-03-15</span>
    </div>

    {/* PDF Mock Body Text */}
    <div className="space-y-6 mt-4 opacity-80 scale-95 origin-top">
      <h2 className="text-2xl font-bold text-center mb-10 text-black">第三章 投标文件格式</h2>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg">一、 投标函及投标函附录</h3>
        <p>致：<span className="underline decoration-dotted mx-1">（招标人名称）</span></p>
        <p className="indent-8">
          1. 依据已收到的招标文件，我们遵照《中华人民共和国招标投标法》及相关规定，经详细研究招标文件及其补充文件（如有）后，我们愿意参与上述项目的投标。
        </p>
        <p className="indent-8">
          2. 我们承诺，若中标，将严格按照招标文件及合同条款的要求，在规定的期限内完成全部项目工作，并承担相应的法律责任。
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-bold text-lg text-red-800 border-2 border-red-500 p-2 inline-block rounded relative">
          <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded font-sans">疑点位置</span>
          二、 法定代表人身份证明
        </h3>
        <p className="indent-8">
          投标人名称：<span className="underline w-40 inline-block text-center">XX科技股份有限公司</span>
        </p>
        <p className="indent-8">
          单位性质：<span className="underline w-40 inline-block text-center">股份有限公司</span>
        </p>
        <p className="indent-8">
          成立时间：<span className="underline w-40 inline-block text-center">2010年05月20日</span>
        </p>
        <p className="indent-8">
          经营期限：<span className="underline w-40 inline-block text-center">长期</span>
        </p>
      </div>
      
      <div className="mt-12 flex justify-end pr-12">
        <div className="text-center w-40">
           <div className="h-16 border-b border-black mb-2 flex items-center justify-center text-stone-300 italic">
             (此处签字缺失)
           </div>
           <p>法定代表人签字</p>
        </div>
      </div>
    </div>
    
    {/* Page Number */}
    <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-stone-400 font-sans">
      - 3 -
    </div>
  </div>
);


const App: React.FC = () => {
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
        setKey(prev => prev + 1);
        setLoading(false);
        setActiveFilter('ALL');
    }, 300);
  };

  const filteredIssues = useMemo(() => {
    if (activeFilter === 'ALL') return MOCK_ISSUES;
    return MOCK_ISSUES.filter(issue => issue.level === activeFilter);
  }, [activeFilter]);

  const FilterTab = ({ type, label, count }: { type: FilterType, label: string, count?: number }) => {
    const isActive = activeFilter === type;
    const activeColorClass = 
        type === 'HIGH' ? 'text-[var(--color-official-red)]' :
        type === 'MEDIUM' ? 'text-[var(--color-warning)]' :
        'text-stone-900'; 

    const baseColorClass = isActive ? activeColorClass : 'text-stone-500 hover:text-stone-800';

    return (
      <button 
        onClick={() => setActiveFilter(type)}
        className={`
          relative px-2 md:px-4 py-2 text-sm font-official transition-all duration-300 whitespace-nowrap
          ${isActive ? 'font-bold' : ''}
          ${baseColorClass}
        `}
      >
        <span className="relative z-10 flex items-center gap-1">
            {label} 
            {count !== undefined && <span className="text-xs opacity-80 font-mono-code">({count})</span>}
        </span>
        {isActive && (
          <span className={`absolute bottom-1 left-2 right-2 h-[2px] rounded-full opacity-80 ${
            type === 'HIGH' ? 'bg-[var(--color-official-red)]' : 
            type === 'MEDIUM' ? 'bg-[var(--color-warning)]' : 
            'bg-stone-800'
          }`}></span>
        )}
      </button>
    );
  };

  return (
    <div key={key} className="flex h-screen w-full overflow-hidden bg-[#CBD5E1]">
      
      {/* ---------------- LEFT PANEL: PDF PREVIEW (60%) ---------------- */}
      {/* Clean View: Light gray background, centered document, no toolbar */}
      <div className="w-[60%] h-full bg-stone-100 flex justify-center overflow-y-auto custom-scrollbar p-8">
        <div className="w-full max-w-4xl bg-white shadow-2xl min-h-[1200px] h-fit transition-transform duration-300 ease-out origin-top">
          <MockPDFContent />
        </div>
      </div>

      {/* ---------------- RIGHT PANEL: AUDIT REVIEW (40%) ---------------- */}
      <div className="w-[40%] h-full bg-[#CBD5E1] relative flex flex-col">
        
        {/* Right Scrollable Area - PADDING 8px */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="bg-paper shadow-xl min-h-[900px] p-8 relative transition-opacity duration-500 w-full"
                 style={{ opacity: loading ? 0.8 : 1 }}>
              
              <DashboardSummary stats={MOCK_STATS} />

              {/* Sticky Filter Bar Effect */}
              <div className="sticky top-0 bg-paper/95 backdrop-blur-sm z-30 py-4 border-b border-stone-200 mb-6 transition-all animate-fade opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <div className="flex justify-center flex-wrap gap-1">
                    <FilterTab type="ALL" label="全部" count={MOCK_ISSUES.length} />
                    <FilterTab type="HIGH" label="高风险" count={MOCK_STATS.high} />
                    <FilterTab type="MEDIUM" label="中风险" count={MOCK_STATS.medium} />
                    <FilterTab type="LOW" label="低风险" count={MOCK_STATS.low} />
                </div>
              </div>

              <div className="animate-fade opacity-0 min-h-[400px]" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue, index) => (
                        <IssueCard key={issue.id} issue={issue} index={index} />
                    ))
                  ) : (
                    <div className="text-center py-20 text-stone-400 font-official italic">
                      此类别下无审查发现
                    </div>
                  )}
              </div>

              <div className="mt-20 pt-8 border-t border-stone-300 flex justify-between items-end text-sm font-official text-stone-500">
                  <div className="text-center w-full">
                      <p>审查报告 · 内部存档</p>
                      <p className="text-xs mt-1 transform scale-90">Powered by AI Audit</p>
                  </div>
              </div>
            </div>
        </div>

        {/* Floating Action Button (Positioned absolute within right panel) */}
        <button 
          onClick={handleReload}
          className="absolute bottom-8 right-8 w-12 h-12 bg-stone-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-official-red)] transition-colors z-50 group"
          title="重新审查"
        >
          <RefreshCw size={20} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

    </div>
  );
};

export default App;