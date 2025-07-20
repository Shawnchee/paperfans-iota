import { User, CreateUserRequest, UpdateUserRequest } from './types';

// Get current user profile
export async function getCurrentUserProfile(authHeaders: { Authorization: string }): Promise<{ user: User | null; error: any }> {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
        });

        if (response.status === 404) {
            return { user: null, error: null }; // User profile doesn't exist yet
        }

        if (!response.ok) {
            const error = await response.json();
            return { user: null, error };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// Create new user profile
export async function createUserProfile(
    userData: CreateUserRequest,
    authHeaders: { Authorization: string }
): Promise<{ user: User | null; error: any }> {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            return { user: null, error };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// Auto-create user profile after signup
export async function autoCreateUserProfile(
    additionalData: Partial<CreateUserRequest>,
    authHeaders: { Authorization: string }
): Promise<{ user: User | null; error: any }> {
    try {
        const response = await fetch('/api/users/auto-create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(additionalData),
        });

        if (!response.ok) {
            const error = await response.json();
            return { user: null, error };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// Update user profile
export async function updateUserProfile(
    userId: string,
    updates: UpdateUserRequest,
    authHeaders: { Authorization: string }
): Promise<{ user: User | null; error: any }> {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const error = await response.json();
            return { user: null, error };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// Get user profile by ID (public)
export async function getUserProfile(userId: string): Promise<{ user: User | null; error: any }> {
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            const error = await response.json();
            return { user: null, error };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// Ensure user profile exists (create if doesn't exist)
export async function ensureUserProfile(
    authHeaders: { Authorization: string },
    additionalData?: Partial<CreateUserRequest>
): Promise<{ user: User | null; error: any }> {
    try {
        // First try to get existing profile
        const { user: existingUser, error: getError } = await getCurrentUserProfile(authHeaders);

        if (getError) {
            return { user: null, error: getError };
        }

        if (existingUser) {
            return { user: existingUser, error: null };
        }

        // Profile doesn't exist, create it
        const { user: newUser, error: createError } = await autoCreateUserProfile(
            additionalData || {},
            authHeaders
        );

        return { user: newUser, error: createError };
    } catch (error) {
        return { user: null, error };
    }
} 