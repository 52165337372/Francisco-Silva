import React, { useEffect, useRef } from 'react';

interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'system' | 'ai' | 'signal' | 'success' | 'warning' | 'error';
  message: string;
}

interface TerminalProps {
  logs: TerminalLine[];
}

export default function Terminal({ logs }: TerminalProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-hidden h-48 md:h-64 flex flex-col shadow-inner">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-400 font-semibold ml-2 select-none">TERMINAL DE ENTRADAS IA</span>
        </div>
        <span className="text-cyan-500 text-[10px] tracking-widest font-bold">LIVE STREAMING</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-8">Aguardando inicialização dos servidores...</div>
        ) : (
          logs.map((log) => {
            let color = 'text-slate-300';
            let prefix = '[INFO]';
            
            if (log.type === 'system') {
              color = 'text-cyan-400';
              prefix = '⚙️ [SISTEMA]';
            } else if (log.type === 'ai') {
              color = 'text-violet-400';
              prefix = '🤖 [IA MILION]';
            } else if (log.type === 'signal') {
              color = 'text-amber-400 font-semibold';
              prefix = '🎯 [SINAL]';
            } else if (log.type === 'success') {
              color = 'text-emerald-400 font-bold';
              prefix = '💸 [VITÓRIA]';
            } else if (log.type === 'warning') {
              color = 'text-yellow-500';
              prefix = '⚠️ [AVISO]';
            } else if (log.type === 'error') {
              color = 'text-rose-500 font-bold animate-pulse';
              prefix = '❌ [ERRO]';
            }

            return (
              <div key={log.id} className={`leading-relaxed ${color} flex items-start space-x-1.5`}>
                <span className="text-slate-600 select-none flex-shrink-0">{log.timestamp}</span>
                <span className="font-semibold flex-shrink-0">{prefix}</span>
                <span className="break-all">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
