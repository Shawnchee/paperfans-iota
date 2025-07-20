import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  console.log("🚀 DEPLOY PAPER API CALL START");
  console.log("📅 Timestamp:", new Date().toISOString());
  
  try {
    const requestBody = await request.json();
    console.log("📥 Request body:", requestBody);
    
    const {
      title,
      abstract,
      category,
      domain,
      tags,
      technicalApproach,
      projectImage,
      authorName,
      authorAffiliation,
      authorImage,
      orcidId,
      fundingGoal,
      campaignDurationDays,
      researchTeamPercentage,
      revenueModels,
      rcltPriceInMusdt,
      userAddress
    } = requestBody;

    // Validate inputs
    console.log("🔍 Validating API inputs...");
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!abstract) missingFields.push("abstract");
    if (!category) missingFields.push("category");
    if (!domain) missingFields.push("domain");
    if (!authorName) missingFields.push("authorName");
    if (!authorAffiliation) missingFields.push("authorAffiliation");
    if (!fundingGoal) missingFields.push("fundingGoal");
    if (!rcltPriceInMusdt) missingFields.push("rcltPriceInMusdt");
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

    // Contract addresses from your deployed factory contract
    console.log("📋 Contract addresses:");
    const factoryAddress = "0xc6da74ae4dd9bcf244c99d417a682af9319031ee19809fe0cec01576049d6e2e"; // Replace with your factory contract address
    const musdtAddress = "0x70a3bbc4b242cc53f8fbd6f8d84123eb7d642adbccbf3ce2bb4e5650cd95b9dd";
    const policyCapId= "0x21417547c0a56bccd7ca38f2db46253af9894294b179262695c75d2595454916"
    console.log("  - Factory:", factoryAddress);
    console.log("  - MUSDT:", musdtAddress);

    // Convert arrays to strings
    console.log("🔄 Converting arrays to strings...");
    const tagsString = tags && tags.length > 0 ? tags.join(',') : "";
    const revenueModelsString = revenueModels && revenueModels.length > 0 ? revenueModels.join(',') : "";
    console.log("  - Tags string:", tagsString);
    console.log("  - Revenue models string:", revenueModelsString);
    const formattedTags = tagsString ? `[${tagsString.split(',').map((tag: string) => `"${tag}"`).join(',')}]` : '[]';
    const formattedRevenueModels = revenueModelsString ? `[${revenueModelsString.split(',').map((model: string) => `"${model}"`).join(',')}]` : '[]';

    const ensureHexPrefix = (id: string) => id.startsWith('0x') ? id : `0x${id}`;

    // Format the treasury cap ID - assuming this is where the error is
    const treasuryCapId = "0xec7e4ce73a383e0dcfbd9e76116f5c455a24716be6496173bbb1f729796b0e96"; // Replace with your actual treasury cap ID
    const formattedTreasuryCapId = ensureHexPrefix(treasuryCapId);
    const formattedPolicyCapId = ensureHexPrefix(policyCapId);
    // Create the deploy paper command
    const deployPaperCommand = `iota client call --package ${factoryAddress} --module ResearchToken --function create_proposal --args "${title}" "${abstract}" "${category}" "${domain}" ${formattedTags} "${technicalApproach || ''}" "${projectImage || ''}" "${authorName}" "${authorAffiliation}" "${authorImage || ''}" "${orcidId || ''}" ${fundingGoal} ${campaignDurationDays} ${researchTeamPercentage} ${formattedRevenueModels} ${formattedTreasuryCapId} ${formattedPolicyCapId} --gas-budget 100000000`;
    console.log('🚀 Executing deploy_paper command:');
    console.log('Command:', deployPaperCommand);

    try {
      console.log('⏳ Executing command with 60 second timeout...');
      const { stdout, stderr } = await execAsync(deployPaperCommand, {
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
      const transactionId = digestMatch ? digestMatch[1] : `paper-deploy-${Date.now()}`;
      console.log('Transaction ID:', transactionId);

      // Parse the created paper object ID
      console.log('🔍 Parsing paper object ID...');
      const paperMatch = stdout.match(/Created Objects:\s*\n\s*┌──\s*\n\s*│\s*ID:\s*([A-Za-z0-9]+)/);
      const paperId = paperMatch ? paperMatch[1] : null;
      console.log('Paper ID:', paperId);

      // Parse the treasury cap and policy cap IDs
      console.log('🔍 Parsing treasury and policy cap IDs...');
      const objectMatches = stdout.match(/Created Objects:\s*\n\s*┌──\s*\n\s*│\s*ID:\s*([A-Za-z0-9]+)/g);
      const objectIds = objectMatches ? objectMatches.map(match => {
        const idMatch = match.match(/ID:\s*([A-Za-z0-9]+)/);
        return idMatch ? idMatch[1] : null;
      }).filter(Boolean) : [];
      
      const treasuryCapId = objectIds[1] || null; // Second created object
      const policyCapId = objectIds[2] || null;   // Third created object
      
      console.log('Treasury Cap ID:', treasuryCapId);
      console.log('Policy Cap ID:', policyCapId);

      console.log('✅ Successfully parsed transaction results');
      return NextResponse.json({
        success: true,
        transactionId,
        paperId,
        treasuryCapId,
        policyCapId,
        rcltPriceInMusdt,
        message: 'Research paper deployed successfully'
      });

    } catch (execError) {
      console.error('💥 Error executing deploy_paper command:');
      console.error('Error type:', typeof execError);
      console.error('Error message:', execError instanceof Error ? execError.message : String(execError));
      console.error('Error stack:', execError instanceof Error ? execError.stack : 'No stack trace');
      console.error('Full error object:', execError);
      
      return NextResponse.json(
        { 
          error: 'Failed to deploy research paper',
          details: execError instanceof Error ? execError.message : 'Unknown error',
          command: deployPaperCommand,
          stderr: execError instanceof Error && 'stderr' in execError ? (execError as any).stderr : undefined,
          errorType: typeof execError,
          errorStack: execError instanceof Error ? execError.stack : undefined
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 Error in deploy paper API:');
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