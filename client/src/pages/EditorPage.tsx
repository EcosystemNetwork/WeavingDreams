import { useState, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowEditor from '@/components/editor/FlowEditor';
import Sidebar from '@/components/editor/Sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// Wrapper component to handle Flow state updates from Sidebar
function EditorContent() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  const handleUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // Update locally selected node as well
          const updatedNode = { ...node, data: { ...node.data, ...data } };
          if (selectedNode && selectedNode.id === id) {
             setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setSelectedNode(null);
  }, [setNodes]);

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
             <h1 className="font-bold text-sm tracking-wide">Project: UNTITLED_NARRATIVE_01</h1>
             <span className="text-[10px] text-muted-foreground font-mono">LAST SAVED: JUST NOW</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-primary">Kie AI Online</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
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
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}
