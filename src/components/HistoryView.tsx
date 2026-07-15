import React from 'react';
import { Operation } from '../types';
import { TrendingUp, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HistoryViewProps {
  operations: Operation[];
}

export default function HistoryView({ operations }: HistoryViewProps) {
  return (
    <div className="bg-[#121216] border border-white/5 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-white text-base tracking-tight uppercase">HISTÓRICO DE SINAIS E ENTRADAS</h3>
          <p className="text-xs text-white/40">Relatório detalhado das operações efetuadas automaticamente pela inteligência artificial.</p>
        </div>
        <span className="text-xs font-mono bg-[#0a0a0c] border border-white/5 px-3 py-1 rounded-full text-white/60">
          Total: {operations.length} Operações
        </span>
      </div>

      <div className="overflow-x-auto">
        {operations.length === 0 ? (
          <div className="text-center py-16 space-y-2 text-white/30">
            <HelpCircle className="w-8 h-8 text-white/20 mx-auto animate-pulse" />
            <p className="text-sm font-semibold">Nenhum sinal operado ainda.</p>
            <p className="text-xs text-white/20">Ative o modo de automação para que o robô faça entradas automáticas nas corretoras.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Data/Hora</th>
                <th className="py-3 px-2">Corretora</th>
                <th className="py-3 px-2">Plataforma/Jogo</th>
                <th className="py-3 px-2">Valor Entrada</th>
                <th className="py-3 px-2">Multiplicador</th>
                <th className="py-3 px-2 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {[...operations].reverse().map((op) => {
                const isWin = op.status === 'WIN';
                
                return (
                  <tr key={op.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-2 text-white/40">{op.timestamp}</td>
                    <td className="py-3.5 px-2">
                      <span className="font-sans font-bold bg-[#0a0a0c] border border-white/5 px-2 py-0.5 rounded-full text-[10px] text-white/80">
                        {op.brokerName}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-white/80">
                      <span className="font-sans font-bold capitalize flex items-center gap-1.5">
                        <span>{op.game === 'aviator' ? '🚀 Aviator' : '💣 Mines'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-white/80">R$ {op.betAmount.toFixed(2)}</td>
                    <td className="py-3.5 px-2 text-white/80">
                      {op.cashoutValue ? (
                        <span className="text-cyan-400 font-bold">{op.cashoutValue.toFixed(2)}x</span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`inline-flex items-center gap-1 font-sans font-black px-2 py-1 rounded-full text-[10px] ${
                        isWin 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {isWin ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>+{op.profit.toFixed(2)} BRL</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>-{Math.abs(op.profit).toFixed(2)} BRL</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
