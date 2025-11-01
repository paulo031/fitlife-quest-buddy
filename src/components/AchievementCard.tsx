import { Achievement } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
  const progressPercent = (achievement.progress / achievement.requirement) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`p-4 transition-all duration-300 ${
          achievement.unlocked
            ? 'bg-card hover:bg-card-hover gradient-achievement text-white'
            : 'bg-muted/30 hover:bg-muted/50'
        }`}
      >
        <div className="flex items-start gap-4">
          <motion.div
            className={`text-4xl ${achievement.unlocked ? 'animate-bounce-in' : 'opacity-40'}`}
            animate={achievement.unlocked ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {achievement.unlocked ? achievement.icon : <Lock className="h-10 w-10 text-muted-foreground" />}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold mb-1 ${!achievement.unlocked && 'text-muted-foreground'}`}>
              {achievement.title}
            </h3>
            <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-white/90' : 'text-muted-foreground'}`}>
              {achievement.description}
            </p>

            {!achievement.unlocked && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>{achievement.progress}/{achievement.requirement}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-white/80 mt-1">
                Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
