import { Friend } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Flame } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
  rank: number;
  isUser?: boolean;
}

export default function FriendCard({ friend, rank, isUser = false }: FriendCardProps) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}º`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <Card className={`p-4 transition-all duration-300 hover:bg-card-hover ${
        isUser ? 'border-primary border-2 glow-primary' : ''
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mb-1">{getMedalEmoji(rank)}</span>
            {rank <= 3 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs"
              >
                ⭐
              </motion.div>
            )}
          </div>

          <Avatar className="h-12 w-12">
            <AvatarFallback className="gradient-primary text-white font-semibold">
              {friend.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {friend.name}
                {isUser && <span className="text-primary ml-1">(Você)</span>}
              </h3>
              {friend.streak > 0 && (
                <div className="flex items-center gap-1 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                  <Flame className="h-3 w-3" />
                  <span>{friend.streak}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso semanal</span>
                <span>{friend.weeklyProgress}%</span>
              </div>
              <Progress value={friend.weeklyProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {friend.totalPoints} pontos totais
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
