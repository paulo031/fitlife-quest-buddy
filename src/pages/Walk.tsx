import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Walk, WalkGoal, Achievement } from '@/types/fitness';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, MapPin, TrendingUp, Award, Target, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import WalkMap from '@/components/WalkMap';
import WalkStats from '@/components/WalkStats';
import WalkHistory from '@/components/WalkHistory';
import ConfettiEffect from '@/components/ConfettiEffect';
import { toast } from 'sonner';

export default function WalkPage() {
  const [walks, setWalks] = useLocalStorage<Walk[]>('fitlife-walks', []);
  const [goals, setGoals] = useLocalStorage<WalkGoal>('fitlife-walk-goals', {
    type: 'distance',
    dailyTarget: 5,
    weeklyTarget: 30,
    dailyProgress: 0,
    weeklyProgress: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('fitlife-achievements', []);
  
  const [isWalking, setIsWalking] = useState(false);
  const [currentWalk, setCurrentWalk] = useState<{
    startTime: number;
    duration: number;
    distance: number;
    route: [number, number][];
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const routeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simular coordenadas iniciais (centro de São Paulo como exemplo)
  const initialCoords: [number, number] = [-23.5505, -46.6333];

  // Iniciar caminhada
  const startWalk = () => {
    const now = Date.now();
    setCurrentWalk({
      startTime: now,
      duration: 0,
      distance: 0,
      route: [initialCoords],
    });
    setIsWalking(true);
    toast.success('Caminhada iniciada! Boa sorte! 🚶‍♂️');

    // Atualizar tempo a cada segundo
    intervalRef.current = setInterval(() => {
      setCurrentWalk((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime) / 1000),
        };
      });
    }, 1000);

    // Simular movimento no mapa (adicionar pontos aleatórios)
    routeIntervalRef.current = setInterval(() => {
      setCurrentWalk((prev) => {
        if (!prev) return prev;
        
        const lastPoint = prev.route[prev.route.length - 1];
        const newPoint: [number, number] = [
          lastPoint[0] + (Math.random() - 0.5) * 0.002,
          lastPoint[1] + (Math.random() - 0.5) * 0.002,
        ];
        
        // Calcular distância incremental (aproximadamente 50-100m por intervalo)
        const distanceIncrement = (Math.random() * 0.05 + 0.05); // 0.05 a 0.1 km
        
        return {
          ...prev,
          route: [...prev.route, newPoint],
          distance: prev.distance + distanceIncrement,
        };
      });
    }, 3000);
  };

  // Encerrar caminhada
  const endWalk = () => {
    if (!currentWalk) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (routeIntervalRef.current) clearInterval(routeIntervalRef.current);

    const avgSpeed = currentWalk.duration > 0 
      ? (currentWalk.distance / (currentWalk.duration / 3600)) 
      : 0;
    
    const calories = Math.round(currentWalk.distance * 65); // Estimativa: ~65 cal/km

    const newWalk: Walk = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: currentWalk.duration,
      distance: parseFloat(currentWalk.distance.toFixed(2)),
      calories,
      avgSpeed: parseFloat(avgSpeed.toFixed(2)),
      route: currentWalk.route,
    };

    setWalks([newWalk, ...walks]);
    updateGoals(newWalk);
    checkAchievements(newWalk);
    
    setIsWalking(false);
    setCurrentWalk(null);
    
    toast.success(`Caminhada concluída! ${newWalk.distance.toFixed(2)}km percorridos 🎉`);
  };

  // Atualizar progresso das metas
  const updateGoals = (walk: Walk) => {
    const today = new Date().toDateString();
    const lastUpdate = new Date(goals.lastUpdated).toDateString();
    
    let newDailyProgress = goals.dailyProgress;
    let newWeeklyProgress = goals.weeklyProgress;

    if (today !== lastUpdate) {
      // Novo dia, resetar progresso diário
      newDailyProgress = 0;
    }

    if (goals.type === 'distance') {
      newDailyProgress += walk.distance;
      newWeeklyProgress += walk.distance;
    } else {
      newDailyProgress += walk.duration / 60;
      newWeeklyProgress += walk.duration / 60;
    }

    setGoals({
      ...goals,
      dailyProgress: newDailyProgress,
      weeklyProgress: newWeeklyProgress,
      lastUpdated: new Date().toISOString(),
    });

    // Verificar se atingiu meta diária
    if (newDailyProgress >= goals.dailyTarget && goals.dailyProgress < goals.dailyTarget) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success('🎯 Meta diária atingida! Parabéns!');
    }
  };

  // Verificar e desbloquear conquistas
  const checkAchievements = (walk: Walk) => {
    const totalWalks = walks.length + 1;
    const totalDistance = walks.reduce((acc, w) => acc + w.distance, 0) + walk.distance;
    
    const walkAchievements = [
      {
        id: 'first_walk',
        title: 'Primeira Caminhada',
        description: 'Complete sua primeira caminhada',
        icon: '🏁',
        requirement: 1,
        progress: totalWalks,
      },
      {
        id: 'five_walks_streak',
        title: '5 Dias Seguidos',
        description: 'Caminhe por 5 dias consecutivos',
        icon: '🔥',
        requirement: 5,
        progress: calculateStreak(),
      },
      {
        id: 'twenty_km',
        title: '20km Conquistados',
        description: 'Percorra 20km no total',
        icon: '🥇',
        requirement: 20,
        progress: Math.floor(totalDistance),
      },
    ];

    let hasNewUnlock = false;
    const updated = [...achievements];

    walkAchievements.forEach((newAch) => {
      const existingIndex = updated.findIndex((a) => a.id === newAch.id);
      
      if (existingIndex === -1) {
        // Adicionar nova conquista
        updated.push({
          ...newAch,
          unlocked: newAch.progress >= newAch.requirement,
          unlockedAt: newAch.progress >= newAch.requirement ? new Date().toISOString() : undefined,
        });
        
        if (newAch.progress >= newAch.requirement) {
          hasNewUnlock = true;
          toast.success(`🏆 Conquista desbloqueada: ${newAch.title}!`);
        }
      } else {
        // Atualizar conquista existente
        if (!updated[existingIndex].unlocked && newAch.progress >= newAch.requirement) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            progress: newAch.progress,
          };
          hasNewUnlock = true;
          toast.success(`🏆 Conquista desbloqueada: ${newAch.title}!`);
        } else {
          updated[existingIndex].progress = newAch.progress;
        }
      }
    });

    if (hasNewUnlock || JSON.stringify(updated) !== JSON.stringify(achievements)) {
      setAchievements(updated);
      if (hasNewUnlock) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  // Calcular sequência de dias consecutivos
  const calculateStreak = () => {
    if (walks.length === 0) return 0;
    
    const dates = walks.map((w) => new Date(w.date).toDateString());
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (routeIntervalRef.current) clearInterval(routeIntervalRef.current);
    };
  }, []);

  const dailyPercentage = Math.min((goals.dailyProgress / goals.dailyTarget) * 100, 100);
  const weeklyPercentage = Math.min((goals.weeklyProgress / goals.weeklyTarget) * 100, 100);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <ConfettiEffect trigger={showConfetti} />
      
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-energetic rounded-2xl p-6 text-white card-shadow glow-pink relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Modo Caminhada</h1>
                <p className="text-white/90 text-sm">
                  {isWalking ? 'Em andamento...' : 'Pronto para começar?'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metas Diárias e Semanais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Metas</h3>
            </div>

            {/* Meta Diária */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meta Diária</span>
                <span className="text-sm font-medium text-foreground">
                  {goals.dailyProgress.toFixed(1)}/{goals.dailyTarget} {goals.type === 'distance' ? 'km' : 'min'}
                </span>
              </div>
              <Progress value={dailyPercentage} className="h-2" />
              {dailyPercentage >= 100 && (
                <p className="text-xs text-success mt-1 font-medium">✓ Meta diária concluída!</p>
              )}
            </div>

            {/* Meta Semanal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Meta Semanal</span>
                <span className="text-sm font-medium text-foreground">
                  {goals.weeklyProgress.toFixed(1)}/{goals.weeklyTarget} {goals.type === 'distance' ? 'km' : 'min'}
                </span>
              </div>
              <Progress value={weeklyPercentage} className="h-2" />
            </div>
          </Card>
        </motion.div>

        {/* Mapa e Controles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 space-y-4">
            <WalkMap 
              route={currentWalk?.route || [initialCoords]} 
              isActive={isWalking}
            />

            {/* Métricas em Tempo Real */}
            <AnimatePresence>
              {isWalking && currentWalk && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Tempo</p>
                    <p className="text-sm font-bold text-foreground">
                      {Math.floor(currentWalk.duration / 60)}:{(currentWalk.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-5 w-5 text-success mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Distância</p>
                    <p className="text-sm font-bold text-foreground">
                      {currentWalk.distance.toFixed(2)} km
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-5 w-5 text-yellow mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Calorias</p>
                    <p className="text-sm font-bold text-foreground">
                      {Math.round(currentWalk.distance * 65)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões de Controle */}
            <div className="flex gap-3">
              {!isWalking ? (
                <Button
                  onClick={startWalk}
                  className="flex-1 gradient-primary text-white glow-primary"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Caminhada
                </Button>
              ) : (
                <Button
                  onClick={endWalk}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Encerrar Caminhada
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Estatísticas */}
        <WalkStats walks={walks} />

        {/* Histórico */}
        <WalkHistory walks={walks} />
      </div>
    </div>
  );
}
