import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MapPin, Sparkles, Trash2, Save, Copy, BookOpen } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';

interface Environment {
  id: string;
  name: string;
  type: string;
  description: string;
  atmosphere: string;
  keyDetails: string;
  createdAt: number;
}

const ENVIRONMENT_TYPES = [
  'Urban',
  'Forest',
  'Castle',
  'Spaceship',
  'Underground',
  'Desert',
  'Ocean',
  'Sky',
  'Laboratory',
  'Tavern'
];

export default function EnvironmentCreatorPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const updateQuestProgressMutation = useMutation({
    mutationFn: async (questType: string) => {
      const response = await apiRequest('POST', '/api/quests/progress', {
        questType,
        increment: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quests/daily'] });
    },
  });

  const saveEnvironmentMutation = useMutation({
    mutationFn: async (env: Environment) => {
      const response = await apiRequest('POST', '/api/environments', {
        name: env.name,
        type: env.type,
        description: env.description,
        atmosphere: env.atmosphere,
        keyDetails: env.keyDetails,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/environments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      updateQuestProgressMutation.mutate('environment_create');
      toast.success('Environment saved to your library');
    },
    onError: () => {
      toast.error('Failed to save environment');
    },
  });

  const handleCreateNew = () => {
    const newEnv: Environment = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Environment',
      type: 'Urban',
      description: '',
      atmosphere: '',
      keyDetails: '',
      createdAt: Date.now()
    };
    setEnvironments([newEnv, ...environments]);
    setSelectedEnv(newEnv);
    setIsCreating(true);
  };

  const handleUpdate = (field: keyof Environment, value: string) => {
    if (!selectedEnv) return;
    const updated = { ...selectedEnv, [field]: value };
    setSelectedEnv(updated);
    setEnvironments(environments.map(e => e.id === updated.id ? updated : e));
  };

  const handleDelete = (id: string) => {
    setEnvironments(environments.filter(e => e.id !== id));
    if (selectedEnv?.id === id) {
      setSelectedEnv(null);
    }
    toast.success('Environment removed');
  };

  const handleSave = () => {
    if (!selectedEnv) return;
    saveEnvironmentMutation.mutate(selectedEnv);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Environment Creator" showBackButton={true} backHref="/narrative-studio" showNavButtons={false} />

      <div className="flex-1 overflow-hidden flex">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {selectedEnv ? (
            <div className="w-full max-w-2xl space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Environment Name</Label>
                  <Input
                    value={selectedEnv.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                    className="mt-2 bg-background"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ENVIRONMENT_TYPES.map(type => (
                      <Badge
                        key={type}
                        variant={selectedEnv.type === type ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleUpdate('type', type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={selectedEnv.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="What does this environment look like?"
                    className="min-h-[120px] font-serif bg-background resize-y mt-2"
                  />
                </div>

                <div>
                  <Label>Atmosphere</Label>
                  <Textarea
                    value={selectedEnv.atmosphere}
                    onChange={(e) => handleUpdate('atmosphere', e.target.value)}
                    placeholder="What's the mood? Tense? Serene? Mysterious?"
                    className="min-h-[100px] font-serif bg-background resize-y mt-2"
                  />
                </div>

                <div>
                  <Label>Key Details</Label>
                  <Textarea
                    value={selectedEnv.keyDetails}
                    onChange={(e) => handleUpdate('keyDetails', e.target.value)}
                    placeholder="Important objects, landmarks, or features..."
                    className="min-h-[100px] font-serif bg-background resize-y mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1"
                  disabled={saveEnvironmentMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveEnvironmentMutation.isPending ? 'Saving...' : 'Save Environment'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(selectedEnv.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Create Environments</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Build immersive locations for your narrative. Describe atmospheres, details, and visual elements.
                </p>
              </div>
              <Button
                size="lg"
                className="h-12 px-8"
                onClick={handleCreateNew}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Environment
              </Button>
            </div>
          )}
        </div>

        {/* History Panel */}
        {environments.length > 0 && (
          <>
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-sm">Environments</h3>
                <p className="text-xs text-muted-foreground mt-1">{environments.length} total</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {environments.map((env) => (
                    <button
                      key={env.id}
                      onClick={() => setSelectedEnv(env)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedEnv?.id === env.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 hover:border-primary/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium text-sm">{env.name}</div>
                      <Badge variant="outline" className="mt-1 text-xs">{env.type}</Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-border/50">
                <Button
                  onClick={handleCreateNew}
                  className="w-full"
                  variant="secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Environment
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
