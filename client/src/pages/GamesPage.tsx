import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Link } from 'wouter';

const games = [
  {
    id: '1',
    title: 'Realm\'s Edge',
    developer: 'Jordan Chen',
    description: 'Open-world fantasy RPG with branching quests',
    genre: 'RPG',
    rating: '9.2/10'
  },
  {
    id: '2',
    title: 'Echoes of Tomorrow',
    developer: 'Sam Taylor',
    description: 'Interactive drama exploring AI consciousness',
    genre: 'Adventure',
    rating: '8.7/10'
  },
  {
    id: '3',
    title: 'Neon Shadows',
    developer: 'Chris Wong',
    description: 'Cyberpunk adventure with choice-driven gameplay',
    genre: 'Action',
    rating: '8.9/10'
  }
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center gap-3">
        <Link href="/media">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-bold text-sm tracking-wide">Video Games</h1>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Interactive Narratives</h2>
            <p className="text-muted-foreground">Play through branching storylines and choice-driven adventures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map(game => (
              <Card key={game.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden group cursor-pointer">
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-all">
                      <Gamepad2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.developer}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Badge variant="outline">{game.genre}</Badge>
                    <span className="text-primary font-semibold">{game.rating}</span>
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
