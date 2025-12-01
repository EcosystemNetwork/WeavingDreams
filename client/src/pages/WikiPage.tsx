import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Users, MapPin, Trash2, Copy, BookOpen, Box } from 'lucide-react';
import { Link } from 'wouter';
import { wikiStore, WikiEnvironment, WikiProp } from '@/lib/wikiStore';
import { Character } from '@/lib/mockAi';
import { useToast } from '@/hooks/use-toast';

export default function WikiPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [environments, setEnvironments] = useState<WikiEnvironment[]>([]);
  const [props, setProps] = useState<WikiProp[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<WikiEnvironment | null>(null);
  const [selectedProp, setSelectedProp] = useState<WikiProp | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const chars = wikiStore.getCharacters();
    const envs = wikiStore.getEnvironments();
    const prps = wikiStore.getProps();
    setCharacters(chars);
    setEnvironments(envs);
    setProps(prps);
  }, []);

  const handleCopyCharacter = (char: Character) => {
    const text = `
Name: ${char.name}
Archetype: ${char.archetype}
Background: ${char.background}
Personality: ${char.personality}
Motivation: ${char.motivation}
Flaw: ${char.flaw}
Trait: ${char.trait}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Character profile copied to clipboard." });
  };

  const handleCopyEnvironment = (env: WikiEnvironment) => {
    const text = `
Name: ${env.name}
Type: ${env.type}
Description: ${env.description}
Atmosphere: ${env.atmosphere}
Key Details: ${env.keyDetails}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Environment copied to clipboard." });
  };

  const handleDeleteCharacter = (name: string) => {
    wikiStore.deleteCharacter(name);
    setCharacters(characters.filter(c => c.name !== name));
    if (selectedCharacter?.name === name) {
      setSelectedCharacter(null);
    }
    toast({ title: "Deleted", description: "Character removed from wiki." });
  };

  const handleDeleteEnvironment = (id: string) => {
    wikiStore.deleteEnvironment(id);
    setEnvironments(environments.filter(e => e.id !== id));
    if (selectedEnv?.id === id) {
      setSelectedEnv(null);
    }
    toast({ title: "Deleted", description: "Environment removed from wiki." });
  };

  const handleCopyProp = (prop: WikiProp) => {
    const text = `
Name: ${prop.name}
Category: ${prop.category}
Description: ${prop.description}
Appearance: ${prop.appearance}
Significance: ${prop.significance}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Prop copied to clipboard." });
  };

  const handleDeleteProp = (id: string) => {
    wikiStore.deleteProp(id);
    setProps(props.filter(p => p.id !== id));
    if (selectedProp?.id === id) {
      setSelectedProp(null);
    }
    toast({ title: "Deleted", description: "Prop removed from wiki." });
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
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-sm tracking-wide">Story Wiki</h1>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {characters.length} Characters • {environments.length} Environments • {props.length} Props
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-2">{selectedCharacter.name}</h2>
                    <Badge className="bg-primary/20 text-primary border-primary/30">{selectedCharacter.archetype}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="flex gap-3">
                    <Button onClick={() => setSelectedCharacter(null)} variant="outline" className="flex-1">
                      Back to List
                    </Button>
                    <Button onClick={() => handleCopyCharacter(selectedCharacter)} variant="secondary" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      onClick={() => handleDeleteCharacter(selectedCharacter.name)}
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {characters.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No characters in wiki yet. Create one in the Character Generator!</p>
                    </div>
                  ) : (
                    characters.map((char) => (
                      <Card
                        key={char.name}
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-2">{selectedEnv.name}</h2>
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

                  <div className="flex gap-3">
                    <Button onClick={() => setSelectedEnv(null)} variant="outline" className="flex-1">
                      Back to List
                    </Button>
                    <Button onClick={() => handleCopyEnvironment(selectedEnv)} variant="secondary" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      onClick={() => handleDeleteEnvironment(selectedEnv.id)}
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-2">{selectedProp.name}</h2>
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

                  <div className="flex gap-3">
                    <Button onClick={() => setSelectedProp(null)} variant="outline" className="flex-1">
                      Back to List
                    </Button>
                    <Button onClick={() => handleCopyProp(selectedProp)} variant="secondary" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      onClick={() => handleDeleteProp(selectedProp.id)}
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}
