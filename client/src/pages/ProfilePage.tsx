import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit2, Save, X, Loader2, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface UserBadge {
  id: number;
  userId: string;
  badgeId: number;
  earnedAt: string;
  badge: {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || '');

  const { data: badges = [], isLoading: loadingBadges } = useQuery<UserBadge[]>({
    queryKey: ['/api/profile/badges'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PUT', '/api/profile', {
        bio,
        profileImageUrl: profileImage,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-xs sm:text-sm tracking-wide">My Profile</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profile Settings</span>
                {!isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    data-testid="button-edit-profile"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Profile Image</label>
                <div className="flex items-start gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage || user.profileImageUrl || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                        data-testid="input-profile-image"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Enter a valid image URL</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <p className="text-sm text-muted-foreground">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Bio</label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none h-24"
                    data-testid="input-bio"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground min-h-12 italic">
                    {bio || 'No bio added yet'}
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => updateProfileMutation.mutate()}
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setIsEditing(false);
                      setBio(user.bio || '');
                      setProfileImage(user.profileImageUrl || '');
                    }}
                    data-testid="button-cancel-profile"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Earned Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBadges ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : badges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No badges earned yet. Create content to earn achievements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {badges.map((badgeData) => (
                    <div
                      key={badgeData.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all"
                      data-testid={`badge-${badgeData.badge.id}`}
                    >
                      <div className={`text-2xl flex-shrink-0`}>{badgeData.badge.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{badgeData.badge.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{badgeData.badge.description}</p>
                        <Badge
                          className={`text-xs ${badgeData.badge.color}`}
                          variant="outline"
                        >
                          Earned {new Date(badgeData.earnedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
