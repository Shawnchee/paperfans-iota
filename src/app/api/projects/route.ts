import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend interface
    const transformedProjects = projects?.map(project => ({
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
      fundingTiers: project.funding_tiers,
    })) || []

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Get user from request headers (you'll need to pass the user token from frontend)
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
    
    // Validate required fields
    const requiredFields = ['title', 'abstract', 'category', 'authorName', 'authorAffiliation', 'fundingGoal', 'daysLeft']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Transform frontend data to database format
    const projectData = {
      title: body.title,
      abstract: body.abstract,
      category: body.category,
      author_name: body.authorName,
      author_affiliation: body.authorAffiliation,
      author_image: body.authorImage,
      image_url: body.imageUrl,
      funding_goal: body.fundingGoal,
      current_funding: 0, // Start with 0 funding
      backer_count: 0, // Start with 0 backers
      days_left: body.daysLeft,
      technical_approach: body.technicalApproach,
      timeline: body.timeline ? JSON.stringify(body.timeline) : null,
      recent_activity: body.recentActivity ? JSON.stringify(body.recentActivity) : null,
      funding_tiers: body.fundingTiers ? JSON.stringify(body.fundingTiers) : null,
      funding_tiers: body.fundingTiers ? JSON.stringify(body.fundingTiers) : null,
      author_id: user.id // Add the authenticated user's ID
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
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

    return NextResponse.json(transformedProject, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 