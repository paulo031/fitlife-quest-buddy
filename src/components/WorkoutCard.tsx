import { Workout } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle2 } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onComplete: (id: string) => void;
}

export default function WorkoutCard({ workout, onComplete }: WorkoutCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-primary text-primary-foreground';
      case 'hard':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 transition-all duration-300 ${
        workout.completed ? 'bg-success/10 border-success' : 'hover:bg-card-hover'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">{workout.title}</h3>
              {workout.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{workout.duration} min</span>
              <span>•</span>
              <span className="capitalize">{workout.day}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {workout.category}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(workout.difficulty)}`}>
              <Zap className="h-3 w-3 mr-1" />
              {getDifficultyLabel(workout.difficulty)}
            </Badge>
          </div>

          <Button
            size="sm"
            onClick={() => onComplete(workout.id)}
            disabled={workout.completed}
            className={workout.completed ? 'gradient-success' : 'gradient-primary'}
          >
            {workout.completed ? 'Concluído' : 'Marcar'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
