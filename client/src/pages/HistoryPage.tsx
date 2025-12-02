import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MapPin, Box, Clock, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import type { Character, Environment, Prop } from '@shared/schema';

interface HistoryData {
  characters: Character[];
  environments: Environment[];
  props: Prop[];
}

export default function HistoryPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<HistoryData>({
    queryKey: ['/api/history'],
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      toast.success('Character removed from history');
    },
  });

  const deleteEnvironmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/environments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/environments'] });
      toast.success('Environment removed from history');
    },
  });

  const deletePropMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/props/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/props'] });
      toast.success('Prop removed from history');
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'character':
        return <Users className="w-5 h-5" />;
      case 'environment':
        return <MapPin className="w-5 h-5" />;
      case 'prop':
        return <Box className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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
    if (!date) return 'Unknown date';
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Combine and sort all creations
  const allCreations = [
    ...(data?.characters.map(c => ({
      id: c.id,
      name: c.name,
      type: 'character' as const,
      description: c.background,
      createdAt: c.createdAt,
      metadata: c.archetype,
    })) || []),
    ...(data?.environments.map(e => ({
      id: e.id,
      name: e.name,
      type: 'environment' as const,
      description: e.description,
      createdAt: e.createdAt,
      metadata: e.type,
    })) || []),
    ...(data?.props.map(p => ({
      id: p.id,
      name: p.name,
      type: 'prop' as const,
      description: p.description,
      createdAt: p.createdAt,
      metadata: p.category,
    })) || []),
  ].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleDelete = (type: string, id: number) => {
    if (type === 'character') {
      deleteCharacterMutation.mutate(id);
    } else if (type === 'environment') {
      deleteEnvironmentMutation.mutate(id);
    } else if (type === 'prop') {
      deletePropMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-sm tracking-wide">Creation History</h1>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {allCreations.length} Total Creations
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allCreations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No creations yet. Start building your story!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allCreations.map((creation) => (
                <Card key={`${creation.type}-${creation.id}`} className="border-white/5 hover:border-primary/30 transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1 text-primary flex-shrink-0">
                          {getIcon(creation.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base truncate">{creation.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(creation.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(creation.type, creation.id)}
                        className="text-muted-foreground hover:text-destructive flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge className={`${getTypeColor(creation.type)} border`}>
                      {creation.metadata}
                    </Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-serif leading-relaxed">
                      {creation.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
