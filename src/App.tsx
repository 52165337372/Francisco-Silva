import React, { useState, useEffect } from 'react';
import { Broker, Operation, UserConfig, UserProfile, Signal } from './types';
import { BROKERS } from './data/brokers';
import Login from './components/Login';
import Terminal from './components/Terminal';
import AviatorEmulator from './components/AviatorEmulator';
import MinesEmulator from './components/MinesEmulator';
import StatsView from './components/StatsView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import DownloadModal from './components/DownloadModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  LogOut, 
  TrendingUp, 
  History, 
  Sliders, 
  User, 
  Cpu, 
  Play, 
  Square,
  Sparkles,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Download
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'robot' | 'history' | 'stats' | 'settings' | 'profile'>('robot');
  const [activeGame, setActiveGame] = useState<'aviator' | 'mines'>('aviator');
  
  // App states
  const [profile, setProfile] = useState<UserProfile>({
    name: 'FCS SILVA',
    email: 'FCS.SILVA554@gmail.com',
    balance: 500.00,
    subscription: 'VIP',
    subscriptionEnd: 'VITALÍCIO',
    activeBrokerId: BROKERS[0].id // Default ApostaMax
  });

  const [config, setConfig] = useState<UserConfig>({
    autoBet: true,
    betAmount: 10.00,
    targetMultiplier: 2.00,
    maxLoss: 100.00,
    targetProfit: 300.00,
    strategy: 'balanced',
    minesCount: 3
  });

  const [activeBroker, setActiveBroker] = useState<Broker>(BROKERS[0]);
  const [brokerSelectorOpen, setBrokerSelectorOpen] = useState<boolean>(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  
  const [terminalLogs, setTerminalLogs] = useState<any[]>([
    {
      id: 'log_init',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      message: 'Robô Aeromilion v4.2 Inicializado com Sucesso.'
    }
  ]);

  // Handle active broker changing from selector in top-right corner
  const handleBrokerChange = (broker: Broker) => {
    setActiveBroker(broker);
    setProfile(prev => ({ ...prev, activeBrokerId: broker.id }));
    setBrokerSelectorOpen(false);

    // Logs sequence
    addLog('system', `Desconectando dos servidores de operações anteriores...`);
    setTimeout(() => {
      addLog('system', `Conectando canal de automação à corretora [${broker.name}]...`);
    }, 400);
    setTimeout(() => {
      addLog('success', `Robô sincronizado com sucesso! [${broker.name}] pronto para operações automáticas.`);
    }, 1000);
  };

  const addLog = (type: 'system' | 'ai' | 'signal' | 'success' | 'warning' | 'error', message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev, { id: Math.random().toString(36), timestamp, type, message }]);
  };

  // When a simulated operation finishes
  const handleOperationComplete = (op: Operation) => {
    setOperations(prev => [...prev, op]);
    setProfile(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance + op.profit)
    }));
  };

  // Simulate background AI signals
  useEffect(() => {
    if (!isAuthenticated) return;

    // Conect active broker on auth
    addLog('system', `Servidores de Sinais IA operando com latência otimizada.`);
    addLog('ai', `Fórmula de velas altas detectada! Analisando padrões...`);

    const interval = setInterval(() => {
      const isAviator = Math.random() > 0.4;
      const targetM = (1.5 + Math.random() * 2.5);
      
      if (isAviator) {
        addLog('signal', `[SINAL IA] Oportunidade no Aviator! Entrada recomendada em multiplicador de até ${targetM.toFixed(2)}x.`);
      } else {
        addLog('signal', `[SINAL IA] Oportunidade no Mines! Entrada recomendada para ${config.minesCount} minas.`);
      }
    }, 25000); // Trigger a generic background tip every 25s

    return () => clearInterval(interval);
  }, [isAuthenticated, config.minesCount]);

  const handleLoginSuccess = (name: string, email: string) => {
    setProfile(prev => ({ ...prev, name, email }));
    setIsAuthenticated(true);
    addLog('system', `Sessão autenticada para o usuário VIP: ${name}`);
    addLog('system', `Conectando ao terminal de sinais seguro...`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} userEmail={profile.email} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e1e1e6] flex font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="w-64 bg-[#121216] border-r border-white/5 flex-col p-6 hidden md:flex shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 via-orange-500 to-cyan-500 rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-red-500/10 rotate-12">
            <img 
              src="https://media.base44.com/images/public/6a4e7796e7685da4b5210a7f/6d1691f46_logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain filter drop-shadow-md select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase leading-none">Aeromilion</h1>
            <span className="text-[9px] font-mono font-bold text-cyan-500 tracking-wider uppercase">SINAIS IA v4.2</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-grow">
          <button 
            onClick={() => setActiveTab('robot')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-xl transition ${
              activeTab === 'robot' 
                ? 'bg-white/5 border-l-2 border-cyan-500 text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Robô Sinais</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-xl transition ${
              activeTab === 'history' 
                ? 'bg-white/5 border-l-2 border-cyan-500 text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-xl transition ${
              activeTab === 'stats' 
                ? 'bg-white/5 border-l-2 border-cyan-500 text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Estatísticas</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-xl transition ${
              activeTab === 'settings' 
                ? 'bg-white/5 border-l-2 border-cyan-500 text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configurações</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-xl transition ${
              activeTab === 'profile' 
                ? 'bg-white/5 border-l-2 border-cyan-500 text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </button>
        </nav>

        {/* Promo VIP Card with Download Button */}
        <div className="mt-auto p-4 bg-cyan-500/5 border border-white/5 rounded-2xl flex flex-col gap-3">
          <div>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">Plano VIP</p>
            <p className="text-sm text-white font-black">Acesso Vitalício</p>
          </div>
          <button 
            onClick={() => setShowDownloadModal(true)}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2.5 px-3 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 animate-pulse" />
            <span>Baixar Aeromilion</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header - Unified for Desktop & Mobile */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          
          {/* Left section: Server Status & Mobile Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Logo display */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-cyan-500 rounded-lg flex items-center justify-center p-1">
                <img 
                  src="https://media.base44.com/images/public/6a4e7796e7685da4b5210a7f/6d1691f46_logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h1 className="text-sm font-black tracking-tight text-white uppercase leading-none md:hidden">Aeromilion</h1>
            </div>

            <span className="flex items-center gap-2 text-xs md:text-sm text-white/60">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Servidores Sinais IA:</span> <span className="text-green-400 font-bold">Online</span>
            </span>
          </div>

          {/* Right section: Broker selector, user card, logout */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* ACTIVE BROKER SELECTOR */}
            <div className="relative">
              <button 
                onClick={() => setBrokerSelectorOpen(!brokerSelectorOpen)}
                className="flex items-center gap-2 bg-[#16161e] border border-white/10 rounded-xl px-3 py-1.5 md:px-4 md:py-2.5 hover:bg-[#1f1f2a] transition cursor-pointer text-left"
              >
                <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${activeBroker.color} text-white font-bold flex items-center justify-center text-[10px] select-none`}>
                  {activeBroker.logo}
                </div>
                <div className="text-[11px] leading-none">
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Corretora</p>
                  <p className="font-extrabold text-cyan-400 mt-0.5">{activeBroker.name}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${brokerSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {brokerSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setBrokerSelectorOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#121216] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="bg-[#0a0a0c] px-3.5 py-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[9px] font-bold text-white/40 tracking-wider uppercase">Conectar Corretora</span>
                      </div>
                      <div className="p-1 space-y-0.5">
                        {BROKERS.map((broker) => {
                          const isSelected = broker.id === activeBroker.id;
                          return (
                            <button
                              key={broker.id}
                              onClick={() => handleBrokerChange(broker)}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                                isSelected 
                                  ? 'bg-white/5' 
                                  : 'hover:bg-white/5/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${broker.color} text-white font-black flex items-center justify-center text-xs shadow-sm`}>
                                  {broker.logo}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-white">{broker.name}</h4>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Balance Info - Desktop */}
            <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{profile.name}</p>
                <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider">Banca: R$ {profile.balance.toFixed(2)}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full border border-white/10 flex items-center justify-center text-xs font-black text-[#0a0a0c] select-none">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Download button */}
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="p-2 text-cyan-400 hover:text-cyan-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/10 px-2.5 py-1.5"
              title="Baixar Aeromilion"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-black hidden xs:inline tracking-wider">Baixar App</span>
            </button>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-red-400 rounded-xl transition cursor-pointer"
              title="Sair do App"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
          
          {/* Dynamic Warning of direct link broker */}
          <div className="bg-cyan-500/5 border border-cyan-500/10 p-3.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-cyan-400">
            <div className="flex items-start md:items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 md:mt-0" />
              <p>
                O robô Aeromilion está conectado e automatizado na corretora <strong className="text-white font-bold">{activeBroker.name}</strong>. 
                As operações de IA são gravadas na simulação abaixo em tempo real.
              </p>
            </div>
            <a 
              href={activeBroker.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="shrink-0 bg-cyan-500 hover:bg-cyan-600 text-black font-black px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition"
            >
              <span>Entrar na {activeBroker.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Active Router Tab panel */}
          <div className="min-h-[400px]">
            {activeTab === 'robot' && (
              <div className="space-y-6">
                
                {/* Unified stats overview row matching Sophisticated Dark */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl">
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Modo Automático</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white uppercase italic">{config.autoBet ? 'Ligado' : 'Desativado'}</span>
                      <button 
                        onClick={() => setConfig(prev => ({ ...prev, autoBet: !prev.autoBet }))}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${config.autoBet ? 'bg-cyan-500' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-[#0a0a0c] rounded-full transition-transform ${config.autoBet ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl">
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Banca Atual</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-emerald-400 font-mono">R$ {profile.balance.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl">
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Lucro de Hoje</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-cyan-400 font-mono">R$ {operations.reduce((sum, o) => sum + o.profit, 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-white/5 p-4 rounded-2xl">
                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Assertividade IA</h3>
                    <span className="text-lg font-black text-white font-mono">
                      {operations.length > 0 ? ((operations.filter(o => o.status === 'WIN').length / operations.length) * 100).toFixed(1) : '98.4'}%
                    </span>
                  </div>
                </div>

                {/* Main section: Columns with simulator and terminal logs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Active Simulator Panel */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Game Type Selection */}
                    <div className="bg-[#121216]/80 border border-white/5 p-1 rounded-xl flex space-x-1 w-full max-w-xs">
                      <button
                        onClick={() => setActiveGame('aviator')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeGame === 'aviator'
                            ? 'bg-cyan-500 text-black font-black shadow-md'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        🚀 <span>Aviator</span>
                      </button>
                      <button
                        onClick={() => setActiveGame('mines')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeGame === 'mines'
                            ? 'bg-cyan-500 text-black font-black shadow-md'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        💣 <span>Mines</span>
                      </button>
                    </div>

                    {/* Simulation components */}
                    {activeGame === 'aviator' ? (
                      <AviatorEmulator 
                        activeBroker={activeBroker}
                        autoBetEnabled={config.autoBet}
                        betAmount={config.betAmount}
                        targetMultiplier={config.targetMultiplier}
                        onOperationComplete={handleOperationComplete}
                        addLog={addLog}
                      />
                    ) : (
                      <MinesEmulator 
                        activeBroker={activeBroker}
                        autoBetEnabled={config.autoBet}
                        betAmount={config.betAmount}
                        minesCount={config.minesCount}
                        onOperationComplete={handleOperationComplete}
                        addLog={addLog}
                      />
                    )}
                  </div>

                  {/* Right hand live terminal console */}
                  <div className="lg:col-span-4 space-y-6">
                    <Terminal logs={terminalLogs} />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'history' && (
              <HistoryView operations={operations} />
            )}

            {activeTab === 'stats' && (
              <StatsView operations={operations} brokers={BROKERS} />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                config={config} 
                onConfigChange={setConfig} 
                activeBroker={activeBroker}
                addLog={addLog}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView 
                profile={profile} 
                activeBroker={activeBroker} 
                operationsCount={operations.length}
              />
            )}
          </div>

        </main>
      </div>

      {/* Mobile Sticky Tab navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121216] border-t border-white/5 py-2.5 px-4 flex justify-around items-center shadow-2xl">
        <button 
          onClick={() => setActiveTab('robot')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'robot' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Sinais</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <History className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Histórico</span>
        </button>

        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Stats</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Ajustes</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-cyan-400' : 'text-white/40'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] uppercase font-bold tracking-wider">Perfil</span>
        </button>
      </div>

      <AnimatePresence>
        {showDownloadModal && (
          <DownloadModal 
            isOpen={showDownloadModal}
            onClose={() => setShowDownloadModal(false)}
            userEmail={profile.email}
            userName={profile.name}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
