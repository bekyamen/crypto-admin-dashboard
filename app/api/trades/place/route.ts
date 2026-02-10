import { NextRequest, NextResponse } from 'next/server';
import { getCurrentBitcoinPrice, calculateTradeResult, calculateProfitLoss, PROFIT_LOSS_RATES } from '@/lib/trade-utils';
import type { TradeType } from '@/lib/trade-utils';

// In-memory storage for trades (replace with database in production)
let trades: any[] = [];
let gameState = {
  mode: 'RANDOM' as const,
  forcedWinUser: undefined as string | undefined,
  forcedLoseUser: undefined as string | undefined,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, type, amount, timeframe } = body;

    if (!userId || !type || !amount || !timeframe) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid trade type' },
        { status: 400 }
      );
    }

    if (!PROFIT_LOSS_RATES[timeframe]) {
      return NextResponse.json(
        { success: false, message: 'Invalid timeframe' },
        { status: 400 }
      );
    }

    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startPrice = getCurrentBitcoinPrice();

    const trade = {
      id: tradeId,
      userId,
      email,
      type,
      amount,
      timeframe,
      startPrice,
      status: 'PENDING',
      result: 'PENDING',
      profitLoss: 0,
      createdAt: new Date(),
      completedAt: null,
    };

    trades.push(trade);
    console.log('[v0] Trade placed:', trade);

    return NextResponse.json(
      {
        success: true,
        message: 'Trade placed successfully',
        data: {
          tradeId,
          startPrice,
          timeframe,
          expiresAt: new Date(Date.now() + timeframe * 1000),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error placing trade:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to place trade' },
      { status: 500 }
    );
  }
}

// Expose trades for testing/admin purposes
export async function GET() {
  return NextResponse.json({
    trades,
    gameState,
  });
}
