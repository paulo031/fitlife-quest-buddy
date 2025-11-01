import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Workout, WeekProgress } from '@/types/fitness';
import WorkoutCard from '@/components/WorkoutCard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import workoutsData from '@/data/workouts.json';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import ConfettiEffect from '@/components/ConfettiEffect';

export default function Index() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitlife-workouts', workoutsData.workouts as Workout[]);
  const [weekProgress, setWeekProgress] = useLocalStorage<WeekProgress[]>('fitlife-week-progress', []);
  const [showConfetti, setShowConfetti] = useState(false);
  const { sendNotification } = useNotifications();

  const completedCount = workouts.filter((w) => w.completed).length;
  const progressPercent = (completedCount / workouts.length) * 100;
  const currentStreak = weekProgress.filter((w) => w.completed).length;

  const handleCompleteWorkout = (id: string) => {
    const updated = workouts.map((w) => (w.id === id ? { ...w, completed: true } : w));
    setWorkouts(updated);

    const newCompletedCount = updated.filter((w) => w.completed).length;
    const newProgressPercent = (newCompletedCount / updated.length) * 100;

    if (newProgressPercent === 100 && progressPercent < 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      sendNotification('🎉 Semana Completa!', {
        body: 'Parabéns! Você completou todos os treinos da semana!',
        tag: 'week-complete',
      });
    } else {
      sendNotification('💪 Treino Completo!', {
        body: 'Ótimo trabalho! Continue assim!',
        tag: 'workout-complete',
      });
    }
  };

  useEffect(() => {
    // Initialize current week if not exists
    if (weekProgress.length === 0) {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      setWeekProgress([
        {
          weekNumber: 1,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          completed: false,
          progress: 0,
          points: 0,
        },
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <ConfettiEffect trigger={showConfetti} />
      
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-energetic rounded-2xl p-6 text-white card-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Progresso Semanal</p>
                <h2 className="text-3xl font-bold">{completedCount}/{workouts.length}</h2>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
              >
                <Trophy className="h-8 w-8" />
              </motion.div>
            </div>
            <Progress value={progressPercent} className="h-3 bg-white/20" />
            <p className="text-white/90 text-sm mt-2">{Math.round(progressPercent)}% completo</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 text-center hover:bg-card-hover transition-all duration-300">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-destructive/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">Sequência</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 text-center hover:bg-card-hover transition-all duration-300">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-success/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{weekProgress.length}</p>
              <p className="text-xs text-muted-foreground">Semanas</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 text-center hover:bg-card-hover transition-all duration-300">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{weekProgress.reduce((acc, w) => acc + w.points, 0)}</p>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </Card>
          </motion.div>
        </div>

        {/* Workouts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Treinos da Semana</h2>
            <span className="text-sm text-muted-foreground">{completedCount} de {workouts.length}</span>
          </div>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} onComplete={handleCompleteWorkout} />
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 gradient-primary text-white text-center">
            <p className="text-lg font-semibold mb-2">
              {progressPercent === 100
                ? '🎉 Semana completa! Você é incrível!'
                : progressPercent >= 50
                ? '💪 Mais da metade! Continue forte!'
                : '🚀 Vamos lá! Todo treino conta!'}
            </p>
            <p className="text-sm text-white/90">
              {progressPercent === 100
                ? 'Descanse e prepare-se para a próxima semana!'
                : 'Cada passo te aproxima do seu objetivo.'}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
