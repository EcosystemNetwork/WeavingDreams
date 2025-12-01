import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Save, 
  Trash2, 
  Plus, 
  Wand2, 
  PlayCircle, 
  GitFork,
  Type,
  Settings
} from 'lucide-react';
import { mockKieAi } from '@/lib/mockAi';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  node: any;
  onUpdateNode: (id: string, data: any) => void;
  onDeleteNode: (id: string) => void;
}

export default function Sidebar({ node, onUpdateNode, onDeleteNode }: SidebarProps) {
  const [label, setLabel] = useState('');
  const [text, setText] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Sync state when selection changes
  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setText(node.data.text || '');
      setChoices(node.data.choices || []);
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;
    onUpdateNode(node.id, {
      ...node.data,
      label,
      text,
      choices
    });
    toast({
      title: "Node Updated",
      description: "Changes saved to the narrative graph.",
    });
  };

  const handleAiContinuation = async () => {
    setIsGenerating(true);
    try {
      const suggestion = await mockKieAi.generateContinuation(text);
      setText(prev => prev + (prev ? " " : "") + suggestion);
      toast({
        title: "AI Generated",
        description: "New narrative content added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiChoices = async () => {
    setIsGenerating(true);
    try {
      const newChoices = await mockKieAi.generateChoices(text);
      setChoices(prev => [...prev, ...newChoices]);
      toast({
        title: "AI Generated",
        description: `${newChoices.length} new choices added.`,
      });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate choices.",
            variant: "destructive"
        });
    } finally {
      setIsGenerating(false);
    }
  };

  const addChoice = () => {
    setChoices([...choices, 'New Choice']);
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const removeChoice = (index: number) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };

  if (!node) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Type className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="font-medium text-lg text-foreground mb-2">No Node Selected</h3>
        <p className="text-sm">Select a node from the graph to edit its properties or generate AI content.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Node Properties</h2>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">{node.id}</Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Identity Section */}
          <div className="space-y-3">
            <Label htmlFor="label">Node Title</Label>
            <Input 
              id="label" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              placeholder="e.g. The Old Tavern"
              className="bg-background"
            />
          </div>

          <Separator />

          {/* Narrative Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="text">Narrative Content</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleAiContinuation}
                disabled={isGenerating}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {isGenerating ? 'Thinking...' : 'Auto-Complete'}
              </Button>
            </div>
            <Textarea 
              id="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Write your story segment here..."
              className="min-h-[200px] font-serif bg-background leading-relaxed resize-y"
            />
          </div>

          <Separator />

          {/* Choices/Branching */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Branching Choices</Label>
              <div className="flex gap-1">
                 <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-primary hover:bg-primary/10"
                  onClick={handleAiChoices}
                  disabled={isGenerating}
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Suggest
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={addChoice}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted rounded-full text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                  <Input 
                    value={choice} 
                    onChange={(e) => updateChoice(index, e.target.value)}
                    className="flex-1 h-8 text-sm bg-background"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeChoice(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {choices.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-muted rounded-md">
                  <GitFork className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground">No branching choices defined.</p>
                  <p className="text-[10px] text-muted-foreground/70">This node will link directly to the next one.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-muted/30 space-y-2">
        <Button className="w-full" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDeleteNode(node.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
