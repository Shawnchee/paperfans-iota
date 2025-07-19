import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Contract address from our deployed contract
    const contractAddress = "0x0340088cd31baeb07c273153374813aa4995a7db7027cf719fb15fd0f93dbd67";

    // Query the user's balance using IOTA CLI
    // Note: This is a simplified approach. In a real implementation, you would:
    // 1. Query the contract for the user's balance
    // 2. Parse the response to get the actual balance
    // 3. Handle different token types and amounts

    try {
      // For now, we'll return a mock balance since querying specific token balances
      // requires more complex contract interaction
      const mockBalance = 0; // This should be replaced with actual balance query

      return NextResponse.json({
        success: true,
        balance: mockBalance,
        address: address
      });

    } catch (execError) {
      console.error('Error querying balance:', execError);
      return NextResponse.json(
        { 
          error: 'Failed to query balance',
          details: execError instanceof Error ? execError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in balance API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 