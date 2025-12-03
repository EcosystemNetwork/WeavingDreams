import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, RotateCw, Copy, Save, Coins } from 'lucide-react';
import { Link } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { mockKieAi, Character } from '@/lib/mockAi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import type { CreditAccount } from '@shared/schema';

const GENERATE_COST = 10;

export default function CharacterGeneratorPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const queryClient = useQueryClient();

  const { data: creditAccount, isLoading: isLoadingCredits } = useQuery<CreditAccount>({
    queryKey: ['/api/credits'],
  });

  const spendCreditsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/credits/spend', {
        amount: GENERATE_COST,
        source: 'character_generation',
        description: 'AI character generation',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
    },
  });

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

  const saveCharacterMutation = useMutation({
    mutationFn: async (char: Character) => {
      const response = await apiRequest('POST', '/api/characters', {
        name: char.name,
        archetype: char.archetype,
        background: char.background,
        personality: char.personality,
        motivation: char.motivation,
        flaw: char.flaw,
        trait: char.trait,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
      updateQuestProgressMutation.mutate('character_create');
      toast.success('Character saved to your library');
    },
    onError: () => {
      toast.error('Failed to save character');
    },
  });

  const handleGenerate = async () => {
    if (isLoadingCredits) {
      toast.error('Please wait while credits are loading...');
      return;
    }
    
    if (!creditAccount || creditAccount.balance < GENERATE_COST) {
      toast.error(`Not enough credits! You need ${GENERATE_COST} credits to generate a character.`);
      return;
    }

    setIsGenerating(true);
    try {
      await spendCreditsMutation.mutateAsync();
      const newChar = await mockKieAi.generateCharacter();
      setCharacter(newChar);
      setCharacters([newChar, ...characters]);
      updateQuestProgressMutation.mutate('ai_usage');
      toast.success(`${newChar.name} has been created!`);
    } catch (error: any) {
      if (error.message?.includes('Insufficient credits')) {
        toast.error('Not enough credits to generate character');
      } else {
        toast.error('Failed to generate character');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!character) return;
    const text = `
Name: ${character.name}
Archetype: ${character.archetype}
Background: ${character.background}
Personality: ${character.personality}
Motivation: ${character.motivation}
Flaw: ${character.flaw}
Trait: ${character.trait}
    `.trim();
    navigator.clipboard.writeText(text);
    toast.success('Character profile copied to clipboard');
  };

  const handleSaveToWiki = () => {
    if (!character) return;
    saveCharacterMutation.mutate(character);
  };

  const hasEnoughCredits = !isLoadingCredits && creditAccount && creditAccount.balance >= GENERATE_COST;
  const isButtonDisabled = isGenerating || isLoadingCredits || !hasEnoughCredits;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Character Generator" showBackButton={true} backHref="/dashboard" showNavButtons={true} />

      <div className="flex-1 overflow-hidden flex">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          {character ? (
            <div className="w-full max-w-2xl space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-3xl sm:text-5xl font-bold mb-2">{character.name}</h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">{character.archetype}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Card className="border-white/5 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Background</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">{character.background}</p>
                  </CardContent>
                </Card>

                <Card className="border-white/5 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Personality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">{character.personality}</p>
                  </CardContent>
                </Card>

                <Card className="border-white/5 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Motivation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">{character.motivation}</p>
                  </CardContent>
                </Card>

                <Card className="border-white/5 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Flaw</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">{character.flaw}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/5 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Signature Trait</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary font-serif leading-relaxed">{character.trait}</p>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button 
                  className="flex-1 text-xs sm:text-sm" 
                  onClick={handleGenerate}
                  disabled={isButtonDisabled}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{isGenerating ? 'Generating...' : isLoadingCredits ? 'Loading...' : `Generate New (${GENERATE_COST})`}</span>
                  <span className="sm:hidden">{isGenerating ? 'Gen...' : 'Generate'}</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={handleSaveToWiki}
                  disabled={saveCharacterMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveCharacterMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Create Your Character</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Let AI generate a compelling character profile with unique traits, motivations, and backstory.
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  className="h-12 px-8"
                  onClick={handleGenerate}
                  disabled={isButtonDisabled}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : isLoadingCredits ? 'Loading...' : 'Generate Character'}
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Costs {GENERATE_COST} credits</span>
                  {!isLoadingCredits && !hasEnoughCredits && (
                    <Link href="/quests">
                      <span className="text-primary hover:underline ml-1">(Get more)</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Panel */}
        {characters.length > 0 && (
          <>
            <Separator orientation="vertical" />
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-sm">Generated Characters</h3>
                <p className="text-xs text-muted-foreground mt-1">{characters.length} total</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {characters.map((char, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCharacter(char)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        character?.name === char.name
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 hover:border-primary/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium text-sm">{char.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{char.archetype}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
