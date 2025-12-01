import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'wouter';

const shorts = [
  {
    id: '1',
    title: 'The Last Choice',
    creator: 'Alex Rivera',
    description: 'A powerful moment of decision',
    duration: '4:32',
    views: '2.3M'
  },
  {
    id: '2',
    title: 'Neon Dreams',
    creator: 'Chris Wong',
    description: 'Cyberpunk aesthetic exploration',
    duration: '3:15',
    views: '1.8M'
  },
  {
    id: '3',
    title: 'Silent Conversation',
    creator: 'Elena Rossi',
    description: 'A story told without words',
    duration: '5:47',
    views: '945K'
  },
  {
    id: '4',
    title: 'Tomorrow Begins Now',
    creator: 'Sam Taylor',
    description: 'AI awakening moment',
    duration: '6:12',
    views: '1.2M'
  },
  {
    id: '5',
    title: 'Fractured Timeline',
    creator: 'Maya Patel',
    description: 'Exploring parallel realities',
    duration: '4:58',
    views: '856K'
  },
  {
    id: '6',
    title: 'Digital Hearts',
    creator: 'Jordan Chen',
    description: 'Connection in a virtual world',
    duration: '5:23',
    views: '1.5M'
  }
];

export default function ShortsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center gap-3">
        <Link href="/media">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-bold text-sm tracking-wide">Shortform Content</h1>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Stories in Motion</h2>
            <p className="text-muted-foreground">Bite-sized narratives and cinematic moments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shorts.map(short => (
              <Card key={short.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden group cursor-pointer">
                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-all">
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-bold line-clamp-1">{short.title}</h3>
                  <p className="text-xs text-muted-foreground">{short.creator}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{short.description}</p>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-muted-foreground">{short.duration}</span>
                    <span className="text-muted-foreground">{short.views} views</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
