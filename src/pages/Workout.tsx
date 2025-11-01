import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 'perna', name: 'Perna', icon: '🦵' },
  { id: 'braco', name: 'Braço', icon: '💪' },
  { id: 'peitoral', name: 'Peitoral', icon: '🫀' },
  { id: 'costas', name: 'Costas', icon: '🔙' },
  { id: 'abdomen', name: 'Abdômen', icon: '🎯' },
  { id: 'cardio', name: 'Cardio', icon: '❤️' },
];

const workoutsByCategory: Record<string, any[]> = {
  perna: [
    { id: 1, name: 'Agachamento', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 2, name: 'Leg Press', sets: 3, reps: 15, difficulty: 'medium' },
    { id: 3, name: 'Stiff', sets: 3, reps: 10, difficulty: 'hard' },
    { id: 4, name: 'Panturrilha', sets: 4, reps: 20, difficulty: 'easy' },
  ],
  braco: [
    { id: 5, name: 'Rosca Direta', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 6, name: 'Tríceps Testa', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 7, name: 'Rosca Martelo', sets: 3, reps: 10, difficulty: 'medium' },
    { id: 8, name: 'Tríceps Corda', sets: 3, reps: 15, difficulty: 'easy' },
  ],
  peitoral: [
    { id: 9, name: 'Supino Reto', sets: 4, reps: 10, difficulty: 'hard' },
    { id: 10, name: 'Supino Inclinado', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 11, name: 'Crucifixo', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 12, name: 'Flexão', sets: 3, reps: 20, difficulty: 'easy' },
  ],
  costas: [
    { id: 13, name: 'Barra Fixa', sets: 3, reps: 10, difficulty: 'hard' },
    { id: 14, name: 'Remada Curvada', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 15, name: 'Puxada Frontal', sets: 3, reps: 12, difficulty: 'medium' },
    { id: 16, name: 'Remada Baixa', sets: 3, reps: 15, difficulty: 'easy' },
  ],
  abdomen: [
    { id: 17, name: 'Abdominal Crunch', sets: 3, reps: 20, difficulty: 'easy' },
    { id: 18, name: 'Prancha', sets: 3, reps: 60, difficulty: 'medium' },
    { id: 19, name: 'Abdominal Bicicleta', sets: 3, reps: 30, difficulty: 'medium' },
    { id: 20, name: 'Elevação de Pernas', sets: 3, reps: 15, difficulty: 'hard' },
  ],
  cardio: [
    { id: 21, name: 'Corrida', sets: 1, reps: 30, difficulty: 'medium' },
    { id: 22, name: 'Pular Corda', sets: 3, reps: 60, difficulty: 'hard' },
    { id: 23, name: 'Burpees', sets: 3, reps: 15, difficulty: 'hard' },
    { id: 24, name: 'Polichinelo', sets: 3, reps: 30, difficulty: 'easy' },
  ],
};

const difficultyColors = {
  easy: 'bg-success',
  medium: 'bg-yellow',
  hard: 'bg-destructive',
};

export default function Workout() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const workouts = selectedCategory ? workoutsByCategory[selectedCategory] : [];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-2xl p-6 text-white card-shadow glow-primary relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Treinos</h1>
                <p className="text-white/90 text-sm">Escolha sua categoria</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Categorias
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className={`w-full h-auto py-4 flex flex-col gap-2 ${
                    selectedCategory === category.id ? 'gradient-primary text-white' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs font-medium">{category.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Workouts List */}
        {selectedCategory ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Exercícios de {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            
            {workouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{workout.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{workout.sets} séries</span>
                        <span>•</span>
                        <span>{workout.reps} reps</span>
                      </div>
                    </div>
                    <Badge className={`${difficultyColors[workout.difficulty]} text-white`}>
                      {workout.difficulty === 'easy' ? 'Fácil' : workout.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Selecione uma categoria para ver os exercícios
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
