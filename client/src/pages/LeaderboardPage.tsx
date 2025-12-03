import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Trophy, Flame, Coins } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { CreditAccount } from '@shared/schema';

interface LeaderboardEntry extends CreditAccount {
  user?: { firstName: string | null; lastName: string | null; email: string | null };
}

const getRankBadge = (rank: number) => {
  if (rank === 1) return { label: '🥇 1st', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (rank === 2) return { label: '🥈 2nd', color: 'bg-slate-400/20 text-slate-300 border-slate-400/30' };
  if (rank === 3) return { label: '🥉 3rd', color: 'bg-orange-600/20 text-orange-400 border-orange-600/30' };
  return { label: `#${rank}`, color: 'bg-primary/10 text-primary border-primary/20' };
};

export default function LeaderboardPage() {
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Global Leaderboard" showBackButton={true} backHref="/dashboard" showNavButtons={true} />

      <div className="flex-1 flex flex-col p-4 sm:p-8">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {/* Top 3 Showcase */}
          {leaderboard.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(0, 3).map((entry, index) => {
                const rank = index + 1;
                const badge = getRankBadge(rank);
                const initials = (entry.user?.firstName?.[0] || '') + (entry.user?.lastName?.[0] || '');
                return (
                  <Card key={entry.userId} className="border-white/10 hover:border-primary/30 transition-all">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <Badge className={badge.color}>{badge.label}</Badge>
                        <Avatar className="w-16 h-16 mx-auto">
                          <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-lg">
                            {entry.user?.firstName} {entry.user?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{entry.user?.email}</div>
                        </div>
                        <div className="pt-2 border-t border-white/10 space-y-1">
                          <div className="flex items-center justify-center gap-2 text-amber-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{entry.totalEarned}</span>
                          </div>
                          {entry.loginStreak > 1 && (
                            <div className="flex items-center justify-center gap-1 text-orange-400">
                              <Flame className="w-3 h-3" />
                              <span className="text-xs">{entry.loginStreak} day streak</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users yet</div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const initials = (entry.user?.firstName?.[0] || '') + (entry.user?.lastName?.[0] || '');
                    return (
                      <div
                        key={entry.userId}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
                          <div className="w-8 text-center">
                            {rank === 1 ? (
                              <span className="text-xl sm:text-2xl">🥇</span>
                            ) : rank === 2 ? (
                              <span className="text-xl sm:text-2xl">🥈</span>
                            ) : rank === 3 ? (
                              <span className="text-xl sm:text-2xl">🥉</span>
                            ) : (
                              <span className="font-bold text-primary text-sm sm:text-base">#{rank}</span>
                            )}
                          </div>
                          <Avatar className="w-8 sm:w-10 h-8 sm:h-10">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs sm:text-sm font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">
                              {entry.user?.firstName} {entry.user?.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{entry.user?.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm self-start sm:self-auto">
                          {entry.loginStreak > 1 && (
                            <div className="flex items-center gap-1 text-orange-400">
                              <Flame className="w-3 sm:w-4 h-3 sm:h-4" />
                              <span>{entry.loginStreak}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-amber-400 font-bold">
                            <Coins className="w-3 sm:w-4 h-3 sm:h-4" />
                            {entry.totalEarned}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
