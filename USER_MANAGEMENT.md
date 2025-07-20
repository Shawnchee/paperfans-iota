# User Management System

This document explains how to use the new user management system that rides on top of Supabase Auth.

## Database Schema

The system includes a `users` table with the following structure:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    wallet_address VARCHAR(255),
    mustdt_balance DECIMAL(15,2) DEFAULT 0,
    orcid_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    auth_user_ref UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE
);
```

## API Endpoints

### 1. Get Current User Profile
```
GET /api/users
Authorization: Bearer <jwt_token>
```

Returns the current user's profile or 404 if not found.

### 2. Create User Profile
```
POST /api/users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "walletAddress": "0x123...",
  "orcidId": "0000-0000-0000-0000"
}
```

Creates a new user profile. Returns 409 if profile already exists.

### 3. Auto-Create User Profile
```
POST /api/users/auto-create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "walletAddress": "0x123...",
  "orcidId": "0000-0000-0000-0000"
}
```

Automatically creates a user profile using auth user data. Email is taken from the JWT token.

### 4. Update User Profile
```
PUT /api/users/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "walletAddress": "0x123...",
  "orcidId": "0000-0000-0000-0000"
}
```

Updates the user profile. Users can only update their own profile.

### 5. Get User Profile by ID (Public)
```
GET /api/users/{id}
```

Returns a user profile by ID. No authentication required.

## Frontend Usage

### Using the Auth Context

The auth context now includes user profile management:

```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { 
    user,           // Auth user from Supabase
    userProfile,    // Extended user profile from our table
    updateUserProfile,
    loading 
  } = useAuth();

  // Update user profile
  const handleUpdateProfile = async () => {
    const { error } = await updateUserProfile({
      name: "New Name",
      walletAddress: "0x123...",
      orcidId: "0000-0000-0000-0000"
    });
    
    if (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Welcome, {userProfile?.name || user?.email}</h1>
      <p>Balance: {userProfile?.mustdtBalance} MUSTDT</p>
    </div>
  );
}
```

### Using the User Service

For more advanced operations, use the user service directly:

```typescript
import { 
  getCurrentUserProfile,
  createUserProfile,
  autoCreateUserProfile,
  updateUserProfile,
  getUserProfile,
  ensureUserProfile
} from '@/lib/user-service';

// Get current user profile
const { user, error } = await getCurrentUserProfile(authHeaders);

// Create user profile manually
const { user, error } = await createUserProfile(userData, authHeaders);

// Auto-create user profile after signup
const { user, error } = await autoCreateUserProfile(additionalData, authHeaders);

// Update user profile
const { user, error } = await updateUserProfile(userId, updates, authHeaders);

// Get any user profile (public)
const { user, error } = await getUserProfile(userId);

// Ensure user profile exists (create if doesn't exist)
const { user, error } = await ensureUserProfile(authHeaders, additionalData);
```

### User Profile Component

A ready-to-use user profile component is available:

```typescript
import { UserProfile } from '@/components/user-profile';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserProfile />
    </div>
  );
}
```

## Auto-Creation Flow

The system automatically creates user profiles when users first sign up:

1. User signs up through Supabase Auth
2. Auth context detects the new session
3. `ensureUserProfile` is called automatically
4. If no profile exists, `autoCreateUserProfile` creates one
5. Profile is populated with auth user data and any additional info

## Security Features

- **Row Level Security (RLS)**: Users can only access their own profiles
- **JWT Verification**: All API endpoints verify JWT tokens
- **Ownership Validation**: Users can only update their own profiles
- **Public Read Access**: User profiles can be read publicly by ID

## Environment Variables

Make sure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

Run the SQL commands in `supabase-schema.sql` to set up the database:

1. Create the users table
2. Add indexes for performance
3. Set up triggers for updated_at
4. Enable RLS and create policies

## TypeScript Types

The system includes comprehensive TypeScript types:

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  mustdtBalance: number;
  orcidId?: string;
  createdAt: string;
  updatedAt: string;
  authUserRef: string;
}

interface CreateUserRequest {
  email: string;
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  orcidId?: string;
}

interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  walletAddress?: string;
  orcidId?: string;
}
``` 