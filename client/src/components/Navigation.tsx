import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Coins, Gift, Clock, BookOpen, Trophy, User, LogOut, Flame } from 'lucide-react';
import type { CreditAccount } from '@shared/schema';

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  showNavButtons?: boolean;
}

export function Navigation({ 
  title, 
  showBackButton = true, 
  backHref = "/dashboard",
  showNavButtons = true 
}: NavigationProps) {
  const { user } = useAuth();

  const { data: creditAccount } = useQuery<CreditAccount>({
    queryKey: ['/api/credits'],
  });

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between overflow-x-auto sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <h1 className="font-bold text-xs sm:text-sm tracking-wide flex-shrink-0">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {showNavButtons && (
          <>
            <Link href="/leaderboard">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary hidden sm:inline-flex" data-testid="button-leaderboard">
                <Trophy className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/quests">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary hidden sm:inline-flex" data-testid="button-quests">
                <Gift className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary hidden sm:inline-flex" data-testid="button-history">
                <Clock className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/wiki">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary hidden sm:inline-flex" data-testid="button-wiki">
                <BookOpen className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary hidden sm:inline-flex" data-testid="button-profile">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}

        {/* Credit Balance - Mobile optimized */}
        <Link href="/quests">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-500/30 hover:border-amber-500/50 transition-colors cursor-pointer flex-shrink-0" data-testid="display-credits">
            <Coins className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400" />
            <span className="font-bold text-amber-300 text-xs sm:text-sm">
              {creditAccount?.balance ?? '...'}
            </span>
            {creditAccount?.loginStreak && creditAccount.loginStreak > 1 && (
              <div className="hidden sm:flex items-center gap-1 text-orange-400">
                <Flame className="w-3 h-3" />
                <span className="text-xs">{creditAccount.loginStreak}</span>
              </div>
            )}
          </div>
        </Link>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 ml-2 pl-2 sm:pl-4 border-l border-border flex-shrink-0">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {user?.firstName?.[0] || user?.email?.[0] || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <a href="/api/logout" data-testid="link-logout">
            <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
