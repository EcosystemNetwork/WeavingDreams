import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Users, MapPin, Box, Copy, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import type { Character, Environment, Prop } from '@shared/schema';

export default function WikiPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [selectedProp, setSelectedProp] = useState<Prop | null>(null);
  const queryClient = useQueryClient();

  const { data: characters = [], isLoading: loadingChars } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
  });

  const { data: environments = [], isLoading: loadingEnvs } = useQuery<Environment[]>({
    queryKey: ['/api/environments'],
  });

  const { data: props = [], isLoading: loadingProps } = useQuery<Prop[]>({
    queryKey: ['/api/props'],
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      setSelectedCharacter(null);
      toast.success('Character deleted');
    },
  });

  const deleteEnvironmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/environments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/environments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      setSelectedEnv(null);
      toast.success('Environment deleted');
    },
  });

  const deletePropMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/props/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/props'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      setSelectedProp(null);
      toast.success('Prop deleted');
    },
  });

  const handleCopyCharacter = (char: Character) => {
    const text = `Name: ${char.name}\nArchetype: ${char.archetype}\nBackground: ${char.background}\nPersonality: ${char.personality}\nMotivation: ${char.motivation}\nFlaw: ${char.flaw}\nTrait: ${char.trait}`;
    navigator.clipboard.writeText(text);
    toast.success('Character copied to clipboard');
  };

  const handleCopyEnvironment = (env: Environment) => {
    const text = `Name: ${env.name}\nType: ${env.type}\nDescription: ${env.description}\nAtmosphere: ${env.atmosphere}\nKey Details: ${env.keyDetails}`;
    navigator.clipboard.writeText(text);
    toast.success('Environment copied to clipboard');
  };

  const handleCopyProp = (prop: Prop) => {
    const text = `Name: ${prop.name}\nCategory: ${prop.category}\nDescription: ${prop.description}\nAppearance: ${prop.appearance}\nSignificance: ${prop.significance}`;
    navigator.clipboard.writeText(text);
    toast.success('Prop copied to clipboard');
  };

  const isLoading = loadingChars || loadingEnvs || loadingProps;

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
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <h1 className="font-bold text-xs sm:text-sm tracking-wide">Story Wiki</h1>
          </div>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          {characters.length} Characters • {environments.length} Environments • {props.length} Props
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="characters" className="max-w-4xl mx-auto">
              <TabsList>
                <TabsTrigger value="characters" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Characters
                </TabsTrigger>
                <TabsTrigger value="environments" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Environments
                </TabsTrigger>
                <TabsTrigger value="props" className="flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Props
                </TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="space-y-6">
                {selectedCharacter ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center mb-4 sm:mb-8">
                      <h2 className="text-2xl sm:text-4xl font-bold mb-2">{selectedCharacter.name}</h2>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{selectedCharacter.archetype}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Card className="border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Background</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground font-serif">{selectedCharacter.background}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Personality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground font-serif">{selectedCharacter.personality}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Motivation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground font-serif">{selectedCharacter.motivation}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Flaw</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground font-serif">{selectedCharacter.flaw}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-white/5 bg-primary/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Signature Trait</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-primary font-serif">{selectedCharacter.trait}</p>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button onClick={() => setSelectedCharacter(null)} variant="outline" className="flex-1">
                        Back to List
                      </Button>
                      <Button onClick={() => handleCopyCharacter(selectedCharacter)} variant="secondary" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button 
                        onClick={() => deleteCharacterMutation.mutate(selectedCharacter.id)}
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        disabled={deleteCharacterMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {characters.length === 0 ? (
                      <div className="col-span-3 text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No characters in wiki yet. Create one in the Character Generator!</p>
                      </div>
                    ) : (
                      characters.map((char) => (
                        <Card
                          key={char.id}
                          className="border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => setSelectedCharacter(char)}
                        >
                          <CardHeader>
                            <CardTitle className="text-sm">{char.name}</CardTitle>
                            <Badge variant="outline" className="w-fit text-xs mt-2">{char.archetype}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground line-clamp-3 font-serif">{char.background}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="environments" className="space-y-6">
                {selectedEnv ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center mb-4 sm:mb-8">
                      <h2 className="text-2xl sm:text-4xl font-bold mb-2">{selectedEnv.name}</h2>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{selectedEnv.type}</Badge>
                    </div>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedEnv.description}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Atmosphere</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedEnv.atmosphere}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Key Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedEnv.keyDetails}</p>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button onClick={() => setSelectedEnv(null)} variant="outline" className="flex-1">
                        Back to List
                      </Button>
                      <Button onClick={() => handleCopyEnvironment(selectedEnv)} variant="secondary" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button 
                        onClick={() => deleteEnvironmentMutation.mutate(selectedEnv.id)}
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        disabled={deleteEnvironmentMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {environments.length === 0 ? (
                      <div className="col-span-3 text-center py-12 text-muted-foreground">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No environments in wiki yet. Create one in the Environment Creator!</p>
                      </div>
                    ) : (
                      environments.map((env) => (
                        <Card
                          key={env.id}
                          className="border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => setSelectedEnv(env)}
                        >
                          <CardHeader>
                            <CardTitle className="text-sm">{env.name}</CardTitle>
                            <Badge variant="outline" className="w-fit text-xs mt-2">{env.type}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground line-clamp-3 font-serif">{env.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="props" className="space-y-6">
                {selectedProp ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center mb-4 sm:mb-8">
                      <h2 className="text-2xl sm:text-4xl font-bold mb-2">{selectedProp.name}</h2>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{selectedProp.category}</Badge>
                    </div>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedProp.description}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Appearance & Design</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedProp.appearance}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Narrative Significance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground font-serif leading-relaxed">{selectedProp.significance}</p>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button onClick={() => setSelectedProp(null)} variant="outline" className="flex-1">
                        Back to List
                      </Button>
                      <Button onClick={() => handleCopyProp(selectedProp)} variant="secondary" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button 
                        onClick={() => deletePropMutation.mutate(selectedProp.id)}
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        disabled={deletePropMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {props.length === 0 ? (
                      <div className="col-span-3 text-center py-12 text-muted-foreground">
                        <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No props in wiki yet. Create one in the Prop Creator!</p>
                      </div>
                    ) : (
                      props.map((prop) => (
                        <Card
                          key={prop.id}
                          className="border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => setSelectedProp(prop)}
                        >
                          <CardHeader>
                            <CardTitle className="text-sm">{prop.name}</CardTitle>
                            <Badge variant="outline" className="w-fit text-xs mt-2">{prop.category}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground line-clamp-3 font-serif">{prop.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
