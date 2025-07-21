import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { userAddress, amount } = await request.json();

    // Validate inputs
    if (!userAddress || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid address or amount' },
        { status: 400 }
      );
    }

    // Convert MUSDT amount to base units (1 MUSDT = 1,000,000 base units)
    const amountInBaseUnits = Math.floor(amount * 1000000);

    console.log(`Converting ${amount} MUSDT to ${amountInBaseUnits} base units`);

    // Contract addresses from our deployed contract (Updated)
// Update these addresses with the new values from the transaction output
  const contractAddress = "0x13ff5c59055128907c06e6ac9e3eec34d54ca65fdc3085b97414f9031971a2a3";
  const treasuryCapAddress = "0x0c5d505c7e2b87dbde98d320c34e2e1c27483219f6eebb9d9e51585f94876bea";
  const supplyAddress = "0x0c56a3986a8597c1658d2daf6f8f28e04135b0a1639dfea1798253dd2bdf145e";

    // Execute the mint command using IOTA CLI with base units
    const mintCommand = `iota client call --package ${contractAddress} --module MockUSDT --function mint --args ${treasuryCapAddress} ${supplyAddress} ${amountInBaseUnits} ${userAddress} --gas-budget 10000000`;

    console.log('Executing mint command:', mintCommand);

    try {
      const { stdout, stderr } = await execAsync(mintCommand, {
        cwd: process.cwd(),
        timeout: 30000 // 30 second timeout
      });

      if (stderr) {
        console.error('Mint command stderr:', stderr);
      }

      console.log('Mint command stdout:', stdout);

      // Parse the transaction digest from the output
      // The output should contain a transaction digest like: "Transaction Digest: ApgXgaugpq53oYHfBZJkFmLgY3X7v1Wowdxt4fHhtge7"
      const digestMatch = stdout.match(/Transaction Digest: ([A-Za-z0-9]+)/);
      const transactionId = digestMatch ? digestMatch[1] : `mint-${Date.now()}`;

      return NextResponse.json({
        success: true,
        transactionId,
        message: 'MUSDT tokens minted successfully'
      });

    } catch (execError) {
      console.error('Error executing mint command:', execError);
      return NextResponse.json(
        { 
          error: 'Failed to execute mint transaction',
          details: execError instanceof Error ? execError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in mint API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 