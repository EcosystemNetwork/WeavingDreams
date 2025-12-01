import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Box, Trash2, Save, Copy, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { wikiStore, WikiProp } from '@/lib/wikiStore';
import { useToast } from '@/hooks/use-toast';

interface Prop extends WikiProp {}

const PROP_CATEGORIES = [
  'Weapon',
  'Tool',
  'Artifact',
  'Technology',
  'Furniture',
  'Vehicle',
  'Jewelry',
  'Document',
  'Magical Item',
  'Decoration'
];

export default function PropCreatorPage() {
  const [props, setProps] = useState<Prop[]>([]);
  const [selectedProp, setSelectedProp] = useState<Prop | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateNew = () => {
    const newProp: Prop = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Prop',
      category: 'Artifact',
      description: '',
      appearance: '',
      significance: '',
      createdAt: Date.now()
    };
    setProps([newProp, ...props]);
    setSelectedProp(newProp);
    setIsCreating(true);
  };

  const handleUpdate = (field: keyof Prop, value: string) => {
    if (!selectedProp) return;
    const updated = { ...selectedProp, [field]: value };
    setSelectedProp(updated);
    setProps(props.map(p => p.id === updated.id ? updated : p));
  };

  const handleDelete = (id: string) => {
    setProps(props.filter(p => p.id !== id));
    if (selectedProp?.id === id) {
      setSelectedProp(null);
    }
    toast({
      title: "Prop deleted",
      description: "The prop has been removed.",
    });
  };

  const handleSave = () => {
    if (!selectedProp) return;
    wikiStore.addProp({
      ...selectedProp,
      createdAt: Date.now()
    });
    toast({
      title: "Prop saved",
      description: `${selectedProp.name} has been saved to your Story Wiki.`,
    });
    setIsCreating(false);
  };

  const handleCopy = (prop: Prop) => {
    const text = `
Name: ${prop.name}
Category: ${prop.category}
Description: ${prop.description}
Appearance: ${prop.appearance}
Significance: ${prop.significance}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Prop details copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/narrative-studio">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-sm tracking-wide">Prop Creator</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-primary">Kie AI Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {selectedProp ? (
            <div className="w-full max-w-2xl space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Prop Name</Label>
                  <Input
                    value={selectedProp.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                    className="mt-2 bg-background"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PROP_CATEGORIES.map(category => (
                      <Badge
                        key={category}
                        variant={selectedProp.category === category ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleUpdate('category', category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={selectedProp.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="What is this prop? What's its purpose?"
                    className="min-h-[120px] font-serif bg-background resize-y mt-2"
                  />
                </div>

                <div>
                  <Label>Appearance & Design</Label>
                  <Textarea
                    value={selectedProp.appearance}
                    onChange={(e) => handleUpdate('appearance', e.target.value)}
                    placeholder="How does it look? Colors, materials, size, distinctive features..."
                    className="min-h-[100px] font-serif bg-background resize-y mt-2"
                  />
                </div>

                <div>
                  <Label>Narrative Significance</Label>
                  <Textarea
                    value={selectedProp.significance}
                    onChange={(e) => handleUpdate('significance', e.target.value)}
                    placeholder="Why is this prop important to the story? What role does it play?"
                    className="min-h-[100px] font-serif bg-background resize-y mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save to Wiki
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleCopy(selectedProp)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedProp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Box className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Create Props</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Design objects, weapons, artifacts, and items that shape your narrative world.
                </p>
              </div>
              <Button
                size="lg"
                className="h-12 px-8"
                onClick={handleCreateNew}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Prop
              </Button>
            </div>
          )}
        </div>

        {/* History Panel */}
        {props.length > 0 && (
          <>
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-sm">Props</h3>
                <p className="text-xs text-muted-foreground mt-1">{props.length} total</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {props.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => setSelectedProp(prop)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedProp?.id === prop.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 hover:border-primary/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="font-medium text-sm">{prop.name}</div>
                      <Badge variant="outline" className="mt-1 text-xs">{prop.category}</Badge>
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
                  New Prop
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
