import { useState, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowEditor from '@/components/editor/FlowEditor';
import Sidebar from '@/components/editor/Sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
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
      <Navigation title="Narrative Editor" showBackButton={true} backHref="/dashboard" showNavButtons={true} />

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
