import { Walk } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { History, MapPin, Clock, TrendingUp, Flame, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WalkHistoryProps {
  walks: Walk[];
}

export default function WalkHistory({ walks }: WalkHistoryProps) {
  if (walks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-xl font-bold text-foreground">Histórico</h3>
        </div>
        
        <Card className="p-8 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Nenhuma caminhada registrada ainda. Comece agora!
          </p>
        </Card>
      </motion.div>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Histórico</h3>
        <Badge variant="secondary" className="ml-auto">
          {walks.length} {walks.length === 1 ? 'caminhada' : 'caminhadas'}
        </Badge>
      </div>

      <div className="space-y-3">
        {walks.slice(0, 10).map((walk, index) => (
          <motion.div
            key={walk.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full gradient-energetic flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Caminhada {walk.distance.toFixed(2)} km
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(walk.date)}
                      {' · '}
                      {new Date(walk.date).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Distância</p>
                  <p className="text-sm font-semibold text-foreground">
                    {walk.distance.toFixed(2)} km
                  </p>
                </div>

                <div className="text-center">
                  <Clock className="h-4 w-4 text-purple mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Tempo</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDuration(walk.duration)}
                  </p>
                </div>

                <div className="text-center">
                  <TrendingUp className="h-4 w-4 text-success mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Velocidade</p>
                  <p className="text-sm font-semibold text-foreground">
                    {walk.avgSpeed.toFixed(1)} km/h
                  </p>
                </div>

                <div className="text-center">
                  <Flame className="h-4 w-4 text-yellow mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Calorias</p>
                  <p className="text-sm font-semibold text-foreground">
                    {walk.calories}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {walks.length > 10 && (
        <p className="text-center text-sm text-muted-foreground">
          Mostrando as 10 caminhadas mais recentes
        </p>
      )}
    </motion.div>
  );
}
