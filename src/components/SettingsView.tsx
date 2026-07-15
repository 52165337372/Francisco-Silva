import React from 'react';
import { UserConfig, Broker } from '../types';
import { Settings, Play, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  config: UserConfig;
  onConfigChange: (newConfig: UserConfig) => void;
  activeBroker: Broker;
  addLog: (type: 'system' | 'ai' | 'signal' | 'success' | 'warning' | 'error', message: string) => void;
}

export default function SettingsView({ config, onConfigChange, activeBroker, addLog }: SettingsViewProps) {
  const handleToggleAuto = () => {
    const newVal = !config.autoBet;
    onConfigChange({ ...config, autoBet: newVal });
    addLog('system', `Modo de Automação ${newVal ? 'ATIVADO' : 'DESATIVADO'} para a corretora [${activeBroker.name}].`);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      onConfigChange({ ...config, betAmount: val });
    }
  };

  const handleMultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 1.1) {
      onConfigChange({ ...config, targetMultiplier: val });
    }
  };

  const handleMinesCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    onConfigChange({ ...config, minesCount: val });
    addLog('system', `Filtro de Minas atualizado para ${val} minas.`);
  };

  const handleStrategyChange = (strategy: 'conservative' | 'balanced' | 'aggressive') => {
    onConfigChange({ ...config, strategy });
    addLog('ai', `Estratégia de operações alterada para: ${strategy.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main robot settings */}
        <div className="lg:col-span-8 bg-[#121216] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base tracking-tight uppercase">PARÂMETROS DE AUTOMAÇÃO</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bet Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Valor da Entrada (BRL)</label>
              <input 
                type="number" 
                value={config.betAmount} 
                onChange={handleBetChange}
                className="w-full bg-[#0a0a0c] border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none transition-colors"
                placeholder="Ex: 20.00"
              />
              <p className="text-[11px] text-white/30">Valor que o robô usará em cada operação automática.</p>
            </div>

            {/* Target multiplier */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Cashout Alvo Aviator (x)</label>
              <input 
                type="number" 
                step="0.05"
                value={config.targetMultiplier} 
                onChange={handleMultChange}
                className="w-full bg-[#0a0a0c] border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none transition-colors"
                placeholder="Ex: 2.00"
              />
              <p className="text-[11px] text-white/30">O robô sairá de forma automática neste multiplicador.</p>
            </div>

            {/* Mines Count selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Quantidade de Minas (Mines)</label>
              <select 
                value={config.minesCount} 
                onChange={handleMinesCountChange}
                className="w-full bg-[#0a0a0c] border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors cursor-pointer"
              >
                <option value={2} className="bg-[#121216]">2 Minas</option>
                <option value={3} className="bg-[#121216]">3 Minas</option>
                <option value={4} className="bg-[#121216]">4 Minas</option>
                <option value={5} className="bg-[#121216]">5 Minas</option>
              </select>
              <p className="text-[11px] text-white/30">Ajusta o gerador de padrões IA de acordo com o número de minas.</p>
            </div>

            {/* Strategy Select Buttons */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase block tracking-wider">Perfil de Risco da IA</label>
              <div className="grid grid-cols-3 gap-2">
                {(['conservative', 'balanced', 'aggressive'] as const).map((strat) => (
                  <button
                    key={strat}
                    onClick={() => handleStrategyChange(strat)}
                    className={`py-2 px-1 text-[10px] font-black rounded-lg uppercase transition cursor-pointer ${
                      config.strategy === strat
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10'
                        : 'bg-[#0a0a0c] text-white/40 hover:text-white border border-white/5'
                    }`}
                  >
                    {strat === 'conservative' ? 'Seguro' : strat === 'balanced' ? 'Moderado' : 'Agressivo'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/30">Filtra os gatilhos e assertividades mínimas para entradas.</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white uppercase">Ativar Entradas Automáticas</p>
              <p className="text-xs text-white/40">Autorizar o Aeromilion a disparar ordens automaticamente na corretora conectada.</p>
            </div>
            
            <button 
              onClick={handleToggleAuto}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                config.autoBet 
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{config.autoBet ? 'PARAR OPERAÇÃO' : 'INICIAR AUTOMAÇÃO'}</span>
            </button>
          </div>
        </div>

        {/* Security / Info widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121216] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>SEGURANÇA E STOP LOCK</span>
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="bg-[#0a0a0c] border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold uppercase text-[9px] tracking-wider">Autoproteção Ativa</p>
                  <p className="text-white/40 text-[11px] mt-0.5">O robô calcula as probabilidades em milissegundos e cancela a aposta em caso de instabilidade na corretora.</p>
                </div>
              </div>

              <div className="bg-[#0a0a0c] border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold uppercase text-[9px] tracking-wider">Garantias de Capital</p>
                  <p className="text-white/40 text-[11px] mt-0.5">Definido stop loss automático em caso de 3 derrotas consecutivas na corretora conectada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
