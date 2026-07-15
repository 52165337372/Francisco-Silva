export interface Broker {
  id: string;
  name: string;
  url: string;
  logo: string;
  color: string;
}

export type GameType = 'aviator' | 'mines';

export interface Signal {
  id: string;
  game: GameType;
  multiplier?: number; // For Aviator
  minesCount?: number; // For Mines
  positions?: number[]; // For Mines (positions from 0 to 24)
  accuracy: number; // e.g. 98.4
  timestamp: string;
  expireTimestamp: string;
  status: 'pending' | 'active' | 'success' | 'failed';
}

export interface Operation {
  id: string;
  timestamp: string;
  brokerId: string;
  brokerName: string;
  game: GameType;
  betAmount: number;
  cashoutValue?: number;
  status: 'WIN' | 'LOSS' | 'PENDING';
  profit: number;
  multiplierReached?: number;
}

export interface UserConfig {
  autoBet: boolean;
  betAmount: number;
  targetMultiplier: number;
  maxLoss: number;
  targetProfit: number;
  strategy: 'conservative' | 'balanced' | 'aggressive';
  minesCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  balance: number;
  subscription: 'VIP' | 'GRÁTIS';
  subscriptionEnd: string;
  activeBrokerId: string;
}
