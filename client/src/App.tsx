import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import EditorPage from "@/pages/EditorPage";
import LandingPage from "@/pages/LandingPage";
import CharacterGeneratorPage from "@/pages/CharacterGeneratorPage";
import DashboardPage from "@/pages/DashboardPage";
import NarrativeStudioPage from "@/pages/NarrativeStudioPage";
import EnvironmentCreatorPage from "@/pages/EnvironmentCreatorPage";
import PropCreatorPage from "@/pages/PropCreatorPage";
import WikiPage from "@/pages/WikiPage";
import HistoryPage from "@/pages/HistoryPage";
import QuestsPage from "@/pages/QuestsPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import DimensionsPage from "@/pages/DimensionsPage";
import MediaHubPage from "@/pages/MediaHubPage";
import FilmsPage from "@/pages/FilmsPage";
import GamesPage from "@/pages/GamesPage";
import ShortsPage from "@/pages/ShortsPage";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {isAuthenticated ? <DashboardPage /> : <LandingPage />}
      </Route>
      <Route path="/media" component={MediaHubPage} />
      <Route path="/films" component={FilmsPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/shorts" component={ShortsPage} />
      <Route path="/dimensions" component={DimensionsPage} />

      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardPage} />
      </Route>
      <Route path="/narrative-studio">
        <ProtectedRoute component={NarrativeStudioPage} />
      </Route>
      <Route path="/editor">
        <ProtectedRoute component={EditorPage} />
      </Route>
      <Route path="/characters">
        <ProtectedRoute component={CharacterGeneratorPage} />
      </Route>
      <Route path="/environment-creator">
        <ProtectedRoute component={EnvironmentCreatorPage} />
      </Route>
      <Route path="/props">
        <ProtectedRoute component={PropCreatorPage} />
      </Route>
      <Route path="/wiki">
        <ProtectedRoute component={WikiPage} />
      </Route>
      <Route path="/history">
        <ProtectedRoute component={HistoryPage} />
      </Route>
      <Route path="/quests">
        <ProtectedRoute component={QuestsPage} />
      </Route>
      <Route path="/leaderboard">
        <ProtectedRoute component={LeaderboardPage} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster position="top-right" />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
