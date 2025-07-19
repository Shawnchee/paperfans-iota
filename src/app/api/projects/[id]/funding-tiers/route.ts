import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: fundingTiers, error } = await supabase
      .from('funding_tiers')
      .select('*')
      .eq('project_id', id)
      .order('amount', { ascending: true })

    if (error) {
      console.error('Error fetching funding tiers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch funding tiers' },
        { status: 500 }
      )
    }

    return NextResponse.json(fundingTiers || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'amount', 'benefits']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const tierData = {
      project_id: parseInt(id),
      name: body.name,
      description: body.description,
      amount: body.amount,
      benefits: body.benefits,
      backer_count: 0,
      max_backers: body.maxBackers
    }

    const { data: fundingTier, error } = await supabase
      .from('funding_tiers')
      .insert(tierData)
      .select()
      .single()

    if (error) {
      console.error('Error creating funding tier:', error)
      return NextResponse.json(
        { error: 'Failed to create funding tier' },
        { status: 500 }
      )
    }

    return NextResponse.json(fundingTier, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 