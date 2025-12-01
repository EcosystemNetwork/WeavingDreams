import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, GitBranch } from 'lucide-react';

export interface NarrativeNodeData {
  label: string;
  text: string;
  choices?: string[];
  isStart?: boolean;
  onSelect?: () => void;
}

const NarrativeNode = ({ data, selected }: NodeProps<NarrativeNodeData>) => {
  return (
    <Card 
      className={`w-[280px] border-2 transition-all duration-200 ${
        selected 
          ? 'border-primary shadow-[0_0_20px_rgba(124,58,237,0.3)]' 
          : 'border-muted hover:border-primary/50'
      } bg-card/95 backdrop-blur-sm`}
    >
      {!data.isStart && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!w-4 !h-4 !bg-muted-foreground !border-2 !border-background transition-colors hover:!bg-primary" 
        />
      )}
      
      <CardHeader className="p-3 pb-2 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={data.isStart ? "default" : "outline"} className="text-[10px] h-5 px-1.5 uppercase tracking-wider">
              {data.isStart ? "Start" : "Node"}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px]">
              ID: {Math.random().toString(36).substr(2, 4).toUpperCase()}
            </span>
          </div>
          {data.choices && data.choices.length > 0 && (
            <GitBranch className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
        <CardTitle className="text-sm font-bold mt-2 leading-tight">
          {data.label}
        </CardTitle>
      </CardHeader>
      
      <Separator className="bg-border/50" />
      
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground line-clamp-3 font-serif leading-relaxed">
          {data.text || <span className="italic opacity-50">Empty narrative node...</span>}
        </p>
        
        {data.choices && data.choices.length > 0 && (
          <div className="mt-3 space-y-1">
            {data.choices.map((choice, i) => (
              <div key={i} className="relative flex items-center justify-end">
                 <span className="text-[10px] text-right text-primary/80 mr-2 truncate max-w-[180px]">{choice}</span>
                 <Handle
                    type="source"
                    position={Position.Right}
                    id={`choice-${i}`}
                    style={{ top: '50%', right: '-14px', transform: 'translateY(-50%)' }}
                    className="!w-3 !h-3 !bg-primary !border-2 !border-background"
                 />
              </div>
            ))}
          </div>
        )}
        
        {(!data.choices || data.choices.length === 0) && (
           <Handle 
             type="source" 
             position={Position.Bottom} 
             className="!w-4 !h-4 !bg-muted-foreground !border-2 !border-background transition-colors hover:!bg-primary"
           />
        )}
      </CardContent>
    </Card>
  );
};

export default memo(NarrativeNode);
