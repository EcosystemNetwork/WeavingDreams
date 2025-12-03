import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Narrative {
  id: string;
  name: string;
  creator: string;
  description: string;
  fundingGoal: number;
  raised: number;
  progress: number;
  narrativeType: 'film' | 'game';
  change24h: number;
}

export default function DimensionsPage() {
  const [narratives, setNarratives] = useState<Narrative[]>([
    {
      id: '1',
      name: 'Lost in Time',
      creator: 'Alex Rivera',
      description: 'A sci-fi thriller about temporal paradoxes',
      fundingGoal: 50000,
      raised: 32500,
      progress: 65,
      narrativeType: 'film',
      change24h: 12.5
    },
    {
      id: '2',
      name: 'Realm\'s Edge',
      creator: 'Jordan Chen',
      description: 'Open-world fantasy RPG with branching quests',
      fundingGoal: 75000,
      raised: 18750,
      progress: 25,
      narrativeType: 'game',
      change24h: -3.2
    },
    {
      id: '3',
      name: 'Echoes of Tomorrow',
      creator: 'Sam Taylor',
      description: 'Interactive drama exploring AI consciousness',
      fundingGoal: 40000,
      raised: 39500,
      progress: 99,
      narrativeType: 'game',
      change24h: 45.8
    },
    {
      id: '4',
      name: 'The Divide',
      creator: 'Maya Patel',
      description: 'Political thriller with multiple endings',
      fundingGoal: 60000,
      raised: 8500,
      progress: 14,
      narrativeType: 'film',
      change24h: 2.1
    },
    {
      id: '5',
      name: 'Neon Shadows',
      creator: 'Chris Wong',
      description: 'Cyberpunk adventure with choice-driven gameplay',
      fundingGoal: 85000,
      raised: 45200,
      progress: 53,
      narrativeType: 'game',
      change24h: 8.3
    },
    {
      id: '6',
      name: 'Forgotten Light',
      creator: 'Elena Rossi',
      description: 'Historical drama spanning three decades',
      fundingGoal: 55000,
      raised: 51800,
      progress: 94,
      narrativeType: 'film',
      change24h: 28.5
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newNarrative, setNewNarrative] = useState({
    name: '',
    description: '',
    fundingGoal: 50000,
    narrativeType: 'film' as 'film' | 'game'
  });
  const { toast } = useToast();

  const handleCreateNarrative = () => {
    if (!newNarrative.name || !newNarrative.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const narrative: Narrative = {
      id: Math.random().toString(36).substr(2, 9),
      name: newNarrative.name,
      creator: 'You',
      description: newNarrative.description,
      fundingGoal: newNarrative.fundingGoal,
      raised: 0,
      progress: 0,
      narrativeType: newNarrative.narrativeType,
      change24h: 0
    };

    setNarratives([narrative, ...narratives]);
    setNewNarrative({ name: '', description: '', fundingGoal: 50000, narrativeType: 'film' });
    setIsCreating(false);

    toast({
      title: "Narrative launched",
      description: `${newNarrative.name} is now live!`,
    });
  };

  const handleInvest = (id: string, amount: number) => {
    setNarratives(narratives.map(n => {
      if (n.id === id) {
        const newRaised = n.raised + amount;
        const newProgress = Math.min(Math.round((newRaised / n.fundingGoal) * 100), 100);
        return { ...n, raised: newRaised, progress: newProgress };
      }
      return n;
    }));

    const nar = narratives.find(n => n.id === id);
    toast({
      title: "Investment received",
      description: `$${amount} contributed to ${nar?.name}`,
    });
  };

  const totalRaised = narratives.reduce((sum, n) => sum + n.raised, 0);
  const sortedNarratives = [...narratives].sort((a, b) => b.raised - a.raised);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="DIMENSIONS" showBackButton={true} backHref="/" showNavButtons={true} />
      
      <div className="border-b border-border/50 bg-card/30 px-6 py-2 flex items-center justify-end">
        <Button onClick={() => setIsCreating(!isCreating)} className="h-10">
          <Plus className="w-4 h-4 mr-2" />
          Launch Narrative
        </Button>
      </div>

      {/* Stats */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Funded</p>
            <p className="text-3xl font-black text-primary">${(totalRaised / 1000000).toFixed(2)}M</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Active Narratives</p>
            <p className="text-3xl font-black">{narratives.length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Create Narrative Form */}
          {isCreating && (
            <div className="mb-8 p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <h2 className="text-lg font-bold mb-4">Launch Your Narrative</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newNarrative.name}
                    onChange={(e) => setNewNarrative({ ...newNarrative, name: e.target.value })}
                    placeholder="Narrative title"
                    className="mt-2 bg-background border-white/10 focus:border-primary"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newNarrative.description}
                    onChange={(e) => setNewNarrative({ ...newNarrative, description: e.target.value })}
                    placeholder="What's your story?"
                    className="min-h-[80px] font-serif bg-background border-white/10 focus:border-primary resize-none mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Funding Goal</Label>
                    <Input
                      type="number"
                      value={newNarrative.fundingGoal}
                      onChange={(e) => setNewNarrative({ ...newNarrative, fundingGoal: parseInt(e.target.value) })}
                      className="mt-2 bg-background border-white/10 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <div className="flex gap-2 mt-2">
                      {(['film', 'game'] as const).map(type => (
                        <Button
                          key={type}
                          variant={newNarrative.narrativeType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewNarrative({ ...newNarrative, narrativeType: type })}
                          className="flex-1 capitalize"
                        >
                          {type === 'film' ? '🎬' : '🎮'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleCreateNarrative} className="flex-1">
                    Launch
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Narratives Table/Rows */}
          <div className="space-y-2">
            {sortedNarratives.map((narrative, index) => (
              <div
                key={narrative.id}
                className="group border border-white/5 rounded-xl p-4 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-right w-8">
                      <p className="text-sm font-bold text-muted-foreground">#{index + 1}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base truncate">{narrative.name}</h3>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {narrative.narrativeType === 'film' ? '🎬 Film' : '🎮 Game'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{narrative.creator} • {narrative.description}</p>
                    </div>
                  </div>

                  {/* Center: Progress */}
                  <div className="flex-1 mx-6 hidden md:block">
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all"
                        style={{ width: `${narrative.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">${(narrative.raised / 1000).toFixed(0)}K</span>
                      <span className="text-xs text-muted-foreground">{narrative.progress}%</span>
                    </div>
                  </div>

                  {/* Right: Stats & Actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* 24h Change */}
                    <div className="w-16 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {narrative.change24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={narrative.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {Math.abs(narrative.change24h).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">24h</p>
                    </div>

                    {/* Investment Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[100, 500, 1000].map(amount => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleInvest(narrative.id, amount)}
                          className="text-xs h-8 px-2"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
