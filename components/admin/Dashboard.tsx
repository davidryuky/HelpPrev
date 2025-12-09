import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, CalendarRange, CheckCircle, Globe, Activity, PieChart, MapPin } from 'lucide-react';
import { Lead } from '../Admin';

interface DashboardProps {
  leads: Lead[];
  visitCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, visitCount }) => {
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = leads.length;
    const now = new Date();
    const today = now.toLocaleDateString('pt-BR');
    const todayCount = leads.filter(l => new Date(l.created_at).toLocaleDateString('pt-BR') === today).length;
    
    const inService = leads.filter(l => l.status === 'em_atendimento' || l.status === 'lido').length;
    const conversionRate = total > 0 ? Math.round((inService / total) * 100) : 0;

    const byType: {[key: string]: number} = {};
    leads.forEach(l => { byType[l.type] = (byType[l.type] || 0) + 1; });
    const topTypes = Object.entries(byType).sort(([,a], [,b]) => b - a).slice(0, 5); 

    const byState: {[key: string]: number} = {};
    leads.forEach(l => { if(l.state) byState[l.state] = (byState[l.state] || 0) + 1; });
    const topStates = Object.entries(byState).sort(([,a], [,b]) => b - a).slice(0, 5); 

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const fullDateStr = d.toLocaleDateString('pt-BR'); 
      const count = leads.filter(l => new Date(l.created_at).toLocaleDateString('pt-BR') === fullDateStr).length;
      last30Days.push({ date: dateStr, count });
    }

    return { total, todayCount, conversionRate, topTypes, topStates, last30Days };
  }, [leads]);

  const chartData = useMemo(() => {
    if (stats.last30Days.length === 0) return { points: '', data: [], max: 0, avg: 0 };
    
    const values = stats.last30Days.map(d => d.count);
    const maxVal = Math.max(...values, 5);
    
    const dataPoints = stats.last30Days.map((d, i) => {
      const x = (i / (stats.last30Days.length - 1)) * 100;
      const y = 100 - ((d.count / maxVal) * 80) - 10;
      return { x, y, ...d };
    });
    
    const pointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
    
    return { points: pointsStr, data: dataPoints, max: maxVal, avg: Math.round(maxVal / 2) };
  }, [stats.last30Days]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
         <BarChart3 className="text-amber-500" /> Dashboard de Performance
      </h2>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-sm text-slate-500 font-medium">Total de Leads</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><TrendingUp size={24} /></div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-sm text-slate-500 font-medium">Leads Hoje</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.todayCount}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full text-amber-600"><CalendarRange size={24} /></div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-sm text-slate-500 font-medium">Taxa de Atendimento</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.conversionRate}%</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={24} /></div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
               <p className="text-sm text-slate-500 font-medium">Visitas no Site</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-1">{visitCount}</h3>
            </div>
            <div className="bg-cyan-100 p-3 rounded-full text-cyan-600"><Globe size={24} /></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Gráfico Linear */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Activity size={18} className="text-amber-500" /> Fluxo de Leads (30 Dias)
               </h3>
               <div className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                   Média Diária: {(stats.last30Days.reduce((acc, curr) => acc + curr.count, 0) / 30).toFixed(1)}
               </div>
            </div>
            
            <div className="relative h-64 w-full select-none pl-8" onMouseLeave={() => setHoveredChartIndex(null)}>
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-medium py-[10%] pr-2 border-r border-slate-100">
                 <span className="text-right">{chartData.max}</span>
                 <span className="text-right">{chartData.avg}</span>
                 <span className="text-right">0</span>
              </div>
              <div className="relative w-full h-full">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible z-0">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2"/>
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2"/>
                    <line x1="0" y1="90" x2="100" y2="90" stroke="#f1f5f9" strokeWidth="0.5" />
                    {chartData.points && (
                      <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" points={chartData.points} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" className="drop-shadow-sm" />
                    )}
                  </svg>
                  {chartData.data.map((p, i) => (
                      <div key={i} className="absolute z-10 group" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }} onMouseEnter={() => setHoveredChartIndex(i)}>
                         <div className="w-4 h-4 rounded-full bg-transparent cursor-pointer"></div>
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-white transition-all duration-200 pointer-events-none ${hoveredChartIndex === i ? 'w-3 h-3 border-amber-600 shadow-md scale-125' : 'w-1.5 h-1.5'}`}></div>
                          {hoveredChartIndex === i && (
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                                   <span className="font-bold text-base">{p.count}</span>
                                   <span className="text-[10px] text-slate-400 uppercase font-semibold">{p.date}</span>
                                   <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900"></div>
                               </div>
                          )}
                      </div>
                  ))}
              </div>
            </div>
            {chartData.data.length === 0 && <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados recentes</div>}
         </div>

         {/* Tops */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18} className="text-slate-400" /> Demandas</h3>
               <div className="space-y-4">
                  {stats.topTypes.map(([type, count]) => (
                     <div key={type}>
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">{type}</span><span className="text-slate-500">{count}</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div></div>
                     </div>
                  ))}
                  {stats.topTypes.length === 0 && <p className="text-xs text-slate-400">Sem dados.</p>}
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> Estados</h3>
               <div className="space-y-4">
                  {stats.topStates.map(([uf, count]) => (
                     <div key={uf}>
                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">{uf}</span><span className="text-slate-500">{count}</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div></div>
                     </div>
                  ))}
                   {stats.topStates.length === 0 && <p className="text-xs text-slate-400">Sem dados.</p>}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};