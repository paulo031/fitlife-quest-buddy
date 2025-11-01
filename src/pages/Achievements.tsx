import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Achievement, WeekProgress, Workout } from '@/types/fitness';
import AchievementCard from '@/components/AchievementCard';
import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import ConfettiEffect from '@/components/ConfettiEffect';

const initialAchievements: Achievement[] = [
  {
    id: 'first_week',
    title: 'Primeira Semana',
    description: 'Complete sua primeira semana de treinos',
    icon: '🎯',
    unlocked: false,
    requirement: 1,
    progress: 0,
  },
  {
    id: 'three_weeks',
    title: 'Sequência de Fogo',
    description: 'Complete 3 semanas consecutivas',
    icon: '🔥',
    unlocked: false,
    requirement: 3,
    progress: 0,
  },
  {
    id: 'ten_workouts',
    title: 'Dedicação Total',
    description: 'Complete 10 treinos',
    icon: '💪',
    unlocked: false,
    requirement: 10,
    progress: 0,
  },
  {
    id: 'perfect_week',
    title: 'Semana Perfeita',
    description: 'Complete 100% dos treinos em uma semana',
    icon: '💯',
    unlocked: false,
    requirement: 1,
    progress: 0,
  },
  {
    id: 'fifty_points',
    title: 'Meio Século',
    description: 'Acumule 50 pontos',
    icon: '⭐',
    unlocked: false,
    requirement: 50,
    progress: 0,
  },
  {
    id: 'five_weeks',
    title: 'Mestre da Consistência',
    description: 'Complete 5 semanas',
    icon: '👑',
    unlocked: false,
    requirement: 5,
    progress: 0,
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('fitlife-achievements', initialAchievements);
  const [weekProgress] = useLocalStorage<WeekProgress[]>('fitlife-week-progress', []);
  const [workouts] = useLocalStorage<Workout[]>('fitlife-workouts', []);
  const [showConfetti, setShowConfetti] = useState(false);

  const completedWeeks = weekProgress.filter((w) => w.completed).length;
  const totalPoints = weekProgress.reduce((acc, w) => acc + w.points, 0);
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  useEffect(() => {
    let hasNewUnlock = false;
    const updated = achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let newProgress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_week':
          newProgress = completedWeeks;
          shouldUnlock = completedWeeks >= 1;
          break;
        case 'three_weeks':
          newProgress = completedWeeks;
          shouldUnlock = completedWeeks >= 3;
          break;
        case 'ten_workouts':
          newProgress = completedWorkouts;
          shouldUnlock = completedWorkouts >= 10;
          break;
        case 'perfect_week':
          const perfectWeeks = weekProgress.filter((w) => w.progress === 100).length;
          newProgress = perfectWeeks;
          shouldUnlock = perfectWeeks >= 1;
          break;
        case 'fifty_points':
          newProgress = totalPoints;
          shouldUnlock = totalPoints >= 50;
          break;
        case 'five_weeks':
          newProgress = completedWeeks;
          shouldUnlock = completedWeeks >= 5;
          break;
      }

      if (shouldUnlock && !achievement.unlocked) {
        hasNewUnlock = true;
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: newProgress,
        };
      }

      return { ...achievement, progress: newProgress };
    });

    if (hasNewUnlock) {
      setAchievements(updated);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (JSON.stringify(updated) !== JSON.stringify(achievements)) {
      setAchievements(updated);
    }
  }, [completedWeeks, totalPoints, completedWorkouts, weekProgress]);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <ConfettiEffect trigger={showConfetti} />
      
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-achievement rounded-2xl p-6 text-white card-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Suas Conquistas</p>
              <h2 className="text-3xl font-bold">{unlockedCount}/{achievements.length}</h2>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🏆
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm text-white/90 font-medium">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </span>
          </div>
        </motion.div>

        {/* Achievement Categories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Desbloqueadas</h2>
          </div>

          {unlockedCount === 0 ? (
            <Card className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Continue treinando para desbloquear suas primeiras conquistas!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {achievements
                .filter((a) => a.unlocked)
                .map((achievement, index) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                ))}
            </div>
          )}
        </div>

        {/* Locked Achievements */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">Em Progresso</h2>
          </div>

          <div className="space-y-3">
            {achievements
              .filter((a) => !a.unlocked)
              .map((achievement, index) => (
                <AchievementCard key={achievement.id} achievement={achievement} index={index} />
              ))}
          </div>
        </div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 gradient-primary text-white text-center">
            <p className="text-lg font-semibold mb-2">
              {unlockedCount === 0
                ? '🎯 Comece a desbloquear conquistas!'
                : unlockedCount === achievements.length
                ? '👑 Você desbloqueou tudo! Parabéns!'
                : '⭐ Continue assim, está indo muito bem!'}
            </p>
            <p className="text-sm text-white/90">
              Cada conquista é uma prova do seu comprometimento e dedicação.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
