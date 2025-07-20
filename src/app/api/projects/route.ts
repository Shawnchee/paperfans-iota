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

    // Enhanced validation for required fields
    const requiredFields = ['title', 'abstract', 'category', 'authorName', 'authorAffiliation', 'fundingGoal', 'daysLeft']
    const missingFields = requiredFields.filter(field => !body[field] || (typeof body[field] === 'string' && !body[field].trim()))

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Additional validation
    if (body.fundingGoal <= 0) {
      return NextResponse.json(
        { error: 'Funding goal must be greater than 0' },
        { status: 400 }
      )
    }

    if (body.daysLeft <= 0 || body.daysLeft > 365) {
      return NextResponse.json(
        { error: 'Campaign duration must be between 1 and 365 days' },
        { status: 400 }
      )
    }

    // Validate timeline if provided
    if (body.timeline && Array.isArray(body.timeline)) {
      const timelineErrors: string[] = []
      body.timeline.forEach((item: any, index: number) => {
        if (!item.phase || !item.phase.trim()) {
          timelineErrors.push(`Phase ${index + 1}: Phase name is required`)
        }
        if (!item.description || !item.description.trim()) {
          timelineErrors.push(`Phase ${index + 1}: Description is required`)
        }
        if (item.amountNeeded && item.amountNeeded < 0) {
          timelineErrors.push(`Phase ${index + 1}: Amount needed cannot be negative`)
        }
      })

      if (timelineErrors.length > 0) {
        return NextResponse.json(
          { error: `Timeline validation errors: ${timelineErrors.join(', ')}` },
          { status: 400 }
        )
      }

      // Check if timeline amounts exceed funding goal
      const totalTimelineAmount = body.timeline.reduce((sum: number, item: any) => sum + (item.amountNeeded || 0), 0)
      if (totalTimelineAmount > body.fundingGoal) {
        return NextResponse.json(
          { error: 'Total timeline amounts cannot exceed the funding goal' },
          { status: 400 }
        )
      }
    }

    // Transform frontend data to database format
    const projectData = {
      title: body.title.trim(),
      abstract: body.abstract.trim(),
      category: body.category,
      author_name: body.authorName.trim(),
      author_affiliation: body.authorAffiliation.trim(),
      author_image: body.authorImage?.trim() || null,
      image_url: body.imageUrl?.trim() || null,
      funding_goal: parseFloat(body.fundingGoal),
      current_funding: 0, // Start with 0 funding
      backer_count: 0, // Start with 0 backers
      days_left: parseInt(body.daysLeft),
      technical_approach: body.technicalApproach?.trim() || null,
      timeline: body.timeline ? JSON.stringify(body.timeline) : null,
      recent_activity: body.recentActivity ? JSON.stringify(body.recentActivity) : null,
      author_id: user.id // Add the authenticated user's ID
    }

    console.log('--- CREATE PROJECT ATTEMPT ---');
    console.log('Request body:', body);
    console.log('Transformed projectData:', projectData);

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error, { projectData, body });
      if (error.details) console.error('Supabase error details:', error.details);

      // Provide more specific error messages
      let errorMessage = 'Failed to create project'
      if (error.code === '23505') {
        errorMessage = 'A project with this title already exists'
      } else if (error.code === '23514') {
        errorMessage = 'Invalid data provided for one or more fields'
      } else if (error.message) {
        errorMessage = error.message
      }

      return NextResponse.json(
        { error: errorMessage, details: error.message, supabase: error.details },
        { status: 500 }
      )
    }

    console.log('Project created successfully:', project);

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