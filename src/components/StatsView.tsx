import React from 'react';
import { Operation, Broker } from '../types';
import { TrendingUp, Award, Activity, Calendar, ShieldCheck, DollarSign } from 'lucide-react';

interface StatsViewProps {
  operations: Operation[];
  brokers: Broker[];
}

export default function StatsView({ operations, brokers }: StatsViewProps) {
  // Calculate analytics
  const totalOperations = operations.length;
  const wins = operations.filter((op) => op.status === 'WIN');
  const losses = operations.filter((op) => op.status === 'LOSS');
  const winCount = wins.length;
  const lossCount = losses.length;
  const winRate = totalOperations > 0 ? (winCount / totalOperations) * 100 : 0;
  
  const totalProfit = operations.reduce((sum, op) => sum + op.profit, 0);
  const totalBet = operations.reduce((sum, op) => sum + op.betAmount, 0);
  const roi = totalBet > 0 ? (totalProfit / totalBet) * 100 : 0;

  // Group profit by broker
  const brokerProfit = brokers.map((b) => {
    const bOps = operations.filter((op) => op.brokerId === b.id);
    const profit = bOps.reduce((sum, op) => sum + op.profit, 0);
    const opsCount = bOps.length;
    return { ...b, profit, opsCount };
  });

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Lucro Total</p>
            <p className={`text-lg font-black font-mono mt-0.5 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              R$ {totalProfit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Assertividade</p>
            <p className="text-lg font-black font-mono mt-0.5 text-cyan-400">
              {winRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Entradas IA</p>
            <p className="text-lg font-black font-mono mt-0.5 text-amber-400">
              {totalOperations}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Retorno (ROI)</p>
            <p className={`text-lg font-black font-mono mt-0.5 ${roi >= 0 ? 'text-violet-400' : 'text-rose-500'}`}>
              {roi.toFixed(1)}%
            </p>
          </div>
        </div>

      </div>

      {/* Charts & Broker breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Custom Profit Progress Graph */}
        <div className="lg:col-span-7 bg-[#121216] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>EVOLUÇÃO DO CAPITAL (IA)</span>
            </h4>
            <p className="text-xs text-white/40">Acompanhamento de lucro acumulado ao longo das últimas rodadas operadas.</p>
          </div>

          <div className="h-44 flex items-end justify-center relative mt-4">
            {operations.length === 0 ? (
              <span className="text-xs text-white/30 font-mono mb-16">Nenhuma operação registrada para traçar o gráfico.</span>
            ) : (
              <div className="w-full h-full flex flex-col justify-between pt-2">
                {/* Visual Line chart container */}
                <svg className="w-full h-32 overflow-visible">
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="100%" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="100%" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* Draw curve path based on accumulated profit */}
                  {(() => {
                    let accProfit = 0;
                    const points = operations.map((op, idx) => {
                      accProfit += op.profit;
                      const x = (idx / Math.max(1, operations.length - 1)) * 100; // percent
                      // Scale profit to fit SVG height (from 0 to 100px)
                      const maxAbsProfit = Math.max(...operations.map((_, i) => {
                        let temp = 0;
                        for (let j = 0; j <= i; j++) temp += operations[j].profit;
                        return Math.abs(temp);
                      }), 50);
                      const y = 50 - (accProfit / maxAbsProfit) * 40; // centered with margin
                      return { x, y };
                    });

                    const pathD = points.length > 1 
                      ? points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x}% ${p.y}`).join(' ')
                      : `M 0% 50 L 100% 50`;

                    const areaD = `${pathD} L 100% 120 L 0% 120 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#profitGrad)" />
                        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, idx) => (
                          <circle 
                            key={idx} 
                            cx={`${p.x}%`} 
                            cy={p.y} 
                            r="4.5" 
                            fill="#0891b2" 
                            stroke="#22d3ee" 
                            strokeWidth="2.5" 
                            className="hover:scale-150 transition-transform cursor-pointer"
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
                <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1 pt-1 border-t border-white/5">
                  <span>Início</span>
                  <span>Última Entrada</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Broker Breakdown */}
        <div className="lg:col-span-5 bg-[#121216] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>CORRETORAS CONECTADAS</span>
            </h4>
            <p className="text-xs text-white/40">Balanço do robô em cada corretora integrada.</p>
          </div>

          <div className="space-y-4 mt-4 flex-1 flex flex-col justify-center">
            {brokerProfit.map((broker) => {
              const profitPercentage = totalProfit > 0 ? (Math.max(0, broker.profit) / totalProfit) * 100 : 0;
              
              return (
                <div key={broker.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white/80 flex items-center gap-1.5">
                      <span className="text-sm">{broker.logo}</span>
                      <span>{broker.name}</span>
                    </span>
                    <span className={`font-mono font-bold ${broker.profit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      R$ {broker.profit.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Progress Bar background */}
                  <div className="w-full h-2 bg-[#0a0a0c] rounded-full overflow-hidden border border-white/5">
                    <div 
                      style={{ width: `${Math.min(100, Math.max(5, broker.opsCount > 0 ? profitPercentage : 0))}%` }}
                      className={`h-full bg-gradient-to-r ${broker.color}`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-white/30 font-mono">
                    <span>{broker.opsCount} operações</span>
                    <span>{broker.opsCount > 0 ? `${((broker.opsCount / Math.max(1, totalOperations)) * 100).toFixed(0)}%` : 'Sem entradas'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
