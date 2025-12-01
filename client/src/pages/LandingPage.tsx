import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, Cpu, Network, Sparkles } from 'lucide-react';
import generatedImage from '@assets/generated_images/dark_abstract_network_of_glowing_nodes_and_lines.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={generatedImage} 
            alt="Neural Network Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container px-4 text-center space-y-8 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wider">POWERED BY KIE AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/50 drop-shadow-2xl">
            Weaving Dreams
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            Craft complex, non-linear stories with the assistance of advanced AI. 
            Visualize branching paths, generate plot twists, and weave your masterpiece.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8 mb-32 flex-wrap">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105">
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dimensions">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10">
                <Sparkles className="mr-2 w-5 h-5" />
                Dimensions Fund
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 bg-card border-t border-border/50 py-20">
        <div className="container px-4 mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visual Branching</h3>
            <p className="text-muted-foreground">Map out complex storylines with an intuitive node-based editor.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Co-Pilot</h3>
            <p className="text-muted-foreground">Generate continuations, dialogue options, and plot twists on demand.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Play Testing</h3>
            <p className="text-muted-foreground">Preview your story interactively to ensure every path flows perfectly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
