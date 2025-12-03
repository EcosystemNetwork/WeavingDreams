import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/Navigation';
import { 
  Gift, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Users,
  MapPin,
  Box,
  Film,
  Loader2,
  Flame,
  Coins,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import type { CreditAccount, QuestTemplate, UserDailyQuest } from '@shared/schema';

interface DailyQuest extends UserDailyQuest {
  quest: QuestTemplate;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  MapPin,
  Box,
  Sparkles,
  Film,
};

export default function QuestsPage() {
  const queryClient = useQueryClient();

  const { data: creditAccount, isLoading: loadingCredits } = useQuery<CreditAccount>({
    queryKey: ['/api/credits'],
  });

  const { data: dailyQuests = [], isLoading: loadingQuests } = useQuery<DailyQuest[]>({
    queryKey: ['/api/quests/daily'],
  });

  const claimDailyLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/credits/daily-login');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      if (data.success) {
        toast.success(data.message);
      }
    },
    onError: (error: any) => {
      if (error.message?.includes('already claimed')) {
        toast.info('Daily reward already claimed today');
      } else {
        toast.error('Failed to claim daily reward');
      }
    },
  });

  const claimQuestRewardMutation = useMutation({
    mutationFn: async (questId: number) => {
      const response = await apiRequest('POST', `/api/quests/${questId}/claim`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quests/daily'] });
      toast.success('Quest reward claimed!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to claim reward');
    },
  });

  const canClaimDailyLogin = creditAccount && !creditAccount.lastDailyReward || 
    (creditAccount?.lastDailyReward && 
     new Date(creditAccount.lastDailyReward).toDateString() !== new Date().toDateString());

  const getQuestIcon = (iconName: string | null) => {
    const IconComponent = iconMap[iconName || 'Sparkles'] || Sparkles;
    return IconComponent;
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const isLoading = loadingCredits || loadingQuests;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation title="Daily Quests" showBackButton={true} backHref="/dashboard" showNavButtons={true} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Daily Login Reward */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Daily Login Reward</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Come back every day to build your streak!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {creditAccount?.loginStreak && creditAccount.loginStreak > 0 && (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          <Flame className="w-3 h-3 mr-1" />
                          {creditAccount.loginStreak} day streak
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400" />
                        <span className="font-bold text-base sm:text-lg text-amber-300">
                          10-40
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">credits</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        (more with longer streaks!)
                      </span>
                    </div>
                    <Button
                      onClick={() => claimDailyLoginMutation.mutate()}
                      disabled={!canClaimDailyLogin || claimDailyLoginMutation.isPending}
                      className={canClaimDailyLogin ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      {claimDailyLoginMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : canClaimDailyLogin ? (
                        <Gift className="w-4 h-4 mr-2" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {canClaimDailyLogin ? 'Claim Reward' : 'Claimed Today'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quest Reset Timer */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <span>Daily Quests</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Resets in {getTimeUntilReset()}</span>
                  <span className="sm:hidden">{getTimeUntilReset()}</span>
                </div>
              </div>

              {/* Daily Quests List */}
              <div className="grid gap-4">
                {dailyQuests.length === 0 ? (
                  <Card className="border-white/5">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No quests available right now. Check back later!</p>
                    </CardContent>
                  </Card>
                ) : (
                  dailyQuests.map((quest) => {
                    const IconComponent = getQuestIcon(quest.quest.icon);
                    const progressPercent = Math.min(
                      (quest.progress / quest.quest.requirement) * 100,
                      100
                    );
                    
                    return (
                      <Card 
                        key={quest.id} 
                        className={`border-white/5 transition-all ${
                          quest.isCompleted && !quest.isClaimed 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : quest.isClaimed 
                              ? 'opacity-60' 
                              : 'hover:border-primary/30'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              quest.isCompleted 
                                ? 'bg-green-500/20' 
                                : 'bg-primary/10'
                            }`}>
                              <IconComponent className={`w-5 sm:w-6 h-5 sm:h-6 ${
                                quest.isCompleted ? 'text-green-400' : 'text-primary'
                              }`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-1 sm:gap-2 mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-sm">{quest.quest.name}</h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {quest.quest.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <Coins className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400" />
                                  <span className="font-bold text-xs sm:text-sm text-amber-300">
                                    +{quest.quest.rewardCredits}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                <div className="flex-1 w-full">
                                  <Progress 
                                    value={progressPercent} 
                                    className="h-2"
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground min-w-[50px] sm:min-w-[60px] text-right">
                                  {quest.progress}/{quest.quest.requirement}
                                </span>
                                
                                {quest.isCompleted && !quest.isClaimed && (
                                  <Button
                                    size="sm"
                                    onClick={() => claimQuestRewardMutation.mutate(quest.id)}
                                    disabled={claimQuestRewardMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {claimQuestRewardMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      'Claim'
                                    )}
                                  </Button>
                                )}
                                
                                {quest.isClaimed && (
                                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Done
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Stats Summary */}
              <Card className="border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        {creditAccount?.balance ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-green-400">
                        {creditAccount?.totalEarned ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-400">
                        {creditAccount?.totalSpent ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
