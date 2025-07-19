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

    // Contract addresses from our deployed contract
    const contractAddress = "0x0340088cd31baeb07c273153374813aa4995a7db7027cf719fb15fd0f93dbd67";
    const treasuryCapAddress = "0x03a26b77ff708f7eee59df15c7268a153689f5fdc4a178b188f636c180f5769a";
    const supplyAddress = "0x4ac50eb063d74666218ae9c8b3b06a5dddb499139ba41fe0b886bf7f4d562de1";

    // Execute the mint command using IOTA CLI
    const mintCommand = `iota client call --package ${contractAddress} --module MockUSDT --function mint --args ${treasuryCapAddress} ${supplyAddress} ${amount} ${userAddress} --gas-budget 10000000`;

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