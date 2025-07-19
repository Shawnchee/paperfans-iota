import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if this is an authenticated request (for editing)
    const authHeader = request.headers.get('authorization')
    let user = null
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (!authError && authUser) {
        user = authUser
      }
    }
    
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // If user is authenticated, check if they own the project
    if (user && project.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to access this project' },
        { status: 403 }
      )
    }

    // Transform the data to match the frontend interface
    const transformedProject = {
      id: project.id,
      title: project.title,
      abstract: project.abstract,
      category: project.category,
      authorName: project.author_name,
      authorAffiliation: project.author_affiliation,
      authorImage: project.author_image,
      imageUrl: project.image_url,
      fundingGoal: project.funding_goal,
      currentFunding: project.current_funding,
      backerCount: project.backer_count,
      daysLeft: project.days_left,
      technicalApproach: project.technical_approach,
      timeline: project.timeline,
      recentActivity: project.recent_activity,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      authorId: project.author_id,
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      )
    }

    // Check if project exists and user owns it
    const { data: existingProject } = await supabase
      .from('projects')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (existingProject.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to edit this project' },
        { status: 403 }
      )
    }

    // Transform frontend data to database format
    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.abstract !== undefined) updateData.abstract = body.abstract
    if (body.category !== undefined) updateData.category = body.category
    if (body.authorName !== undefined) updateData.author_name = body.authorName
    if (body.authorAffiliation !== undefined) updateData.author_affiliation = body.authorAffiliation
    if (body.authorImage !== undefined) updateData.author_image = body.authorImage
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl
    if (body.fundingGoal !== undefined) updateData.funding_goal = body.fundingGoal
    if (body.currentFunding !== undefined) updateData.current_funding = body.currentFunding
    if (body.backerCount !== undefined) updateData.backer_count = body.backerCount
    if (body.daysLeft !== undefined) updateData.days_left = body.daysLeft
    if (body.technicalApproach !== undefined) updateData.technical_approach = body.technicalApproach
    if (body.timeline !== undefined) updateData.timeline = body.timeline ? JSON.stringify(body.timeline) : null
    if (body.recentActivity !== undefined) updateData.recent_activity = body.recentActivity ? JSON.stringify(body.recentActivity) : null

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    // Transform back to frontend format
    const transformedProject = {
      id: project.id,
      title: project.title,
      abstract: project.abstract,
      category: project.category,
      authorName: project.author_name,
      authorAffiliation: project.author_affiliation,
      authorImage: project.author_image,
      imageUrl: project.image_url,
      fundingGoal: project.funding_goal,
      currentFunding: project.current_funding,
      backerCount: project.backer_count,
      daysLeft: project.days_left,
      technicalApproach: project.technical_approach,
      timeline: project.timeline,
      recentActivity: project.recent_activity,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }

    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 