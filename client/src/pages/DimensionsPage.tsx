import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Sparkles, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface Dimension {
  id: string;
  name: string;
  description: string;
  fundingGoal: number;
  raised: number;
  narrativeType: 'film' | 'game';
  creator: string;
  progress: number;
}

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<Dimension[]>([
    {
      id: '1',
      name: 'Lost in Time',
      description: 'A sci-fi thriller about temporal paradoxes and alternate realities',
      fundingGoal: 50000,
      raised: 32500,
      narrativeType: 'film',
      creator: 'Alex Rivera',
      progress: 65
    },
    {
      id: '2',
      name: 'Realm\'s Edge',
      description: 'Open-world fantasy RPG with branching quests and dynamic endings',
      fundingGoal: 75000,
      raised: 18750,
      narrativeType: 'game',
      creator: 'Jordan Chen',
      progress: 25
    },
    {
      id: '3',
      name: 'Echoes of Tomorrow',
      description: 'Interactive drama exploring AI consciousness and humanity',
      fundingGoal: 40000,
      raised: 39500,
      narrativeType: 'game',
      creator: 'Sam Taylor',
      progress: 99
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newDimension, setNewDimension] = useState({
    name: '',
    description: '',
    fundingGoal: 50000,
    narrativeType: 'film' as 'film' | 'game'
  });
  const { toast } = useToast();

  const handleCreateDimension = () => {
    if (!newDimension.name || !newDimension.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const dimension: Dimension = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDimension.name,
      description: newDimension.description,
      fundingGoal: newDimension.fundingGoal,
      raised: 0,
      narrativeType: newDimension.narrativeType,
      creator: 'You',
      progress: 0
    };

    setDimensions([dimension, ...dimensions]);
    setNewDimension({ name: '', description: '', fundingGoal: 50000, narrativeType: 'film' });
    setIsCreating(false);

    toast({
      title: "Dimension created",
      description: `${newDimension.name} is now live for funding!`,
    });
  };

  const handleInvest = (id: string, amount: number) => {
    setDimensions(dimensions.map(d => {
      if (d.id === id) {
        const newRaised = d.raised + amount;
        const newProgress = Math.min(Math.round((newRaised / d.fundingGoal) * 100), 100);
        return { ...d, raised: newRaised, progress: newProgress };
      }
      return d;
    }));

    const dim = dimensions.find(d => d.id === id);
    toast({
      title: "Investment received",
      description: `$${amount} contributed to ${dim?.name}`,
    });
  };

  const totalRaised = dimensions.reduce((sum, d) => sum + d.raised, 0);
  const averageProgress = Math.round(dimensions.reduce((sum, d) => sum + d.progress, 0) / dimensions.length);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-sm tracking-wide">Dimensions Fund</h1>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Fuel narrative creation</p>
      </header>

      <div className="flex-1 overflow-auto">
        {/* Stats Bar */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-muted-foreground">Total Funded</p>
                <p className="text-2xl font-bold text-primary">${(totalRaised / 1000).toFixed(1)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Dimensions</p>
                <p className="text-2xl font-bold text-primary">{dimensions.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold text-primary">{averageProgress}%</p>
              </div>
            </div>
            <Button onClick={() => setIsCreating(!isCreating)} className="h-10">
              <Plus className="w-4 h-4 mr-2" />
              Create Dimension
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Create Dimension Form */}
          {isCreating && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle>Launch Your Dimension</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={newDimension.name}
                    onChange={(e) => setNewDimension({ ...newDimension, name: e.target.value })}
                    placeholder="Enter narrative title"
                    className="mt-2 bg-background"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newDimension.description}
                    onChange={(e) => setNewDimension({ ...newDimension, description: e.target.value })}
                    placeholder="What's your story about?"
                    className="min-h-[100px] font-serif bg-background resize-y mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Funding Goal ($)</Label>
                    <Input
                      type="number"
                      value={newDimension.fundingGoal}
                      onChange={(e) => setNewDimension({ ...newDimension, fundingGoal: parseInt(e.target.value) })}
                      className="mt-2 bg-background"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <div className="flex gap-2 mt-2">
                      {(['film', 'game'] as const).map(type => (
                        <Button
                          key={type}
                          variant={newDimension.narrativeType === type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewDimension({ ...newDimension, narrativeType: type })}
                          className="flex-1 capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateDimension} className="flex-1">
                    Launch Dimension
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dimensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dimension) => (
              <Card key={dimension.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-base">{dimension.name}</CardTitle>
                    <Badge variant="outline" className="text-xs capitalize">
                      {dimension.narrativeType === 'film' ? '🎬' : '🎮'} {dimension.narrativeType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">by {dimension.creator}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground font-serif line-clamp-2">{dimension.description}</p>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">${(dimension.raised / 1000).toFixed(1)}K raised</span>
                      <span className="text-xs text-muted-foreground">{dimension.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-500"
                        style={{ width: `${dimension.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Goal: ${(dimension.fundingGoal / 1000).toFixed(0)}K</p>
                  </div>

                  {/* Investment Options */}
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 500, 1000].map(amount => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="secondary"
                        onClick={() => handleInvest(dimension.id, amount)}
                        className="text-xs h-8"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  {dimension.progress === 100 && (
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
                      <p className="text-xs font-semibold text-primary">✓ Funding Complete</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
