import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const films = [
  {
    id: '1',
    title: 'Lost in Time',
    director: 'Alex Rivera',
    description: 'A sci-fi thriller about temporal paradoxes',
    duration: '1h 52m',
    rating: '8.5/10'
  },
  {
    id: '2',
    title: 'The Divide',
    director: 'Maya Patel',
    description: 'Political thriller with multiple endings',
    duration: '2h 14m',
    rating: '8.1/10'
  },
  {
    id: '3',
    title: 'Forgotten Light',
    director: 'Elena Rossi',
    description: 'Historical drama spanning three decades',
    duration: '1h 58m',
    rating: '8.8/10'
  }
];

export default function FilmsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Films & Series" showBackButton={true} backHref="/media" showNavButtons={true} />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Films</h2>
            <p className="text-muted-foreground">Cinematic narratives and series</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {films.map(film => (
              <Card key={film.id} className="border-white/5 hover:border-primary/30 transition-all overflow-hidden group cursor-pointer">
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="opacity-0 group-hover:opacity-100 transition-all">
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">{film.title}</h3>
                  <p className="text-sm text-muted-foreground">{film.director}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{film.description}</p>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Badge variant="outline">{film.duration}</Badge>
                    <span className="text-primary font-semibold">{film.rating}</span>
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
