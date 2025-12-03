import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, ArrowUpRight, Loader2, Coins, Users, Wallet } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import type { NarrativeProject, CreditAccount } from '@shared/schema';

interface ProjectWithUser extends NarrativeProject {
  user?: {
    firstName: string | null;
    lastName: string | null;
  };
}

export default function DimensionsPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithUser | null>(null);
  const [investAmount, setInvestAmount] = useState(100);
  const [newNarrative, setNewNarrative] = useState({
    title: '',
    description: '',
    fundingGoal: 5000,
    narrativeType: 'film' as 'film' | 'game'
  });

  const { data: projects, isLoading } = useQuery<ProjectWithUser[]>({
    queryKey: ['/api/projects'],
  });

  const { data: myProjects } = useQuery<NarrativeProject[]>({
    queryKey: ['/api/projects/my'],
    enabled: isAuthenticated,
  });

  const { data: creditAccount } = useQuery<CreditAccount>({
    queryKey: ['/api/credits'],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; fundingGoal: number; narrativeType: string }) => {
      return await apiRequest('POST', '/api/projects', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/my'] });
      toast.success('Narrative launched successfully!');
      setIsCreating(false);
      setNewNarrative({ title: '', description: '', fundingGoal: 5000, narrativeType: 'film' });
    },
    onError: () => {
      toast.error('Failed to launch narrative');
    },
  });

  const contributeMutation = useMutation({
    mutationFn: async ({ projectId, amount }: { projectId: number; amount: number }) => {
      return await apiRequest('POST', `/api/projects/${projectId}/contribute`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/contributions'] });
      toast.success(`Invested ${investAmount} credits!`);
      setInvestDialogOpen(false);
      setSelectedProject(null);
    },
    onError: (error: any) => {
      if (error.message === 'Insufficient credits') {
        toast.error('Not enough credits. Complete quests to earn more!');
      } else {
        toast.error('Failed to invest');
      }
    },
  });

  const handleCreateNarrative = () => {
    if (!newNarrative.title || !newNarrative.description) {
      toast.error('Please fill in all fields');
      return;
    }
    createMutation.mutate(newNarrative);
  };

  const handleInvest = () => {
    if (!selectedProject || investAmount <= 0) return;
    contributeMutation.mutate({ projectId: selectedProject.id, amount: investAmount });
  };

  const openInvestDialog = (project: ProjectWithUser) => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }
    setSelectedProject(project);
    setInvestAmount(100);
    setInvestDialogOpen(true);
  };

  const totalRaised = projects?.reduce((sum, n) => sum + n.currentFunding, 0) || 0;
  const sortedProjects = [...(projects || [])].sort((a, b) => b.currentFunding - a.currentFunding);

  const getCreatorName = (project: ProjectWithUser) => {
    if (project.user?.firstName || project.user?.lastName) {
      return `${project.user.firstName || ''} ${project.user.lastName || ''}`.trim();
    }
    return 'Anonymous Creator';
  };

  const getProgress = (project: NarrativeProject) => {
    return Math.min(Math.round((project.currentFunding / project.fundingGoal) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Dimensions" showBackButton={true} backHref="/" showNavButtons={true} />
      
      <div className="border-b border-border/50 bg-card/30 px-6 py-2 flex items-center justify-end">
        {isAuthenticated ? (
          <Button onClick={() => setIsCreating(!isCreating)} className="h-10" data-testid="button-launch">
            <Plus className="w-4 h-4 mr-2" />
            Launch Narrative
          </Button>
        ) : (
          <a href="/api/login">
            <Button className="h-10">Sign in to Launch</Button>
          </a>
        )}
      </div>

      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Funded</p>
            <p className="text-3xl font-black text-primary" data-testid="text-total-funded">
              {totalRaised.toLocaleString()} <span className="text-lg">credits</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Active Narratives</p>
            <p className="text-3xl font-black" data-testid="text-active-count">{projects?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {isCreating && (
            <div className="mb-8 p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <h2 className="text-lg font-bold mb-4">Launch Your Narrative</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newNarrative.title}
                    onChange={(e) => setNewNarrative({ ...newNarrative, title: e.target.value })}
                    placeholder="Narrative title"
                    className="mt-2 bg-background border-white/10 focus:border-primary"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newNarrative.description}
                    onChange={(e) => setNewNarrative({ ...newNarrative, description: e.target.value })}
                    placeholder="What's your story?"
                    className="min-h-[80px] font-serif bg-background border-white/10 focus:border-primary resize-none mt-2"
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Funding Goal (credits)</Label>
                    <Input
                      type="number"
                      value={newNarrative.fundingGoal}
                      onChange={(e) => setNewNarrative({ ...newNarrative, fundingGoal: parseInt(e.target.value) || 0 })}
                      className="mt-2 bg-background border-white/10 focus:border-primary"
                      data-testid="input-goal"
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
                          data-testid={`button-type-${type}`}
                        >
                          {type === 'film' ? '🎬' : '🎮'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleCreateNarrative} 
                    className="flex-1" 
                    disabled={createMutation.isPending}
                    data-testid="button-create"
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch'}
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList data-testid="tabs-dimensions">
              <TabsTrigger value="all">All Narratives</TabsTrigger>
              {isAuthenticated && <TabsTrigger value="my">My Launches</TabsTrigger>}
            </TabsList>

            <TabsContent value="all" className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : sortedProjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No narratives yet. Be the first to launch!</p>
                </div>
              ) : (
                sortedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group border border-white/5 rounded-xl p-4 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all"
                    data-testid={`card-project-${project.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-right w-8">
                          <p className="text-sm font-bold text-muted-foreground">#{index + 1}</p>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base truncate">{project.title}</h3>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {project.narrativeType === 'film' ? '🎬 Film' : '🎮 Game'}
                            </Badge>
                            {project.status === 'funded' && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Funded!</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{getCreatorName(project)} • {project.description}</p>
                        </div>
                      </div>

                      <div className="flex-1 mx-6 hidden md:block">
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all"
                            style={{ width: `${getProgress(project)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{project.currentFunding.toLocaleString()} credits</span>
                          <span className="text-xs text-muted-foreground">{getProgress(project)}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="w-16 text-right hidden sm:block">
                          <div className="flex items-center justify-end gap-1 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span className="text-sm">{project.backerCount}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">backers</p>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => openInvestDialog(project)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={project.status === 'funded'}
                          data-testid={`button-invest-${project.id}`}
                        >
                          <Coins className="w-4 h-4 mr-1" />
                          Invest
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {isAuthenticated && (
              <TabsContent value="my" className="space-y-2">
                {!myProjects || myProjects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">You haven't launched any narratives yet.</p>
                    <Button className="mt-4" onClick={() => setIsCreating(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Launch Your First Narrative
                    </Button>
                  </div>
                ) : (
                  myProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-white/5 rounded-xl p-4 bg-card/50"
                      data-testid={`card-my-project-${project.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base truncate">{project.title}</h3>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {project.narrativeType === 'film' ? '🎬 Film' : '🎮 Game'}
                            </Badge>
                            {project.status === 'funded' && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Funded!</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold text-primary">{project.currentFunding.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">of {project.fundingGoal.toLocaleString()} credits</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{project.backerCount}</p>
                            <p className="text-xs text-muted-foreground">backers</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mt-3">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all"
                          style={{ width: `${getProgress(project)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      <Dialog open={investDialogOpen} onOpenChange={setInvestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">{selectedProject?.description}</p>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm">Your Balance</span>
              <span className="font-bold text-primary">{creditAccount?.balance?.toLocaleString() || 0} credits</span>
            </div>

            <div className="space-y-2">
              <Label>Investment Amount</Label>
              <div className="flex gap-2">
                {[50, 100, 250, 500].map(amount => (
                  <Button
                    key={amount}
                    variant={investAmount === amount ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInvestAmount(amount)}
                    className="flex-1"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(parseInt(e.target.value) || 0)}
                className="mt-2"
                data-testid="input-invest-amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInvest} 
              disabled={contributeMutation.isPending || investAmount <= 0 || (creditAccount?.balance || 0) < investAmount}
              data-testid="button-confirm-invest"
            >
              {contributeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Invest {investAmount} Credits
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
