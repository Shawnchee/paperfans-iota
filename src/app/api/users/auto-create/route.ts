import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { User } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/users/auto-create - Auto-create user profile after signup
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

        // Parse request body for additional user info
        const body = await request.json();

        // Create new user profile with auth user info
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email: user.email || '',
                name: body.name || user.user_metadata?.full_name || user.user_metadata?.name,
                avatar_url: body.avatarUrl || user.user_metadata?.avatar_url,
                wallet_address: body.walletAddress,
                orcid_id: body.orcidId,
                auth_user_ref: user.id,
            })
            .select()
            .single();

        if (createError) {
            console.error('Error auto-creating user profile:', createError);
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
        console.error('Error auto-creating user profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 