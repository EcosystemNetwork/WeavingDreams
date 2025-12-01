import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Film, Gamepad2, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-sm tracking-wide">Dashboard</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Recent Projects */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Projects</h2>
              <p className="text-muted-foreground">Continue working on your narratives</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Lost in Time</span>
                    <Film className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="outline" className="text-xs">Film</Badge>
                  <p className="text-xs text-muted-foreground">A sci-fi thriller about temporal paradoxes</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Last edited 2 days ago</p>
                </CardContent>
              </Card>

              <Card className="border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Realm's Edge</span>
                    <Gamepad2 className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="outline" className="text-xs">Video Game</Badge>
                  <p className="text-xs text-muted-foreground">Open-world fantasy RPG with branching quests</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Last edited 1 week ago</p>
                </CardContent>
              </Card>

              <Card className="border-white/5 border-dashed hover:border-primary/30 transition-all cursor-pointer group flex items-center justify-center min-h-[150px]">
                <div className="text-center space-y-2">
                  <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mx-auto" />
                  <p className="text-sm font-medium">New Project</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Create New */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create New Narrative</h2>
              <p className="text-muted-foreground">Start a new creative project</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/narrative-studio?type=film">
                <Card className="border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer h-full group">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Film className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      Film/TV Series
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Create screenplays, scenes, and dialogue for visual storytelling</p>
                    <div className="pt-4">
                      <Button size="sm" variant="secondary" className="w-full">
                        Start Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/narrative-studio?type=game">
                <Card className="border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer h-full group">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gamepad2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      Video Game
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">Build interactive narratives with branching dialogue and choices</p>
                    <div className="pt-4">
                      <Button size="sm" variant="secondary" className="w-full">
                        Start Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
