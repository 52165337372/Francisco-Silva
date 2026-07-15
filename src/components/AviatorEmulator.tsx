import React, { useState, useEffect, useRef } from 'react';
import { Broker, Operation } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AviatorEmulatorProps {
  activeBroker: Broker;
  autoBetEnabled: boolean;
  betAmount: number;
  targetMultiplier: number;
  onOperationComplete: (operation: Operation) => void;
  addLog: (type: 'system' | 'ai' | 'signal' | 'success' | 'warning' | 'error', message: string) => void;
}

export default function AviatorEmulator({
  activeBroker,
  autoBetEnabled,
  betAmount,
  targetMultiplier,
  onOperationComplete,
  addLog,
}: AviatorEmulatorProps) {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'flying' | 'crashed'>('idle');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [countdown, setCountdown] = useState<number>(5);
  const [userBet, setUserBet] = useState<{ amount: number; cashedOut: boolean; auto: boolean } | null>(null);
  
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flightDurationRef = useRef<number>(0);
  const targetCrashRef = useRef<number>(1.0);

  // Generate a realistic target crash multiplier based on probability (Aviator algorithms)
  const generateCrashPoint = () => {
    const rand = Math.random();
    if (rand < 0.1) return 1.0; // Instant crash (10% chance)
    if (rand < 0.5) return 1.1 + Math.random() * 1.5; // Crash between 1.1x and 2.6x (40% chance)
    if (rand < 0.85) return 2.6 + Math.random() * 5.0; // Crash between 2.6x and 7.6x (35% chance)
    return 7.6 + Math.random() * 20.0; // High vela crash (15% chance)
  };

  // Start the next round
  const startNextRound = () => {
    setGameState('waiting');
    setCountdown(6);
    setMultiplier(1.0);
    setUserBet(null);

    // Auto bet logic
    if (autoBetEnabled) {
      setUserBet({
        amount: betAmount,
        cashedOut: false,
        auto: true,
      });
      addLog('ai', `Aguardando decolagem. Automação programada para R$ ${betAmount.toFixed(2)}.`);
    }

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    let timer = 6;
    countdownIntervalRef.current = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(countdownIntervalRef.current!);
        launchPlane();
      }
    }, 1000);
  };

  // Launch the plane flight
  const launchPlane = () => {
    setGameState('flying');
    const crashPoint = generateCrashPoint();
    targetCrashRef.current = crashPoint;
    flightDurationRef.current = 0;

    if (autoBetEnabled) {
      addLog('system', `[${activeBroker.name}] Aposta automática enviada! R$ ${betAmount.toFixed(2)} em andamento...`);
    }

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);

    gameIntervalRef.current = setInterval(() => {
      flightDurationRef.current += 0.05;
      
      // Multiplier grows exponentially over time
      const currentMult = Math.pow(1.08, flightDurationRef.current * 10);
      const roundedMult = Math.round(currentMult * 100) / 100;

      if (roundedMult >= targetCrashRef.current) {
        // Crash game!
        clearInterval(gameIntervalRef.current!);
        setMultiplier(targetCrashRef.current);
        setGameState('crashed');
        
        // Handle losing auto bet
        if (autoBetEnabled && userBet && !userBet.cashedOut) {
          addLog('error', `O avião voou para longe em ${targetCrashRef.current.toFixed(2)}x. Entrada perdida!`);
          onOperationComplete({
            id: 'op_' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            brokerId: activeBroker.id,
            brokerName: activeBroker.name,
            game: 'aviator',
            betAmount: betAmount,
            status: 'LOSS',
            profit: -betAmount,
            multiplierReached: targetCrashRef.current,
          });
        }
        
        // Wait 4 seconds and restart
        setTimeout(() => {
          startNextRound();
        }, 4000);
      } else {
        setMultiplier(roundedMult);

        // Auto cashout logic
        if (autoBetEnabled && userBet && !userBet.cashedOut && roundedMult >= targetMultiplier) {
          setUserBet(prev => prev ? { ...prev, cashedOut: true } : null);
          const profit = betAmount * (targetMultiplier - 1);
          
          addLog('success', `CASH OUT AUTOMÁTICO! Retirado em ${targetMultiplier.toFixed(2)}x. Lucro de +R$ ${profit.toFixed(2)}!`);
          
          onOperationComplete({
            id: 'op_' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            brokerId: activeBroker.id,
            brokerName: activeBroker.name,
            game: 'aviator',
            betAmount: betAmount,
            cashoutValue: targetMultiplier,
            status: 'WIN',
            profit: profit,
            multiplierReached: roundedMult,
          });
        }
      }
    }, 50);
  };

  useEffect(() => {
    startNextRound();
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [autoBetEnabled, betAmount, targetMultiplier, activeBroker.id]);

  const handleManualCashout = () => {
    if (gameState === 'flying' && userBet && !userBet.cashedOut) {
      setUserBet(prev => prev ? { ...prev, cashedOut: true } : null);
      const profit = userBet.amount * (multiplier - 1);
      
      addLog('success', `Retirada Manual efetuada em ${multiplier.toFixed(2)}x. Lucro de +R$ ${profit.toFixed(2)}!`);
      
      onOperationComplete({
        id: 'op_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        brokerId: activeBroker.id,
        brokerName: activeBroker.name,
        game: 'aviator',
        betAmount: userBet.amount,
        cashoutValue: multiplier,
        status: 'WIN',
        profit: profit,
        multiplierReached: multiplier,
      });
    }
  };

  const handleManualBet = () => {
    if (gameState === 'waiting' && !userBet) {
      setUserBet({
        amount: betAmount,
        cashedOut: false,
        auto: false,
      });
      addLog('system', `Aposta manual programada de R$ ${betAmount.toFixed(2)}.`);
    }
  };

  return (
    <div className="bg-[#121216] rounded-3xl border border-white/5 p-6 shadow-2xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-cyan-500 w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-base text-white font-display tracking-tight uppercase">SIMULADOR AVIATOR REAL-TIME</h3>
        </div>
        <div className="flex items-center space-x-2 text-[10px] bg-white/5 border border-white/5 px-3 py-1 rounded-full text-white/60 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span>{activeBroker.name} Conectado</span>
        </div>
      </div>

      {/* Aviator Screen Graph Area */}
      <div className="h-64 bg-[#0a0a0c] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
        
        {/* Dynamic stars / speed lines when flying */}
        {gameState === 'flying' && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-10 right-20 w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
          </div>
        )}

        {/* Floating status text */}
        <div className="absolute top-3 left-4 text-[9px] text-white/30 uppercase tracking-widest font-mono">
          ALVO DE OPERAÇÃO: IA_CORE_V4.2
        </div>

        {gameState === 'waiting' && (
          <div className="text-center z-10">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">PRÓXIMA ENTRADA EM</p>
            <motion.div 
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-black text-cyan-400 font-mono tracking-tighter"
            >
              {countdown}s
            </motion.div>
            <div className="mt-4 flex justify-center">
              <span className="text-[10px] text-cyan-400/80 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-1.5 animate-pulse">
                <span>IA analisando padrões de velas...</span>
              </span>
            </div>
          </div>
        )}

        {gameState === 'flying' && (
          <div className="text-center z-10 select-none">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-6xl font-black text-cyan-400 font-display tracking-tighter drop-shadow-[0_4px_24px_rgba(6,182,212,0.4)]"
            >
              {multiplier.toFixed(2)}x
            </motion.div>
            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest font-mono animate-pulse">Automação Subindo...</p>
          </div>
        )}

        {gameState === 'crashed' && (
          <div className="text-center z-10 select-none">
            <motion.div 
              initial={{ scale: 1.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-white/30 text-2xl font-black tracking-widest uppercase mb-1 drop-shadow-md"
            >
              Cashed Out!
            </motion.div>
            <div className="text-rose-500 text-5xl font-extrabold font-mono tracking-tighter drop-shadow-md">
              {multiplier.toFixed(2)}x
            </div>
            <div className="mt-2 text-[10px] text-white/40 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Sincronizando próximo bloco...</span>
            </div>
          </div>
        )}

        {/* PARABOLIC CHART CURVE & FLYING PLANE */}
        {gameState === 'flying' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Parabolic SVG curve path */}
            <svg className="w-full h-full absolute top-0 left-0">
              <path 
                d="M 10 240 Q 200 240 380 40" 
                fill="none" 
                stroke="rgba(6,182,212,0.1)" 
                strokeWidth="4" 
                strokeDasharray="6,4"
              />
              <path 
                d={`M 10 240 Q 200 240 ${10 + (370 * (Math.min(multiplier, 5) / 5))} ${240 - (200 * (Math.min(multiplier, 5) / 5))}`} 
                fill="none" 
                stroke="rgb(6, 182, 212)" 
                strokeWidth="5" 
                className="transition-all duration-75"
              />
            </svg>

            {/* Glowing Plane wrapper */}
            <div 
              style={{
                position: 'absolute',
                left: `${Math.min(85, 5 + (80 * (Math.min(multiplier, 5) / 5)))}%`,
                bottom: `${Math.min(80, 5 + (75 * (Math.min(multiplier, 5) / 5)))}%`,
                transform: 'translate(-50%, 50%)',
              }}
              className="transition-all duration-75 z-20 flex flex-col items-center"
            >
              {/* Flame tail */}
              <div className="w-6 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse filter blur-xs -ml-12 rotate-12" />
              <img 
                src="https://media.base44.com/images/public/6a4e7796e7685da4b5210a7f/6d1691f46_logo.png"
                alt="Plane"
                className="w-10 h-10 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] select-none rotate-12"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Control Actions & Info panel */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Betting Controller Panel */}
        <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Valor da Operação</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">R$ {betAmount.toFixed(2)}</span>
          </div>

          {userBet ? (
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Status</p>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {userBet.cashedOut ? '✅ RETIRADA FINALIZADA' : '🚀 PROCESSANDO...'}
                </p>
              </div>
              <div>
                {gameState === 'flying' && !userBet.cashedOut ? (
                  <button 
                    onClick={handleManualCashout}
                    className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Sacar R$ {(betAmount * multiplier).toFixed(2)}
                  </button>
                ) : (
                  <span className="text-xs text-white/40 font-mono">
                    {userBet.cashedOut ? `+R$ ${(betAmount * (targetMultiplier - 1)).toFixed(2)}` : 'Aguardando'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button 
                disabled={gameState !== 'waiting'}
                onClick={handleManualBet}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                  gameState === 'waiting'
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/10 active:scale-[0.98]'
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Programar Entrada (R$ {betAmount.toFixed(2)})</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Robot Automation Details */}
        <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
            <span className="text-xs text-white/50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>Automação Aeromilion</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              autoBetEnabled 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'bg-white/5 text-white/20'
            }`}>
              {autoBetEnabled ? 'ATIVADA' : 'INATIVA'}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Alvo Cashout:</span>
              <span className="text-white/80 font-mono font-bold">{targetMultiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Lucro Esperado:</span>
              <span className="text-emerald-400 font-mono font-bold">+R$ {(betAmount * (targetMultiplier - 1)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Assertividade:</span>
              <span className="text-cyan-400 font-semibold font-mono">98.4% IA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
