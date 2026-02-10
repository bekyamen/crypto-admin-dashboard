import { NextRequest, NextResponse } from 'next/server';
import { generatePriceMovement, calculateTradeResult, calculateProfitLoss, getCurrentBitcoinPrice } from '@/lib/trade-utils';

// This would connect to the trades stored in place/route.ts
// For now, we'll create a simple in-memory store
let tradesStore: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tradeId } = body;

    if (!tradeId) {
      return NextResponse.json(
        { success: false, message: 'Trade ID is required' },
        { status: 400 }
      );
    }

    // Get all trades from place API
    const placesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trades/place`);
    const { trades, gameState } = await placesResponse.json();

    const trade = trades.find((t: any) => t.id === tradeId);
    if (!trade) {
      return NextResponse.json(
        { success: false, message: 'Trade not found' },
        { status: 404 }
      );
    }

    if (trade.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, message: 'Trade already completed' },
        { status: 400 }
      );
    }

    // Generate end price
    const endPrice = generatePriceMovement(trade.startPrice);

    // Calculate result
    const result = calculateTradeResult(
      trade.type,
      trade.startPrice,
      endPrice,
      gameState.mode,
      trade.userId,
      gameState.forcedWinUser,
      gameState.forcedLoseUser
    );

    // Calculate profit/loss
    const profitLoss = calculateProfitLoss(result, trade.amount, trade.timeframe);

    // Update trade
    trade.status = 'COMPLETED';
    trade.result = result;
    trade.endPrice = endPrice;
    trade.profitLoss = profitLoss;
    trade.completedAt = new Date();

    console.log('[v0] Trade resolved:', trade);

    return NextResponse.json({
      success: true,
      message: 'Trade resolved successfully',
      data: {
        tradeId,
        result,
        startPrice: trade.startPrice,
        endPrice,
        profitLoss,
        finalBalance: trade.amount + profitLoss,
      },
    });
  } catch (error) {
    console.error('[v0] Error resolving trade:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to resolve trade' },
      { status: 500 }
    );
  }
}
