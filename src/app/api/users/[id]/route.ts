import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { User, UpdateUserRequest } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT /api/users/[id] - Update user profile
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Verify the user is updating their own profile
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', params.id)
            .eq('auth_user_ref', user.id)
            .single();

        if (profileError || !userProfile) {
            return NextResponse.json(
                { error: 'User profile not found or access denied' },
                { status: 404 }
            );
        }

        // Parse request body
        const body: UpdateUserRequest = await request.json();

        // Prepare update data
        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.avatarUrl !== undefined) updateData.avatar_url = body.avatarUrl;
        if (body.walletAddress !== undefined) updateData.wallet_address = body.walletAddress;
        if (body.orcidId !== undefined) updateData.orcid_id = body.orcidId;

        // Update user profile
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating user profile:', updateError);
            return NextResponse.json(
                { error: 'Failed to update user profile' },
                { status: 500 }
            );
        }

        // Transform the data to match our frontend types
        const transformedUser: User = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            avatarUrl: updatedUser.avatar_url,
            walletAddress: updatedUser.wallet_address,
            mustdtBalance: updatedUser.mustdt_balance,
            orcidId: updatedUser.orcid_id,
            createdAt: updatedUser.created_at,
            updatedAt: updatedUser.updated_at,
            authUserRef: updatedUser.auth_user_ref,
        };

        return NextResponse.json(transformedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/users/[id] - Get specific user profile (public)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', params.id)
            .single();

        if (profileError) {
            if (profileError.code === 'PGRST116') {
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