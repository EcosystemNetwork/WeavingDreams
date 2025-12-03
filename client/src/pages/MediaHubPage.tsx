import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Film, Gamepad2, Video, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Navigation } from '@/components/Navigation';

export default function MediaHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Media Center" showBackButton={true} backHref="/" showNavButtons={true} />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4 py-12">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Explore Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred medium and dive into immersive narratives
            </p>
          </div>

          {/* Media Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Films */}
            <Link href="/films">
              <Card className="group border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer overflow-hidden h-full">
                <div className="relative p-8 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-primary/10 via-background to-background group-hover:from-primary/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all group-hover:scale-110">
                    <Film className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">Films</h3>
                  <p className="text-muted-foreground text-center text-sm mb-6">
                    Watch feature-length narratives and cinematic experiences
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Video Games */}
            <Link href="/games">
              <Card className="group border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer overflow-hidden h-full">
                <div className="relative p-8 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-primary/10 via-background to-background group-hover:from-primary/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all group-hover:scale-110">
                    <Gamepad2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">Video Games</h3>
                  <p className="text-muted-foreground text-center text-sm mb-6">
                    Play interactive narratives with branching storylines
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Shortform Content */}
            <Link href="/shorts">
              <Card className="group border-white/5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer overflow-hidden h-full">
                <div className="relative p-8 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-primary/10 via-background to-background group-hover:from-primary/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all group-hover:scale-110">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">Shortform</h3>
                  <p className="text-muted-foreground text-center text-sm mb-6">
                    Discover bite-sized stories and clips
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

          </div>

          {/* Quick Links */}
          <div className="border-t border-border/30 pt-12 space-y-6">
            <h3 className="text-lg font-bold">Navigate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Film className="w-4 h-4 mr-2" />
                  Create Narrative
                </Button>
              </Link>
              <Link href="/dimensions">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Fund Narratives
                </Button>
              </Link>
              <Link href="/wiki">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Story Wiki
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
