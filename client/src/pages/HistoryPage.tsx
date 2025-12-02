import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MapPin, Box, Clock, Trash2 } from 'lucide-react';
import { wikiStore } from '@/lib/wikiStore';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [creations, setCreations] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const wiki = wikiStore.getAll();
    
    // Combine all creations with type metadata
    const allCreations = [
      ...wiki.characters.map(c => ({
        id: c.name,
        name: c.name,
        type: 'character',
        typeLabel: 'Character',
        description: c.background,
        createdAt: (c as any).createdAt || Date.now(),
        metadata: c.archetype
      })),
      ...wiki.environments.map(e => ({
        id: e.id,
        name: e.name,
        type: 'environment',
        typeLabel: 'Environment',
        description: e.description,
        createdAt: e.createdAt || Date.now(),
        metadata: e.type
      })),
      ...wiki.props.map(p => ({
        id: p.id,
        name: p.name,
        type: 'prop',
        typeLabel: 'Prop',
        description: p.description,
        createdAt: p.createdAt || Date.now(),
        metadata: p.category
      }))
    ];

    // Sort by date (newest first)
    const sorted = allCreations.sort((a, b) => b.createdAt - a.createdAt);
    setCreations(sorted);
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'character') {
      wikiStore.deleteCharacter(id);
    } else if (type === 'environment') {
      wikiStore.deleteEnvironment(id);
    } else if (type === 'prop') {
      wikiStore.deleteProp(id);
    }
    toast.success("Creation removed from history");
    loadHistory();
  };

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  // Group by date
  const groupedByDate: { [key: string]: typeof creations } = {};
  creations.forEach(creation => {
    const dateKey = formatDate(creation.createdAt).split(' at ')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(creation);
  });

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
          {creations.length} Total Creations
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {creations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No creations yet. Start building your story!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByDate).map(([dateKey, items]) => (
                <div key={dateKey}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">{dateKey}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((creation) => (
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
                          <Link href={`/${creation.type === 'character' ? 'characters' : creation.type === 'environment' ? 'environment-creator' : 'props'}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
