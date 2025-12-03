import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Eye, Users, MapPin, Box, Loader2, Share2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import type { GalleryItem, Character, Environment, Prop } from '@shared/schema';

interface GalleryItemWithUser extends GalleryItem {
  user?: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

interface HistoryData {
  characters: Character[];
  environments: Environment[];
  props: Prop[];
}

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<'character' | 'environment' | 'prop'>('character');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishDescription, setPublishDescription] = useState('');

  const { data: galleryItems, isLoading } = useQuery<GalleryItemWithUser[]>({
    queryKey: ['/api/gallery'],
  });

  const { data: userLikes } = useQuery<number[]>({
    queryKey: ['/api/gallery/likes'],
  });

  const { data: myGalleryItems } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery/my'],
  });

  const { data: historyData } = useQuery<HistoryData>({
    queryKey: ['/api/history'],
  });

  const likeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('POST', `/api/gallery/${itemId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/likes'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('DELETE', `/api/gallery/${itemId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/likes'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (data: { itemType: string; itemId: number; title: string; description: string; imageUrl?: string }) => {
      return await apiRequest('POST', '/api/gallery', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/my'] });
      toast.success('Published to gallery!');
      setPublishDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to publish');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/my'] });
      toast.success('Removed from gallery');
    },
  });

  const resetForm = () => {
    setSelectedItemType('character');
    setSelectedItemId(null);
    setPublishTitle('');
    setPublishDescription('');
  };

  const handleLike = (itemId: number) => {
    if (userLikes?.includes(itemId)) {
      unlikeMutation.mutate(itemId);
    } else {
      likeMutation.mutate(itemId);
    }
  };

  const handlePublish = () => {
    if (!selectedItemId || !publishTitle.trim()) {
      toast.error('Please select an item and enter a title');
      return;
    }

    let imageUrl: string | undefined;
    if (selectedItemType === 'character') {
      const character = historyData?.characters.find(c => c.id === selectedItemId);
      imageUrl = character?.imageUrl || undefined;
    }

    publishMutation.mutate({
      itemType: selectedItemType,
      itemId: selectedItemId,
      title: publishTitle.trim(),
      description: publishDescription.trim(),
      imageUrl,
    });
  };

  const getAvailableItems = () => {
    if (!historyData) return [];
    const publishedIds = myGalleryItems?.map(g => `${g.itemType}-${g.itemId}`) || [];
    
    switch (selectedItemType) {
      case 'character':
        return historyData.characters.filter(c => !publishedIds.includes(`character-${c.id}`));
      case 'environment':
        return historyData.environments.filter(e => !publishedIds.includes(`environment-${e.id}`));
      case 'prop':
        return historyData.props.filter(p => !publishedIds.includes(`prop-${p.id}`));
      default:
        return [];
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'character':
        return <Users className="w-4 h-4" />;
      case 'environment':
        return <MapPin className="w-4 h-4" />;
      case 'prop':
        return <Box className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'environment':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'prop':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getUserDisplayName = (item: GalleryItemWithUser) => {
    if (item.user?.firstName || item.user?.lastName) {
      return `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim();
    }
    return 'Anonymous';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Community Gallery" showBackButton={true} backHref="/" showNavButtons={true} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Community Gallery</h1>
              <p className="text-muted-foreground mt-1">Discover and share creative works from the community</p>
            </div>
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-publish">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Publish Work</span>
                  <span className="sm:hidden">Publish</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Publish to Gallery</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={selectedItemType} onValueChange={(value: 'character' | 'environment' | 'prop') => {
                      setSelectedItemType(value);
                      setSelectedItemId(null);
                    }}>
                      <SelectTrigger data-testid="select-item-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character">Character</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                        <SelectItem value="prop">Prop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Creation</Label>
                    <Select value={selectedItemId?.toString() || ''} onValueChange={(value) => setSelectedItemId(parseInt(value))}>
                      <SelectTrigger data-testid="select-item">
                        <SelectValue placeholder="Choose from your creations" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableItems().map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      placeholder="Give your work a title"
                      data-testid="input-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={publishDescription}
                      onChange={(e) => setPublishDescription(e.target.value)}
                      placeholder="Describe your creation..."
                      rows={3}
                      data-testid="input-description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePublish} disabled={publishMutation.isPending} data-testid="button-confirm-publish">
                    {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="explore" className="space-y-6">
            <TabsList data-testid="tabs-gallery">
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="my-works">My Published Works</TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !galleryItems || galleryItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No works published yet. Be the first to share!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <Card key={item.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden" data-testid={`card-gallery-${item.id}`}>
                      {item.imageUrl && (
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!item.imageUrl && (
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          {getIcon(item.itemType)}
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                          <Badge variant="outline" className={`text-xs flex-shrink-0 ${getTypeColor(item.itemType)}`}>
                            {item.itemType}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {item.user?.profileImageUrl ? (
                              <img src={item.user.profileImageUrl} alt="" className="w-5 h-5 rounded-full" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-primary/20" />
                            )}
                            <span>{getUserDisplayName(item)}</span>
                          </div>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1.5 ${userLikes?.includes(item.id) ? 'text-red-400' : ''}`}
                            onClick={() => handleLike(item.id)}
                            disabled={likeMutation.isPending || unlikeMutation.isPending}
                            data-testid={`button-like-${item.id}`}
                          >
                            <Heart className={`w-4 h-4 ${userLikes?.includes(item.id) ? 'fill-current' : ''}`} />
                            <span>{item.likes}</span>
                          </Button>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{item.views}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-works" className="space-y-4">
              {!myGalleryItems || myGalleryItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">You haven't published any works yet.</p>
                  <p className="text-sm mt-2">Create something amazing and share it with the community!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myGalleryItems.map((item) => (
                    <Card key={item.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden" data-testid={`card-my-gallery-${item.id}`}>
                      {item.imageUrl && (
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!item.imageUrl && (
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          {getIcon(item.itemType)}
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                          <Badge variant="outline" className={`text-xs flex-shrink-0 ${getTypeColor(item.itemType)}`}>
                            {item.itemType}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                      </CardHeader>
                      <CardFooter className="border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" /> {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" /> {item.views}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
