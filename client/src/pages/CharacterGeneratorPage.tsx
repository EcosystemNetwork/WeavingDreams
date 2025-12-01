import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Sparkles, RotateCw, Copy, BookOpen, Save } from 'lucide-react';
import { Link } from 'wouter';
import { mockKieAi, Character } from '@/lib/mockAi';
import { wikiStore } from '@/lib/wikiStore';
import { useToast } from '@/hooks/use-toast';

export default function CharacterGeneratorPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newChar = await mockKieAi.generateCharacter();
      setCharacter(newChar);
      setCharacters([newChar, ...characters]);
      toast({
        title: "Character Generated",
        description: `${newChar.name} has been created!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate character.",
        variant: "destructive"
      });
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
    toast({
      title: "Copied",
      description: "Character profile copied to clipboard.",
    });
  };

  const handleSaveToWiki = () => {
    if (!character) return;
    wikiStore.addCharacter(character);
    toast({
      title: "Saved to Wiki",
      description: `${character.name} has been added to your Story Wiki.`,
    });
  };

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
          <h1 className="font-bold text-sm tracking-wide">Character Generator</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-primary">Kie AI Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {character ? (
            <div className="w-full max-w-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold mb-2">{character.name}</h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">{character.archetype}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate New'}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleSaveToWiki}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to Wiki
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Create Your Character</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Let Kie AI generate a compelling character profile with unique traits, motivations, and backstory.
                </p>
              </div>
              <Button 
                size="lg" 
                className="h-12 px-8"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Character'}
              </Button>
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
