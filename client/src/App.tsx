import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import EditorPage from "@/pages/EditorPage";
import LandingPage from "@/pages/LandingPage";
import CharacterGeneratorPage from "@/pages/CharacterGeneratorPage";
import DashboardPage from "@/pages/DashboardPage";
import NarrativeStudioPage from "@/pages/NarrativeStudioPage";
import EnvironmentCreatorPage from "@/pages/EnvironmentCreatorPage";
import WikiPage from "@/pages/WikiPage";
import DimensionsPage from "@/pages/DimensionsPage";
import MediaHubPage from "@/pages/MediaHubPage";
import FilmsPage from "@/pages/FilmsPage";
import GamesPage from "@/pages/GamesPage";
import ShortsPage from "@/pages/ShortsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/media" component={MediaHubPage} />
      <Route path="/films" component={FilmsPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/shorts" component={ShortsPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/narrative-studio" component={NarrativeStudioPage} />
      <Route path="/editor" component={EditorPage} />
      <Route path="/characters" component={CharacterGeneratorPage} />
      <Route path="/environment-creator" component={EnvironmentCreatorPage} />
      <Route path="/wiki" component={WikiPage} />
      <Route path="/dimensions" component={DimensionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
