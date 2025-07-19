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

    // Transform frontend data to database format for research_projects
    const projectData = {
      title: body.title,
      abstract: body.abstract,
      category: body.category,
      domain: body.domain,
      tags: body.tags,
      author_name: body.authorName,
      author_affiliation: body.authorAffiliation,
      author_image: body.authorImage,
      orcid_id: body.orcidId,
      image_url: body.imageUrl,
      funding_goal: body.fundingGoal,
      days_left: body.daysLeft,
      technical_approach: body.technicalApproach,
      proposal_doc_url: body.proposalDocUrl,
      budget: body.budget,
      goal_summary: body.goalSummary,
      platform_allocation: body.platformAllocation,
      research_team_allocation: body.researchTeamAllocation,
      investor_allocation: body.investorAllocation,
      total_token_supply: body.totalTokenSupply,
      platform_tokens: body.platformTokens,
      research_team_tokens: body.researchTeamTokens,
      investor_tokens: body.investorTokens,
      timeline: body.timeline ? JSON.stringify(body.timeline) : null,
      returns: body.returns ? JSON.stringify(body.returns) : null,
      artifacts: body.artifacts ? JSON.stringify(body.artifacts) : null,
      status: body.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('--- CREATE RESEARCH PROJECT ATTEMPT ---');
    console.log('Request body:', body);
    console.log('projectData:', projectData);

    const { data: project, error } = await supabase
      .from('research_projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error, { projectData, body });
      if (error.details) console.error('Supabase error details:', error.details);
      return NextResponse.json(
        { error: 'Failed to create project', details: error.message, supabase: error.details },
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