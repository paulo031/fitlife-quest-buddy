import { Walk } from '@/types/fitness';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Flame, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WalkStatsProps {
  walks: Walk[];
}

export default function WalkStats({ walks }: WalkStatsProps) {
  const totalWalks = walks.length;
  const totalDistance = walks.reduce((acc, w) => acc + w.distance, 0);
  const totalCalories = walks.reduce((acc, w) => acc + w.calories, 0);
  const totalTime = walks.reduce((acc, w) => acc + w.duration, 0);

  // Dados para o gráfico semanal (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map((date) => {
    const dayWalks = walks.filter((w) => w.date.split('T')[0] === date);
    const dayDistance = dayWalks.reduce((acc, w) => acc + w.distance, 0);
    
    return {
      day: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
      distance: parseFloat(dayDistance.toFixed(2)),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Estatísticas</h3>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center gradient-primary text-white glow-primary">
          <MapPin className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xs opacity-90 mb-1">Total de Caminhadas</p>
          <p className="text-2xl font-bold">{totalWalks}</p>
        </Card>

        <Card className="p-4 text-center gradient-success text-white glow-success">
          <TrendingUp className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xs opacity-90 mb-1">Distância Total</p>
          <p className="text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
        </Card>

        <Card className="p-4 text-center gradient-achievement text-white">
          <Flame className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xs opacity-90 mb-1">Calorias</p>
          <p className="text-2xl font-bold">{totalCalories.toLocaleString()}</p>
        </Card>

        <Card className="p-4 text-center gradient-purple text-white glow-purple">
          <Clock className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xs opacity-90 mb-1">Tempo Total</p>
          <p className="text-2xl font-bold">
            {Math.floor(totalTime / 3600)}h {Math.floor((totalTime % 3600) / 60)}m
          </p>
        </Card>
      </div>

      {/* Gráfico Semanal */}
      {walks.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-4 text-sm">Evolução Semanal (km)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [`${value} km`, 'Distância']}
              />
              <Bar 
                dataKey="distance" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </motion.div>
  );
}
