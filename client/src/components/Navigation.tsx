import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { 
  ArrowLeft, 
  Coins, 
  Gift, 
  Clock, 
  BookOpen, 
  Trophy, 
  User, 
  LogOut, 
  Flame,
  Play,
  Sparkles,
  Layers,
  Menu
} from 'lucide-react';
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
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const { data: creditAccount } = useQuery<CreditAccount>({
    queryKey: ['/api/credits'],
    enabled: isAuthenticated,
  });

  const isActive = (path: string) => location === path;

  const publicNavItems = [
    { href: '/media', icon: Play, label: 'Media', testId: 'button-media' },
    { href: '/dimensions', icon: Layers, label: 'Dimensions', testId: 'button-dimensions' },
  ];

  const protectedNavItems = [
    { href: '/narrative-studio', icon: Sparkles, label: 'Create', testId: 'button-create' },
  ];

  const userNavItems = [
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard', testId: 'button-leaderboard' },
    { href: '/quests', icon: Gift, label: 'Quests', testId: 'button-quests' },
    { href: '/history', icon: Clock, label: 'History', testId: 'button-history' },
    { href: '/wiki', icon: BookOpen, label: 'Wiki', testId: 'button-wiki' },
    { href: '/profile', icon: User, label: 'Profile', testId: 'button-profile' },
  ];

  const mainNavItems = isAuthenticated 
    ? [...publicNavItems, ...protectedNavItems]
    : publicNavItems;

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <h1 className="font-bold text-xs sm:text-sm tracking-wide flex-shrink-0 max-w-[120px] sm:max-w-none truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {showNavButtons && (
          <>
            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1 mr-2 pr-2 border-r border-border">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`hover:bg-primary/10 hover:text-primary gap-1.5 ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                    data-testid={item.testId}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Navigation - Desktop (only when authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {userNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`hover:bg-primary/10 hover:text-primary ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                      data-testid={item.testId}
                    >
                      <item.icon className="w-4 h-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-primary/10 hover:text-primary"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetTitle className="text-left mb-6">Navigation</SheetTitle>
                <nav className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">Browse</div>
                  {publicNavItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href}>
                        <Button 
                          variant="ghost" 
                          className={`w-full justify-start gap-3 h-11 ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                          data-testid={`mobile-${item.testId}`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    </SheetClose>
                  ))}

                  {isAuthenticated && (
                    <>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-3">Create</div>
                      {protectedNavItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link href={item.href}>
                            <Button 
                              variant="ghost" 
                              className={`w-full justify-start gap-3 h-11 ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                              data-testid={`mobile-${item.testId}`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </Button>
                          </Link>
                        </SheetClose>
                      ))}

                      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-3">Account</div>
                      {userNavItems.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link href={item.href}>
                            <Button 
                              variant="ghost" 
                              className={`w-full justify-start gap-3 h-11 ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}
                              data-testid={`mobile-${item.testId}`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </Button>
                          </Link>
                        </SheetClose>
                      ))}

                      <div className="pt-4 border-t border-border mt-4">
                        <a href="/api/logout" className="block">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 h-11 text-destructive hover:bg-destructive/10"
                            data-testid="mobile-link-logout"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                          </Button>
                        </a>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </>
        )}

        {/* Credit Balance (only when authenticated) */}
        {isAuthenticated && (
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
        )}

        {/* User Profile & Logout (only when authenticated) */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 ml-2 pl-2 sm:pl-4 border-l border-border flex-shrink-0">
            <Link href="/profile">
              <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarImage src={user.profileImageUrl || ''} alt={user.firstName || 'User'} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user.firstName?.[0] || user.email?.[0] || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>
            <a href="/api/logout" data-testid="link-logout">
              <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive hidden sm:inline-flex">
                <LogOut className="w-4 h-4" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
