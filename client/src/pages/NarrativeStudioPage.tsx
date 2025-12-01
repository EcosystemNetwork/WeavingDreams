import { useState } from 'react';
import { useLocation } from 'wouter';
import { ReactFlowProvider } from 'reactflow';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Save, BookOpen, Users, MapPin, Box } from 'lucide-react';
import { Link } from 'wouter';
import FlowEditor from '@/components/editor/FlowEditor';
import Sidebar from '@/components/editor/Sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function NarrativeStudioContent() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const projectType = params.get('type') || 'film';
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('narrative');
  const [nodes, setNodes] = useState<any[]>([]);

  const handleUpdateNode = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedNode = { ...node, data: { ...node.data, ...data } };
          if (selectedNode && selectedNode.id === id) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setSelectedNode(null);
  };

  const projectTitle = projectType === 'game' ? 'Video Game' : 'Film/TV Series';

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm tracking-wide">Project: NEW_{projectTitle.toUpperCase()}</h1>
            <span className="text-[10px] text-muted-foreground font-mono">TYPE: {projectType.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-primary">Kie AI Online</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card/30 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b-0 h-auto p-0">
            <TabsTrigger value="narrative" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Narrative
            </TabsTrigger>
            <TabsTrigger value="characters" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Users className="w-4 h-4 mr-2" />
              Characters
            </TabsTrigger>
            <TabsTrigger value="environment" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <MapPin className="w-4 h-4 mr-2" />
              Environment
            </TabsTrigger>
            <TabsTrigger value="props" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Box className="w-4 h-4 mr-2" />
              Props
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'narrative' && (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75} minSize={50}>
              <FlowEditor 
                onNodeSelect={setSelectedNode} 
                onNodeUpdate={handleUpdateNode}
                onNodeDelete={handleDeleteNode}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <Sidebar 
                node={selectedNode} 
                onUpdateNode={handleUpdateNode} 
                onDeleteNode={handleDeleteNode}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {activeTab === 'characters' && (
          <div className="h-full flex items-center justify-center">
            <Link href="/characters">
              <Button size="lg" className="h-12 px-8">
                <Users className="w-5 h-5 mr-2" />
                Open Character Creator
              </Button>
            </Link>
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="h-full flex items-center justify-center">
            <Link href="/environment-creator">
              <Button size="lg" className="h-12 px-8">
                <MapPin className="w-5 h-5 mr-2" />
                Open Environment Creator
              </Button>
            </Link>
          </div>
        )}

        {activeTab === 'props' && (
          <div className="h-full flex items-center justify-center">
            <Link href="/props">
              <Button size="lg" className="h-12 px-8">
                <Box className="w-5 h-5 mr-2" />
                Open Prop Creator
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NarrativeStudioPage() {
  return (
    <ReactFlowProvider>
      <NarrativeStudioContent />
    </ReactFlowProvider>
  );
}
