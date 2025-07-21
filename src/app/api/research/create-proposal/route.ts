import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  console.log("🚀 CREATE PROPOSAL API CALL START");
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

    // First, test if IOTA CLI is available
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

    // New contract addresses from the updated deployment
    console.log("📋 Contract addresses:");
    // Update these addresses with the new values from the transaction output
    const contractAddress = "0x39bc694c6a1f2c24405ec65865f11695d30dd780a44cbbaa1d4e912d1c71953e";
    const treasuryCapAddress = "0x2e0bd37b08022e6733393db4246a54dc7a3838e60ef3438239d961d03c796f22";
    const policyCapAddress = "0xb64cc74d82dc13843eaa18c792a07f5bb387410569cd74e1cf722a9979aa611b";
    console.log("  - Contract:", contractAddress);
    console.log("  - Treasury cap:", treasuryCapAddress);
    console.log("  - Policy cap:", policyCapAddress);

    // Convert arrays to strings for the new contract
    console.log("🔄 Converting arrays to strings...");
    const tagsString = tags && tags.length > 0 ? tags.join(',') : "";
    const revenueModelsString = revenueModels && revenueModels.length > 0 ? revenueModels.join(',') : "";
    console.log("  - Tags string:", tagsString);
    console.log("  - Revenue models string:", revenueModelsString);

    // Create the command with String types (no more vector<vector<u8>> issues)
    const createProposalCommand = `iota client call --package ${contractAddress} --module ResearchToken --function create_proposal --args "${title}" "${abstract}" "${category}" "${domain}" "${tagsString}" "${technicalApproach || ''}" "${projectImage || ''}" "${authorName}" "${authorAffiliation}" "${authorImage || ''}" "${orcidId || ''}" ${Math.floor(fundingGoal * 100/85)} ${campaignDurationDays} ${researchTeamPercentage} "${revenueModelsString}" ${treasuryCapAddress} ${policyCapAddress} --gas-budget 100000000`;

    console.log('🚀 Executing create_proposal command:');
    console.log('Command:', createProposalCommand);

    try {
      console.log('⏳ Executing command with 60 second timeout...');
      const { stdout, stderr } = await execAsync(createProposalCommand, {
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
      const transactionId = digestMatch ? digestMatch[1] : `proposal-${Date.now()}`;
      console.log('Transaction ID:', transactionId);

      // Parse the created proposal object ID
      console.log('🔍 Parsing proposal object ID...');
      const proposalMatch = stdout.match(/Created Objects:\s*\n\s*┌──\s*\n\s*│\s*ID:\s*([A-Za-z0-9]+)/);
      const proposalId = proposalMatch ? proposalMatch[1] : null;
      console.log('Proposal ID:', proposalId);

      console.log('✅ Successfully parsed transaction results');
      return NextResponse.json({
        success: true,
        transactionId,
        proposalId,
        message: 'Research proposal created successfully'
      });

    } catch (execError) {
      console.error('💥 Error executing create_proposal command:');
      console.error('Error type:', typeof execError);
      console.error('Error message:', execError instanceof Error ? execError.message : String(execError));
      console.error('Error stack:', execError instanceof Error ? execError.stack : 'No stack trace');
      console.error('Full error object:', execError);
      
      // Return detailed error information
      return NextResponse.json(
        { 
          error: 'Failed to create research proposal',
          details: execError instanceof Error ? execError.message : 'Unknown error',
          command: createProposalCommand,
          stderr: execError instanceof Error && 'stderr' in execError ? (execError as any).stderr : undefined,
          errorType: typeof execError,
          errorStack: execError instanceof Error ? execError.stack : undefined
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 Error in create proposal API:');
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