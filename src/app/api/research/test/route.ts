import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // Test IOTA CLI availability
    try {
      const { stdout: versionOutput } = await execAsync('iota client --version', {
        cwd: process.cwd(),
        timeout: 10000
      });
      
      // Test current environment
      const { stdout: envOutput } = await execAsync('iota client envs', {
        cwd: process.cwd(),
        timeout: 10000
      });

      return NextResponse.json({
        success: true,
        version: versionOutput.trim(),
        environment: envOutput.trim(),
        message: 'IOTA CLI is working correctly'
      });

    } catch (versionError) {
      console.error('IOTA CLI test failed:', versionError);
      return NextResponse.json(
        { 
          success: false,
          error: 'IOTA CLI not available',
          details: versionError instanceof Error ? versionError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 