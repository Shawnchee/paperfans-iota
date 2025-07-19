import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid funding amount' },
        { status: 400 }
      )
    }

    if (!body.contributorName) {
      return NextResponse.json(
        { error: 'Contributor name is required' },
        { status: 400 }
      )
    }

    // Start a transaction to update both project and create contribution
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('current_funding, backer_count')
      .eq('id', id)
      .single()

    if (projectError) {
      console.error('Error fetching project:', projectError)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const newFundingAmount = project.current_funding + body.amount
    const newBackerCount = project.backer_count + 1

    // Update project funding
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        current_funding: newFundingAmount,
        backer_count: newBackerCount
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating project:', updateError)
      return NextResponse.json(
        { error: 'Failed to update project funding' },
        { status: 500 }
      )
    }

    // Create funding contribution record
    const contributionData = {
      project_id: parseInt(id),
      contributor_name: body.contributorName,
      amount: body.amount,
      wallet_address: body.walletAddress,
      transaction_id: body.transactionId || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const { data: contribution, error: contributionError } = await supabase
      .from('funding_contributions')
      .insert(contributionData)
      .select()
      .single()

    if (contributionError) {
      console.error('Error creating contribution:', contributionError)
      return NextResponse.json(
        { error: 'Failed to record contribution' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      transactionId: contribution.transaction_id,
      newFundingAmount,
      message: 'Funding successful'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 