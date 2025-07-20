import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  console.log("🚀 PURCHASE RCLT API CALL START");
  console.log("📅 Timestamp:", new Date().toISOString());
  
  try {
    const requestBody = await request.json();
    console.log("📥 Request body:", requestBody);
    
    const {
      paperAddress,
      musdtAmount,
      userAddress
    } = requestBody;

    // Validate inputs
    console.log("🔍 Validating API inputs...");
    const missingFields = [];
    if (!paperAddress) missingFields.push("paperAddress");
    if (!musdtAmount) missingFields.push("musdtAmount");
    if (!userAddress) missingFields.push("userAddress");

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: missingFields
        },
        { status: 400 }
      );
    }
    
    console.log("✅ API input validation passed");

    // Check if IOTA CLI is available
    console.log("🔧 Checking IOTA CLI availability...");
    try {
      const { stdout: versionOutput } = await execAsync('iota client --version', {
        cwd: process.cwd(),
        timeout: 10000
      });
      console.log('✅ IOTA CLI version:', versionOutput);
    } catch (versionError) {
      console.error('❌ IOTA CLI not available:', versionError);
      console.error('CLI error details:', versionError instanceof Error ? versionError.message : String(versionError));
      return NextResponse.json(
        { 
          error: 'IOTA CLI not available',
          details: 'Please ensure IOTA CLI is installed and accessible',
          cliError: versionError instanceof Error ? versionError.message : String(versionError)
        },
        { status: 500 }
      );
    }

    // Convert MUSDT amount to base units (1 MUSDT = 1,000,000 base units)
    const musdtAmountInBaseUnits = Math.floor(musdtAmount * 1000000);
    console.log(`Converting ${musdtAmount} MUSDT to ${musdtAmountInBaseUnits} base units`);

    // Contract addresses
    console.log("📋 Contract addresses:");
    const musdtAddress = "0x70a3bbc4b242cc53f8fbd6f8d84123eb7d642adbccbf3ce2bb4e5650cd95b9dd";
    console.log("  - Paper:", paperAddress);
    console.log("  - MUSDT:", musdtAddress);

    // Create the purchase RCLT command with base units
    const purchaseRcltCommand = `iota client call --package ${paperAddress} --module ResearchPaper --function purchase_rclt_tokens --args ${musdtAmountInBaseUnits} --gas-budget 100000000`;

    console.log('🚀 Executing purchase_rclt_tokens command:');
    console.log('Command:', purchaseRcltCommand);

    try {
      console.log('⏳ Executing command with 60 second timeout...');
      const { stdout, stderr } = await execAsync(purchaseRcltCommand, {
        cwd: process.cwd(),
        timeout: 60000 // 60 second timeout
      });

      console.log('✅ Command executed successfully');
      if (stderr) {
        console.warn('⚠️ Command stderr:', stderr);
      }

      console.log('📄 Command stdout:', stdout);

      // Parse the transaction digest from the output
      console.log('🔍 Parsing transaction digest...');
      const digestMatch = stdout.match(/Transaction Digest: ([A-Za-z0-9]+)/);
      const transactionId = digestMatch ? digestMatch[1] : `rclt-purchase-${Date.now()}`;
      console.log('Transaction ID:', transactionId);

      // Parse the created RCLT tokens object ID
      console.log('🔍 Parsing RCLT tokens object ID...');
      const rcltMatch = stdout.match(/Created Objects:\s*\n\s*┌──\s*\n\s*│\s*ID:\s*([A-Za-z0-9]+)/);
      const rcltTokensId = rcltMatch ? rcltMatch[1] : null;
      console.log('RCLT Tokens ID:', rcltTokensId);

      console.log('✅ Successfully parsed transaction results');
      return NextResponse.json({
        success: true,
        transactionId,
        rcltTokensId,
        musdtAmount,
        message: 'RCLT tokens purchased successfully'
      });

    } catch (execError) {
      console.error('💥 Error executing purchase_rclt_tokens command:');
      console.error('Error type:', typeof execError);
      console.error('Error message:', execError instanceof Error ? execError.message : String(execError));
      console.error('Error stack:', execError instanceof Error ? execError.stack : 'No stack trace');
      console.error('Full error object:', execError);
      
      return NextResponse.json(
        { 
          error: 'Failed to purchase RCLT tokens',
          details: execError instanceof Error ? execError.message : 'Unknown error',
          command: purchaseRcltCommand,
          stderr: execError instanceof Error && 'stderr' in execError ? (execError as any).stderr : undefined,
          errorType: typeof execError,
          errorStack: execError instanceof Error ? execError.stack : undefined
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 Error in purchase RCLT API:');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: typeof error,
        errorStack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 