import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WeekProgress } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Challenge() {
  const [weekProgress] = useLocalStorage<WeekProgress[]>('fitlife-week-progress', []);

  const totalPoints = weekProgress.reduce((acc, week) => acc + week.points, 0);
  const completedWeeks = weekProgress.filter((w) => w.completed).length;
  const currentStreak = weekProgress.filter((w) => w.completed).length;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-achievement rounded-2xl p-6 text-white card-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Ranking Geral</p>
              <h2 className="text-3xl font-bold">{totalPoints} pts</h2>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🏆
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/80 text-xs">Semanas completas</p>
              <p className="text-xl font-bold">{completedWeeks}</p>
            </div>
            <div>
              <p className="text-white/80 text-xs">Sequência atual</p>
              <p className="text-xl font-bold">{currentStreak} 🔥</p>
            </div>
          </div>
        </motion.div>

        {/* Achievements Highlights */}
        {currentStreak >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔥</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">Sequência Incrível!</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStreak} semanas consecutivas completas!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Weekly History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Histórico Semanal</h2>
          </div>

          {weekProgress.length === 0 ? (
            <Card className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Complete sua primeira semana para ver seu histórico aqui!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {weekProgress.map((week, index) => (
                <motion.div
                  key={week.weekNumber}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-4 transition-all duration-300 hover:bg-card-hover ${
                    week.completed ? 'border-success border-2' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          week.completed ? 'gradient-success' : 'bg-muted'
                        }`}>
                          {week.completed ? (
                            <Trophy className="h-6 w-6 text-white" />
                          ) : (
                            <span className="font-bold text-muted-foreground">{week.weekNumber}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Semana {week.weekNumber}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(week.weekStart).toLocaleDateString('pt-BR')} -{' '}
                            {new Date(week.weekEnd).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge
                          className={week.completed ? 'bg-success text-white' : 'bg-muted'}
                        >
                          {week.completed ? (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Completa
                            </span>
                          ) : (
                            `${week.progress}%`
                          )}
                        </Badge>
                        <p className="text-sm font-bold text-primary mt-1">
                          +{week.points} pts
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 gradient-energetic text-white text-center">
            <p className="text-lg font-semibold mb-2">
              {totalPoints === 0
                ? '🎯 Comece sua jornada hoje!'
                : totalPoints >= 30
                ? '⭐ Você é um campeão fitness!'
                : '💪 Continue assim, está indo muito bem!'}
            </p>
            <p className="text-sm text-white/90">
              Cada semana completa vale 10 pontos. Continue acumulando conquistas!
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
