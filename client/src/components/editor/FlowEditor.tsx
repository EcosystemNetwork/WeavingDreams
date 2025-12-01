import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Panel
} from 'reactflow';
import NarrativeNode from './NarrativeNode';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download } from 'lucide-react';

const nodeTypes = {
  narrative: NarrativeNode,
};

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'narrative', 
    position: { x: 250, y: 100 }, 
    data: { 
      label: 'The Beginning', 
      text: 'It was a dark and stormy night. The rain lashed against the windowpane like angry spirits seeking entry.', 
      isStart: true,
      choices: ['Investigate the noise', 'Go back to sleep'] 
    } 
  },
];

interface FlowEditorProps {
  onNodeSelect: (node: Node | null) => void;
}

export default function FlowEditor({ onNodeSelect }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    onNodeSelect(nodes[0] || null);
  }, [onNodeSelect]);

  const addNode = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNode: Node = {
      id,
      type: 'narrative',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: { 
        label: 'New Scene', 
        text: '',
        choices: [] 
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="w-full h-full bg-background/50" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background/50"
      >
        <Background color="#4b5563" gap={20} size={1} />
        <Controls className="!bg-card !border-border !shadow-xl" />
        <MiniMap 
          nodeColor="#7c3aed" 
          maskColor="rgba(0, 0, 0, 0.6)"
          className="!bg-card !border-border !rounded-lg overflow-hidden"
        />
        
        <Panel position="top-left" className="m-4">
          <div className="flex gap-2">
            <Button onClick={addNode} className="shadow-lg hover:shadow-primary/20 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Scene
            </Button>
            <Button variant="secondary" className="shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              Save Graph
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
