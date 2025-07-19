import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
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

    // Fetch only projects belonging to the authenticated user
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user projects:', error)
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
      updatedAt: project.updated_at
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