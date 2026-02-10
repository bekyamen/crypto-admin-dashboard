import { NextRequest, NextResponse } from 'next/server';

// In-memory game state
let gameState = {
  mode: 'RANDOM' as 'RANDOM' | 'ALWAYS_WIN' | 'ALWAYS_LOSE',
  forcedWinUser: undefined as string | undefined,
  forcedLoseUser: undefined as string | undefined,
  updatedAt: new Date(),
  updatedBy: 'admin',
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: gameState,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, userId, action } = body;

    if (!mode) {
      return NextResponse.json(
        { success: false, message: 'Mode is required' },
        { status: 400 }
      );
    }

    if (!['RANDOM', 'ALWAYS_WIN', 'ALWAYS_LOSE'].includes(mode)) {
      return NextResponse.json(
        { success: false, message: 'Invalid game mode' },
        { status: 400 }
      );
    }

    // Handle global mode change
    if (action === 'GLOBAL') {
      gameState.mode = mode;
      gameState.forcedWinUser = undefined;
      gameState.forcedLoseUser = undefined;
      gameState.updatedAt = new Date();

      console.log('[v0] Game mode changed to:', mode);

      return NextResponse.json({
        success: true,
        message: `Game mode changed to ${mode}`,
        data: gameState,
      });
    }

    // Handle individual user control
    if (action === 'FORCE_WIN' && userId) {
      gameState.forcedWinUser = userId;
      gameState.forcedLoseUser = undefined;
      gameState.mode = 'RANDOM'; // Set back to random for per-user control

      console.log('[v0] Forced win for user:', userId);

      return NextResponse.json({
        success: true,
        message: `User ${userId} set to always win`,
        data: gameState,
      });
    }

    if (action === 'FORCE_LOSE' && userId) {
      gameState.forcedLoseUser = userId;
      gameState.forcedWinUser = undefined;
      gameState.mode = 'RANDOM';

      console.log('[v0] Forced lose for user:', userId);

      return NextResponse.json({
        success: true,
        message: `User ${userId} set to always lose`,
        data: gameState,
      });
    }

    if (action === 'CLEAR_FORCE') {
      gameState.forcedWinUser = undefined;
      gameState.forcedLoseUser = undefined;

      console.log('[v0] Cleared forced user controls');

      return NextResponse.json({
        success: true,
        message: 'Cleared forced user controls',
        data: gameState,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Error updating game mode:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update game mode' },
      { status: 500 }
    );
  }
}
