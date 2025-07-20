import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { User, CreateUserRequest } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/users - Get current user profile
export async function GET(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - No valid token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Verify the JWT token and get user info
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        // Get user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_ref', user.id)
            .single();

        if (profileError) {
            if (profileError.code === 'PGRST116') {
                // User profile doesn't exist yet
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 404 }
                );
            }
            throw profileError;
        }

        // Transform the data to match our frontend types
        const transformedUser: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            avatarUrl: userProfile.avatar_url,
            walletAddress: userProfile.wallet_address,
            mustdtBalance: userProfile.mustdt_balance,
            orcidId: userProfile.orcid_id,
            createdAt: userProfile.created_at,
            updatedAt: userProfile.updated_at,
            authUserRef: userProfile.auth_user_ref,
        };

        return NextResponse.json(transformedUser);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create new user profile
export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - No valid token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Verify the JWT token and get user info
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        // Check if user profile already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_ref', user.id)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'User profile already exists' },
                { status: 409 }
            );
        }

        // Parse request body
        const body: CreateUserRequest = await request.json();

        // Validate required fields
        if (!body.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Create new user profile
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email: body.email,
                name: body.name,
                avatar_url: body.avatarUrl,
                wallet_address: body.walletAddress,
                orcid_id: body.orcidId,
                auth_user_ref: user.id,
            })
            .select()
            .single();

        if (createError) {
            console.error('Error creating user profile:', createError);
            return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
            );
        }

        // Transform the data to match our frontend types
        const transformedUser: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            avatarUrl: newUser.avatar_url,
            walletAddress: newUser.wallet_address,
            mustdtBalance: newUser.mustdt_balance,
            orcidId: newUser.orcid_id,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at,
            authUserRef: newUser.auth_user_ref,
        };

        return NextResponse.json(transformedUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 