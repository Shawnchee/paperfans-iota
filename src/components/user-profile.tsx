"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function UserProfile() {
  const { userProfile, updateUserProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    walletAddress: userProfile?.walletAddress || '',
    orcidId: userProfile?.orcidId || '',
  });
  const [updating, setUpdating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userProfile) return;
    
    setUpdating(true);
    try {
      const { error } = await updateUserProfile({
        name: formData.name,
        walletAddress: formData.walletAddress,
        orcidId: formData.orcidId,
      });
      
      if (!error) {
        setIsEditing(false);
      } else {
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || '',
      walletAddress: userProfile?.walletAddress || '',
      orcidId: userProfile?.orcidId || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No user profile found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name || 'User'} />
            <AvatarFallback>
              {userProfile.name?.charAt(0).toUpperCase() || userProfile.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userProfile.email}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            ) : (
              <Input
                id="name"
                value={userProfile.name || 'Not set'}
                disabled
                className="bg-muted"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            {isEditing ? (
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                placeholder="Enter your wallet address"
              />
            ) : (
              <Input
                id="walletAddress"
                value={userProfile.walletAddress || 'Not set'}
                disabled
                className="bg-muted"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orcidId">ORCID ID</Label>
            {isEditing ? (
              <Input
                id="orcidId"
                value={formData.orcidId}
                onChange={(e) => handleInputChange('orcidId', e.target.value)}
                placeholder="Enter your ORCID ID"
              />
            ) : (
              <Input
                id="orcidId"
                value={userProfile.orcidId || 'Not set'}
                disabled
                className="bg-muted"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label>MUSTDT Balance:</Label>
          <Badge variant="secondary">
            {userProfile.mustdtBalance.toFixed(2)} MUSTDT
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Member since: {new Date(userProfile.createdAt).toLocaleDateString()}</p>
          <p>Last updated: {new Date(userProfile.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={updating}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 