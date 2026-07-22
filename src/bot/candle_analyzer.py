#!/usr/bin/env python3
"""
JARVIS Trading Bot - Analisador de Velas Coloridas
Análise inteligente com classificação por ganho (X)
"""

from enum import Enum
from dataclasses import dataclass
from typing import List, Dict
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CandleColor(Enum):
    """Cores das velas baseadas no ganho (X)"""
    BLUE = "🔵 AZUL"      # Abaixo de 2X
    PURPLE = "🟣 ROXO"    # 2X até 10X
    PINK = "🌸 ROSA"      # 10X até 1000X
    MEGA = "💎 MEGA"      # Acima de 10000X

@dataclass
class Candle:
    """Estrutura de uma vela (candle)"""
    timestamp: str
    open: float
    close: float
    high: float
    low: float
    volume: float
    
    def get_body_size(self) -> float:
        """Calcula o tamanho do corpo da vela"""
        return abs(self.close - self.open)
    
    def is_bullish(self) -> bool:
        """Verifica se a vela é de alta"""
        return self.close > self.open
    
    def is_bearish(self) -> bool:
        """Verifica se a vela é de baixa"""
        return self.close < self.open

@dataclass
class CandleAnalysis:
    """Resultado da análise de uma vela"""
    candle: Candle
    color: CandleColor
    gain_x: float
    percentage: float
    signal_strength: float
    recommendation: str
    timestamp_analyzed: str

class CandleAnalyzer:
    """Analisador de velas do Avieito"""
    
    def __init__(self, reference_price: float = None):
        self.reference_price = reference_price
        self.analysis_history: List[CandleAnalysis] = []
        logger.info("[JARVIS] Sistema de análise de velas inicializado")
    
    def analyze_candle(self, candle: Candle) -> CandleAnalysis:
        """Analisa uma vela individual"""
        try:
            # Calcular ganho em X
            if candle.open == 0:
                candle.open = candle.close
            
            gain_x = candle.high / candle.low if candle.low > 0 else 0
            percentage = ((candle.close - candle.open) / candle.open * 100) if candle.open > 0 else 0
            
            # Classificar cor
            color = self._classify_color(gain_x)
            
            # Calcular força do sinal
            signal_strength = self._calculate_signal_strength(candle, gain_x)
            
            # Gerar recomendação
            recommendation = self._generate_recommendation(color, gain_x, signal_strength)
            
            analysis = CandleAnalysis(
                candle=candle,
                color=color,
                gain_x=round(gain_x, 4),
                percentage=round(percentage, 2),
                signal_strength=round(signal_strength, 2),
                recommendation=recommendation,
                timestamp_analyzed=datetime.now().isoformat()
            )
            
            self.analysis_history.append(analysis)
            logger.info(f"[VELA] {color.value} - Ganho: {gain_x:.2f}X - Força: {signal_strength:.2f}")
            return analysis
            
        except Exception as e:
            logger.error(f"[ERRO] Falha na análise: {str(e)}")
            raise
    
    def _classify_color(self, gain_x: float) -> CandleColor:
        """Classifica a cor baseado no ganho (X)"""
        if gain_x < 2:
            return CandleColor.BLUE
        elif 2 <= gain_x < 10:
            return CandleColor.PURPLE
        elif 10 <= gain_x < 10000:
            return CandleColor.PINK
        else:
            return CandleColor.MEGA
    
    def _calculate_signal_strength(self, candle: Candle, gain_x: float) -> float:
        """Calcula a força do sinal (0.0 a 1.0)"""
        gain_factor = min(gain_x / 100, 1.0)
        body_factor = min(candle.get_body_size() / candle.close, 1.0) if candle.close > 0 else 0
        volume_factor = min(candle.volume / 1000000, 1.0)
        
        signal_strength = (gain_factor * 0.5 + body_factor * 0.3 + volume_factor * 0.2)
        return min(signal_strength, 1.0)
    
    def _generate_recommendation(self, color: CandleColor, gain_x: float, signal_strength: float) -> str:
        """Gera recomendação baseado na análise"""
        if signal_strength < 0.3:
            return "⚠️ FRACO - Esperar confirmação"
        
        recommendations = {
            CandleColor.BLUE: f"📊 AZUL - Acumular se suporte confirmar",
            CandleColor.PURPLE: f"📈 ROXO - Considerar entrada com stop",
            CandleColor.PINK: f"🚀 ROSA - Sinal forte (10-1000X)",
            CandleColor.MEGA: f"💎 MEGA - ALERTA! Possível bubble (>10000X)"
        }
        
        base_rec = recommendations.get(color, "🔄 Monitorar")
        
        if signal_strength > 0.7:
            return f"{base_rec} [FORÇA: MUITO FORTE] 💪"
        elif signal_strength > 0.5:
            return f"{base_rec} [FORÇA: FORTE] 👍"
        else:
            return f"{base_rec} [FORÇA: MODERADO]"
    
    def analyze_multiple_candles(self, candles: List[Candle]) -> List[CandleAnalysis]:
        """Analisa múltiplas velas"""
        results = []
        for candle in candles:
            analysis = self.analyze_candle(candle)
            results.append(analysis)
        
        logger.info(f"[JARVIS] {len(results)} velas analisadas")
        return results
    
    def get_summary_report(self) -> Dict:
        """Gera relatório resumido"""
        if not self.analysis_history:
            return {}
        
        blue_count = sum(1 for a in self.analysis_history if a.color == CandleColor.BLUE)
        purple_count = sum(1 for a in self.analysis_history if a.color == CandleColor.PURPLE)
        pink_count = sum(1 for a in self.analysis_history if a.color == CandleColor.PINK)
        mega_count = sum(1 for a in self.analysis_history if a.color == CandleColor.MEGA)
        
        avg_gain = sum(a.gain_x for a in self.analysis_history) / len(self.analysis_history)
        max_gain = max(a.gain_x for a in self.analysis_history)
        avg_strength = sum(a.signal_strength for a in self.analysis_history) / len(self.analysis_history)
        
        return {
            "🔵_azul_total": blue_count,
            "🟣_roxo_total": purple_count,
            "🌸_rosa_total": pink_count,
            "💎_mega_total": mega_count,
            "ganho_medio_x": round(avg_gain, 4),
            "ganho_maximo_x": round(max_gain, 4),
            "forca_media_sinal": round(avg_strength, 2),
            "total_analisadas": len(self.analysis_history)
        }
    
    def get_top_signals(self, limit: int = 5) -> List[CandleAnalysis]:
        """Retorna os melhores sinais"""
        sorted_signals = sorted(
            self.analysis_history,
            key=lambda x: (x.signal_strength, x.gain_x),
            reverse=True
        )
        return sorted_signals[:limit]

if __name__ == "__main__":
    analyzer = CandleAnalyzer()
    
    test_candles = [
        Candle("2024-01-01 10:00", 100, 101, 102, 99, 1000000),
        Candle("2024-01-01 11:00", 100, 115, 120, 95, 2000000),
        Candle("2024-01-01 12:00", 100, 500, 600, 90, 5000000),
        Candle("2024-01-01 13:00", 1, 100000, 150000, 0.5, 10000000),
    ]
    
    results = analyzer.analyze_multiple_candles(test_candles)
    
    for result in results:
        print(f"\n{result.color.value}")
        print(f"  Ganho: {result.gain_x}X ({result.percentage}%)")
        print(f"  Força: {result.signal_strength}")
        print(f"  {result.recommendation}")
    
    print(f"\n📊 RESUMO:\n{analyzer.get_summary_report()}")
