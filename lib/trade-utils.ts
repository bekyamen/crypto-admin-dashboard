// Profit/Loss percentages based on time frames (in seconds)
export const PROFIT_LOSS_RATES: Record<number, number> = {
  30: 0.25,   // 25% profit on win, 25% loss on lose
  60: 0.18,   // 18% profit on win, 18% loss on lose
  90: 0.15,   // 15%
  180: 0.12,  // 12%
  300: 0.10,  // 10%
};

export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type TradeResult = 'WIN' | 'LOSE' | 'PENDING';
export type GameMode = 'RANDOM' | 'ALWAYS_WIN' | 'ALWAYS_LOSE';

export interface Trade {
  id: string;
  userId: string;
  type: TradeType;
  amount: number;
  timeframe: number; // in seconds
  startPrice: number;
  endPrice?: number;
  result?: TradeResult;
  profitLoss?: number;
  status: TradeStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface GameModeState {
  mode: GameMode;
  forcedWinUser?: string;
  forcedLoseUser?: string;
}

// Simulate Bitcoin price movement
export function generatePriceMovement(basePrice: number): number {
  const changePercent = (Math.random() - 0.5) * 0.02; // ±1% random change
  return Math.round(basePrice * (1 + changePercent) * 100) / 100;
}

// Determine trade result based on price movement and game mode
export function calculateTradeResult(
  tradeType: TradeType,
  startPrice: number,
  endPrice: number,
  gameMode: GameMode,
  userId?: string,
  forcedWinUser?: string,
  forcedLoseUser?: string
): TradeResult {
  // Check for forced user results
  if (forcedWinUser === userId) {
    return 'WIN';
  }
  if (forcedLoseUser === userId) {
    return 'LOSE';
  }

  // Apply game mode
  if (gameMode === 'ALWAYS_WIN') {
    return 'WIN';
  }
  if (gameMode === 'ALWAYS_LOSE') {
    return 'LOSE';
  }

  // Normal random mode - check price movement
  const priceWentUp = endPrice > startPrice;
  
  if (tradeType === 'BUY' && priceWentUp) {
    return 'WIN';
  }
  if (tradeType === 'BUY' && !priceWentUp) {
    return 'LOSE';
  }
  if (tradeType === 'SELL' && !priceWentUp) {
    return 'WIN';
  }
  if (tradeType === 'SELL' && priceWentUp) {
    return 'LOSE';
  }

  return 'LOSE';
}

// Calculate profit/loss amount
export function calculateProfitLoss(
  result: TradeResult,
  amount: number,
  timeframe: number
): number {
  const rate = PROFIT_LOSS_RATES[timeframe] || 0.18;
  
  if (result === 'WIN') {
    return Math.round(amount * rate * 100) / 100;
  }
  if (result === 'LOSE') {
    return -Math.round(amount * rate * 100) / 100;
  }
  
  return 0;
}

// Get current Bitcoin price (simulated)
export function getCurrentBitcoinPrice(): number {
  const basePrice = 42500;
  const variance = (Math.random() - 0.5) * 1000;
  return Math.round((basePrice + variance) * 100) / 100;
}
