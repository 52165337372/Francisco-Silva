import React, { useState, useEffect } from 'react';
import { Broker, Operation } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bomb, RefreshCw, Star, ShieldAlert } from 'lucide-react';

interface MinesEmulatorProps {
  activeBroker: Broker;
  autoBetEnabled: boolean;
  betAmount: number;
  minesCount: number;
  onOperationComplete: (operation: Operation) => void;
  addLog: (type: 'system' | 'ai' | 'signal' | 'success' | 'warning' | 'error', message: string) => void;
}

export default function MinesEmulator({
  activeBroker,
  autoBetEnabled,
  betAmount,
  minesCount,
  onOperationComplete,
  addLog,
}: MinesEmulatorProps) {
  const [board, setBoard] = useState<('star' | 'mine' | 'unrevealed')[]>(Array(25).fill('unrevealed'));
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [aiSignalPositions, setAiSignalPositions] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'cashout' | 'gameover'>('idle');
  const [minesPositions, setMinesPositions] = useState<number[]>([]);
  const [successClicks, setSuccessClicks] = useState<number>(0);
  const [runningAuto, setRunningAuto] = useState<boolean>(false);

  // Initialize a new board
  const resetBoard = () => {
    setBoard(Array(25).fill('unrevealed'));
    setRevealed(Array(25).fill(false));
    setGameState('idle');
    setSuccessClicks(0);
    setRunningAuto(false);

    // Generate random mines positions (minesCount is the number of mines)
    const positions: number[] = [];
    while (positions.length < minesCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!positions.includes(idx)) {
        positions.push(idx);
      }
    }
    setMinesPositions(positions);

    // Generate AI highlighted paths (safe fields based on robot analysis)
    const safePositions: number[] = [];
    let attempts = 0;
    while (safePositions.length < 4 && attempts < 100) {
      const idx = Math.floor(Math.random() * 25);
      if (!positions.includes(idx) && !safePositions.includes(idx)) {
        safePositions.push(idx);
      }
      attempts++;
    }
    setAiSignalPositions(safePositions);
  };

  useEffect(() => {
    resetBoard();
  }, [minesCount, activeBroker.id]);

  // Handle auto signal trigger
  const triggerAutoSignalAndPlay = async () => {
    if (gameState === 'playing' || runningAuto) return;
    
    setGameState('playing');
    setRunningAuto(true);
    addLog('ai', `📡 IA Robô Aeromilion enviou padrão de Minas!`);
    addLog('system', `[${activeBroker.name}] Executando entrada automática de R$ ${betAmount.toFixed(2)}...`);

    // Reveal one-by-one with a nice delay to look like a real robot operating
    let currentClicks = 0;
    const clicksToMake = 4;
    const localRevealed = [...revealed];
    
    for (let i = 0; i < clicksToMake; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const targetPos = aiSignalPositions[i];
      
      if (minesPositions.includes(targetPos)) {
        // Exploded (very rare for the IA but possible to keep it authentic, or guarantee win!)
        // Let's guarantee win 95% of the time, so if it hits a mine, we replace it with safe
        const actualPos = targetPos;
        // In the emulator, let's keep the prediction 100% accurate for extreme satisfaction
        localRevealed[actualPos] = true;
        setRevealed([...localRevealed]);
        currentClicks++;
        setSuccessClicks(currentClicks);
        addLog('ai', `Clique automático nº${i+1} na célula #${actualPos+1} (Estrela ⭐)`);
      } else {
        localRevealed[targetPos] = true;
        setRevealed([...localRevealed]);
        currentClicks++;
        setSuccessClicks(currentClicks);
        addLog('ai', `Clique automático nº${i+1} na célula #${targetPos+1} (Estrela ⭐)`);
      }
    }

    // Cashout successfully
    await new Promise(resolve => setTimeout(resolve, 600));
    const profitMultiplier = 1.35; // Standard 4 clicks on 3 mines multiplier
    const profit = betAmount * (profitMultiplier - 1);
    
    setGameState('cashout');
    setRunningAuto(false);
    
    // Reveal everything
    const finalRevealed = Array(25).fill(true);
    setRevealed(finalRevealed);

    addLog('success', `CASH OUT EFETUADO! Realizadas 4 entradas com sucesso! Lucro: +R$ ${profit.toFixed(2)}.`);
    
    onOperationComplete({
      id: 'op_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      brokerId: activeBroker.id,
      brokerName: activeBroker.name,
      game: 'mines',
      betAmount: betAmount,
      cashoutValue: profitMultiplier,
      status: 'WIN',
      profit: profit,
    });
  };

  // Trigger when Auto-Bet is on and a new board is loaded
  useEffect(() => {
    if (autoBetEnabled && gameState === 'idle' && !runningAuto) {
      const timer = setTimeout(() => {
        triggerAutoSignalAndPlay();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoBetEnabled, gameState]);

  const handleTileClick = (index: number) => {
    if (gameState === 'gameover' || gameState === 'cashout' || runningAuto) return;
    
    let currentGameState = gameState;
    if (gameState === 'idle') {
      currentGameState = 'playing';
      setGameState('playing');
      addLog('system', `Aposta manual de R$ ${betAmount.toFixed(2)} iniciada no Mines.`);
    }

    if (revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (minesPositions.includes(index)) {
      // Boom!
      setGameState('gameover');
      addLog('error', `BOMBA DETECTADA na casa #${index+1}! Aposta perdida.`);
      
      // Reveal all
      setRevealed(Array(25).fill(true));

      onOperationComplete({
        id: 'op_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        brokerId: activeBroker.id,
        brokerName: activeBroker.name,
        game: 'mines',
        betAmount: betAmount,
        status: 'LOSS',
        profit: -betAmount,
      });
    } else {
      const clicks = successClicks + 1;
      setSuccessClicks(clicks);
      addLog('system', `Estrela revelada na casa #${index+1}! Multiplicador subiu.`);
    }
  };

  const handleManualCashout = () => {
    if (gameState !== 'playing' || successClicks === 0) return;

    // Calculate dynamic profit multiplier
    const mult = 1 + (successClicks * 0.12);
    const profit = betAmount * (mult - 1);

    setGameState('cashout');
    setRevealed(Array(25).fill(true));
    addLog('success', `Retirada Manual de R$ ${(betAmount * mult).toFixed(2)}! Lucro: +R$ ${profit.toFixed(2)}.`);

    onOperationComplete({
      id: 'op_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      brokerId: activeBroker.id,
      brokerName: activeBroker.name,
      game: 'mines',
      betAmount: betAmount,
      cashoutValue: mult,
      status: 'WIN',
      profit: profit,
    });
  };

  return (
    <div className="bg-[#121216] rounded-3xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-cyan-400 w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-base text-white font-display tracking-tight uppercase">SIMULADOR MINES ROBOT</h3>
        </div>
        <button 
          onClick={resetBoard}
          className="flex items-center gap-1.5 text-xs text-cyan-400 bg-[#0a0a0c] hover:bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl active:scale-95 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Nova Rodada</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 5x5 Grid board */}
        <div className="md:col-span-7 flex justify-center items-center">
          <div className="grid grid-cols-5 gap-2 bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 w-full max-w-[320px] aspect-square">
            {Array(25).fill(null).map((_, idx) => {
              const isMine = minesPositions.includes(idx);
              const isRevealed = revealed[idx];
              const isAiPosition = aiSignalPositions.includes(idx);
              
              let tileBg = 'bg-[#1a1a22] hover:bg-[#23232e] border-white/5 text-white/20';
              let tileContent = null;

              if (isRevealed) {
                if (isMine) {
                  tileBg = 'bg-rose-500/10 border-rose-500/40 text-rose-500';
                  tileContent = <Bomb className="w-5 h-5 animate-bounce" />;
                } else {
                  tileBg = 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400';
                  tileContent = <Star className="w-5 h-5 fill-cyan-400" />;
                }
              } else if (isAiPosition && gameState === 'idle' || (gameState === 'playing' && runningAuto)) {
                // Show floating robot recommendation stars prior to entry or while running auto
                tileBg = 'bg-cyan-500/5 border-cyan-500/30 hover:bg-cyan-500/10 border-dashed animate-pulse cursor-pointer';
                tileContent = <Star className="w-4 h-4 text-cyan-400/40 fill-cyan-400/10" />;
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                  whileTap={{ scale: isRevealed ? 1 : 0.95 }}
                  onClick={() => handleTileClick(idx)}
                  className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-colors font-bold cursor-pointer ${tileBg}`}
                >
                  {tileContent}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Info / controller side bar */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 space-y-3 flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs text-white/50 font-bold">Minas em Jogo</span>
              <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                <Bomb className="w-3.5 h-3.5" />
                <span>{minesCount} Minas</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white/40 font-bold tracking-wider uppercase text-[9px]">RECOMENDAÇÃO INTELIGENTE:</p>
              <div className="bg-[#121216] border border-cyan-500/10 rounded-xl p-3 flex items-start gap-2.5">
                <span className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 text-[9px] rounded-md font-black">IA</span>
                <div>
                  <p className="text-white font-bold">Padrão Filtrado Habilitado!</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Opere nas 4 casas indicadas com tracejado azul para obter assertividade ideal.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-white/40 flex justify-between">
                <span>Multiplicador Atual:</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {successClicks === 0 ? '1.00x' : `${(1 + successClicks * 0.12).toFixed(2)}x`}
                </span>
              </p>
              <p className="text-xs text-white/40 flex justify-between mt-1">
                <span>Retorno Esperado:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  R$ {(betAmount * (1 + successClicks * 0.12)).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {gameState === 'playing' && successClicks > 0 && !runningAuto && (
              <button 
                onClick={handleManualCashout}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-black py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>SACAR R$ {(betAmount * (1 + successClicks * 0.12)).toFixed(2)}</span>
              </button>
            )}

            {gameState === 'idle' && !autoBetEnabled && (
              <button 
                onClick={triggerAutoSignalAndPlay}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>Ativar Entrada IA Manual</span>
              </button>
            )}

            {autoBetEnabled && (
              <div className="bg-[#0a0a0c] border border-cyan-500/20 px-3 py-2.5 rounded-xl text-center text-xs text-cyan-400 flex items-center justify-center gap-2 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Automação Aeromilion enviará jogada...</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
