import { motion } from 'framer-motion';
import { Lightbulb, Heart, Apple, Droplet, Moon, Smile } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tips = [
  {
    id: 1,
    icon: Droplet,
    category: 'Hidratação',
    title: 'Beba água regularmente',
    description: 'Mantenha-se hidratado bebendo pelo menos 2 litros de água por dia. A hidratação adequada melhora o desempenho e recuperação.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 2,
    icon: Apple,
    category: 'Nutrição',
    title: 'Alimentação balanceada',
    description: 'Consuma proteínas, carboidratos e gorduras saudáveis. Inclua frutas e vegetais em todas as refeições.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    id: 3,
    icon: Moon,
    category: 'Descanso',
    title: 'Durma bem',
    description: 'Durma de 7-9 horas por noite. O sono adequado é essencial para recuperação muscular e crescimento.',
    color: 'text-purple',
    bgColor: 'bg-purple/10',
  },
  {
    id: 4,
    icon: Heart,
    category: 'Aquecimento',
    title: 'Sempre aqueça antes',
    description: 'Faça 5-10 minutos de aquecimento antes do treino para prevenir lesões e melhorar o desempenho.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    id: 5,
    icon: Smile,
    category: 'Consistência',
    title: 'Seja consistente',
    description: 'A constância é mais importante que intensidade. Treine regularmente, mesmo que por pouco tempo.',
    color: 'text-yellow',
    bgColor: 'bg-yellow/10',
  },
  {
    id: 6,
    icon: Apple,
    category: 'Pré-treino',
    title: 'Alimentação pré-treino',
    description: 'Consuma carboidratos 1-2 horas antes do treino para ter energia. Bananas e aveia são ótimas opções.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    id: 7,
    icon: Droplet,
    category: 'Recuperação',
    title: 'Hidratação pós-treino',
    description: 'Reponha líquidos após o exercício. Água de coco é excelente para repor eletrólitos.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 8,
    icon: Heart,
    category: 'Alongamento',
    title: 'Alongue-se após treinar',
    description: 'O alongamento pós-treino melhora a flexibilidade e reduz dores musculares.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
];

export default function Tips() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-achievement rounded-2xl p-6 text-white card-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dicas de Saúde</h1>
                <p className="text-white/90 text-sm">
                  Conselhos para melhorar seu treino
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips Feed */}
        <div className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`${tip.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${tip.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 gradient-primary text-white text-center">
            <p className="text-lg font-semibold mb-2">
              💪 Continue se cuidando!
            </p>
            <p className="text-sm text-white/90">
              Pequenas mudanças diárias levam a grandes resultados
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
