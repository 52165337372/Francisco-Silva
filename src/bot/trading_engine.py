#!/usr/bin/env python3
"""
JARVIS Trading Bot - Motor de Trading Automático
Executa trades baseado em sinais de velas
"""

import logging
from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OrderType(Enum):
    """Tipos de ordem"""
    BUY = "BUY"
    SELL = "SELL"
    LIMIT = "LIMIT"
    MARKET = "MARKET"

@dataclass
class Position:
    """Posição aberta"""
    symbol: str
    entry_price: float
    quantity: float
    order_type: OrderType
    timestamp: str
    stop_loss: float
    take_profit: float
    status: str = "OPEN"

@dataclass
class Trade:
    """Histórico de trade"""
    symbol: str
    entry_price: float
    exit_price: float
    quantity: float
    profit_loss: float
    percentage: float
    duration: str
    timestamp: str

class RiskManager:
    """Gerenciador de risco"""
    
    def __init__(self, max_loss_percent: float = 2.0, max_position_size: float = 0.01):
        self.max_loss_percent = max_loss_percent
        self.max_position_size = max_position_size
        logger.info("[RISK MANAGER] Gerenciador de risco inicializado")
    
    def calculate_stop_loss(self, entry_price: float, percent: float = 2.0) -> float:
        """Calcula stop loss"""
        return entry_price * (1 - percent / 100)
    
    def calculate_take_profit(self, entry_price: float, multiplier: float = 1.5) -> float:
        """Calcula take profit"""
        return entry_price * multiplier
    
    def validate_position_size(self, balance: float, entry_price: float) -> float:
        """Valida tamanho da posição"""
        max_size = (balance * self.max_position_size) / entry_price
        return max_size

class TradingEngine:
    """Motor de trading automático"""
    
    def __init__(self, initial_balance: float = 1000.0):
        self.balance = initial_balance
        self.positions: List[Position] = []
        self.trades: List[Trade] = []
        self.risk_manager = RiskManager()
        logger.info(f"[TRADING ENGINE] Inicializado com saldo: ${initial_balance}")
    
    def open_position(self, symbol: str, signal_color: str, entry_price: float, 
                     quantity: float, signal_strength: float) -> Position:
        """Abre uma posição de trading"""
        
        try:
            # Validar saldo
            required_amount = entry_price * quantity
            if required_amount > self.balance:
                logger.warning(f"[TRADING] Saldo insuficiente para {symbol}")
                return None
            
            # Calcular stop loss e take profit baseado na força do sinal
            if signal_strength > 0.7:
                stop_loss_percent = 1.0
                tp_multiplier = 2.0
            elif signal_strength > 0.5:
                stop_loss_percent = 1.5
                tp_multiplier = 1.5
            else:
                stop_loss_percent = 2.0
                tp_multiplier = 1.2
            
            stop_loss = self.risk_manager.calculate_stop_loss(entry_price, stop_loss_percent)
            take_profit = self.risk_manager.calculate_take_profit(entry_price, tp_multiplier)
            
            position = Position(
                symbol=symbol,
                entry_price=entry_price,
                quantity=quantity,
                order_type=OrderType.BUY,
                timestamp=datetime.now().isoformat(),
                stop_loss=stop_loss,
                take_profit=take_profit,
                status="OPEN"
            )
            
            self.positions.append(position)
            self.balance -= required_amount
            
            logger.info(f"[TRADE] ABERTA: {symbol} - Preço: ${entry_price} - Qtd: {quantity}")
            logger.info(f"  Stop Loss: ${stop_loss:.2f} | Take Profit: ${take_profit:.2f}")
            
            return position
            
        except Exception as e:
            logger.error(f"[ERRO] Falha ao abrir posição: {str(e)}")
            return None
    
    def close_position(self, position: Position, exit_price: float) -> Trade:
        """Fecha uma posição de trading"""
        
        try:
            profit_loss = (exit_price - position.entry_price) * position.quantity
            percentage = ((exit_price - position.entry_price) / position.entry_price) * 100
            
            trade = Trade(
                symbol=position.symbol,
                entry_price=position.entry_price,
                exit_price=exit_price,
                quantity=position.quantity,
                profit_loss=profit_loss,
                percentage=percentage,
                duration="N/A",
                timestamp=datetime.now().isoformat()
            )
            
            self.trades.append(trade)
            self.balance += (exit_price * position.quantity)
            position.status = "CLOSED"
            
            logger.info(f"[TRADE] FECHADA: {position.symbol} - Lucro/Prejuízo: ${profit_loss:.2f} ({percentage:.2f}%)")
            
            return trade
            
        except Exception as e:
            logger.error(f"[ERRO] Falha ao fechar posição: {str(e)}")
            return None
    
    def check_stop_loss(self, position: Position, current_price: float) -> bool:
        """Verifica se stop loss foi acionado"""
        if current_price <= position.stop_loss:
            logger.warning(f"[STOP LOSS] {position.symbol} acionado em ${current_price}")
            return True
        return False
    
    def check_take_profit(self, position: Position, current_price: float) -> bool:
        """Verifica se take profit foi acionado"""
        if current_price >= position.take_profit:
            logger.info(f"[TAKE PROFIT] {position.symbol} acionado em ${current_price}")
            return True
        return False
    
    def get_portfolio_summary(self) -> Dict:
        """Retorna resumo da carteira"""
        
        total_trades = len(self.trades)
        winning_trades = sum(1 for t in self.trades if t.profit_loss > 0)
        losing_trades = sum(1 for t in self.trades if t.profit_loss < 0)
        total_profit = sum(t.profit_loss for t in self.trades)
        
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        
        return {
            "saldo_atual": round(self.balance, 2),
            "total_trades": total_trades,
            "trades_vencedores": winning_trades,
            "trades_perdedores": losing_trades,
            "taxa_vitoria": round(win_rate, 2),
            "lucro_total": round(total_profit, 2),
            "posicoes_abertas": len([p for p in self.positions if p.status == "OPEN"])
        }
    
    def simulate_trades(self, candle_data: List) -> Dict:
        """Simula trades com dados históricos"""
        
        logger.info("[SIMULAÇÃO] Iniciando simulação de trades...")
        
        simulations = {
            "total_simulado": len(candle_data),
            "resultado": "Em andamento..."
        }
        
        return simulations

if __name__ == "__main__":
    # Teste do motor
    engine = TradingEngine(initial_balance=1000.0)
    
    # Simular abertura de posição
    position = engine.open_position(
        symbol="BTCUSDT",
        signal_color="ROSA",
        entry_price=50000,
        quantity=0.01,
        signal_strength=0.8
    )
    
    # Simular fechamento
    if position:
        trade = engine.close_position(position, exit_price=55000)
        
    # Exibir resumo
    print("\n📊 RESUMO DA CARTEIRA:")
    print(engine.get_portfolio_summary())
