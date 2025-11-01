import { motion } from 'framer-motion';
import { Dumbbell, MapPin, Bike, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const activities = [
  {
    id: 'workout',
    title: 'Treino',
    icon: Dumbbell,
    description: 'Exercícios personalizados',
    path: '/workout',
    gradient: 'gradient-primary',
    glow: 'glow-primary',
  },
  {
    id: 'walk',
    title: 'Caminhada',
    icon: MapPin,
    description: 'Rastreie suas caminhadas',
    path: '/walk',
    gradient: 'gradient-success',
    glow: 'glow-success',
  },
  {
    id: 'bike',
    title: 'Bike',
    icon: Bike,
    description: 'Pedale e acompanhe',
    path: '/bike',
    gradient: 'gradient-energetic',
    glow: 'glow-pink',
  },
  {
    id: 'tips',
    title: 'Dicas',
    icon: Lightbulb,
    description: 'Conselhos e nutrição',
    path: '/tips',
    gradient: 'gradient-achievement',
    glow: 'glow-purple',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-rainbow rounded-2xl p-8 text-white card-shadow text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              💪
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Equipe Treino!</h1>
            <p className="text-white/90 text-lg">
              Sua jornada fitness começa aqui
            </p>
          </div>
        </motion.div>

        {/* Activities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Escolha sua atividade</h2>
          <div className="grid grid-cols-2 gap-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={activity.path}>
                    <Card 
                      className={`p-6 ${activity.gradient} text-white ${activity.glow} hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                      
                      <div className="relative z-10 text-center space-y-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="inline-block"
                        >
                          <Icon className="h-12 w-12 mx-auto" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
                          <p className="text-sm text-white/80">{activity.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              🎯 Pronto para se superar?
            </p>
            <p className="text-sm text-muted-foreground">
              Cada passo conta na sua jornada de transformação
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
