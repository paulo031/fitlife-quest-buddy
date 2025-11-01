import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Friend, WeekProgress } from '@/types/fitness';
import FriendCard from '@/components/FriendCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Users, Plus, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Friends() {
  const [friends, setFriends] = useLocalStorage<Friend[]>('fitlife-friends', []);
  const [weekProgress] = useLocalStorage<WeekProgress[]>('fitlife-week-progress', []);
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const userProgress = weekProgress.filter((w) => w.completed).length;
  const userPoints = weekProgress.reduce((acc, w) => acc + w.points, 0);

  const user: Friend = {
    id: 'user',
    name: 'Você',
    avatar: '',
    weeklyProgress: userProgress > 0 ? (userProgress / weekProgress.length) * 100 : 0,
    totalPoints: userPoints,
    streak: weekProgress.filter((w) => w.completed).length,
  };

  useEffect(() => {
    // Simulate friend progress based on user progress
    if (friends.length > 0) {
      const updated = friends.map((friend) => ({
        ...friend,
        weeklyProgress: Math.max(0, Math.min(100, user.weeklyProgress + (Math.random() * 40 - 20))),
        totalPoints: Math.max(0, user.totalPoints + Math.floor(Math.random() * 20 - 10)),
      }));
      if (JSON.stringify(updated) !== JSON.stringify(friends)) {
        setFriends(updated);
      }
    }
  }, [userProgress, userPoints]);

  const handleAddFriend = () => {
    if (newFriendName.trim() === '') {
      toast({
        title: 'Nome inválido',
        description: 'Por favor, digite um nome válido.',
        variant: 'destructive',
      });
      return;
    }

    if (friends.length >= 2) {
      toast({
        title: 'Limite atingido',
        description: 'Você pode adicionar no máximo 2 amigos virtuais.',
        variant: 'destructive',
      });
      return;
    }

    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name: newFriendName,
      avatar: '',
      weeklyProgress: Math.floor(Math.random() * 100),
      totalPoints: Math.floor(Math.random() * 50),
      streak: Math.floor(Math.random() * 5),
    };

    setFriends([...friends, newFriend]);
    setNewFriendName('');
    setShowAddForm(false);
    toast({
      title: 'Amigo adicionado!',
      description: `${newFriendName} foi adicionado à sua lista.`,
    });
  };

  const allParticipants = [user, ...friends].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-energetic rounded-2xl p-6 text-white card-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Modo Amigo de Treino</p>
              <h2 className="text-2xl font-bold">Ranking Local</h2>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              👥
            </motion.div>
          </div>
          <p className="text-white/90 text-sm">
            Compare seu progresso com amigos virtuais e mantenha-se motivado!
          </p>
        </motion.div>

        {/* Add Friend Button */}
        {friends.length < 2 && !showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full gradient-primary"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Amigo Virtual ({friends.length}/2)
            </Button>
          </motion.div>
        )}

        {/* Add Friend Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Adicionar Novo Amigo</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do amigo"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                />
                <Button onClick={handleAddFriend} className="gradient-success">
                  Adicionar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Ranking */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Ranking</h2>
          </div>

          {allParticipants.length === 1 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Adicione amigos virtuais para comparar seu progresso e se manter motivado!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {allParticipants.map((participant, index) => (
                <FriendCard
                  key={participant.id}
                  friend={participant}
                  rank={index + 1}
                  isUser={participant.id === 'user'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 gradient-primary text-white">
            <p className="text-lg font-semibold mb-2">
              💡 Dica: Competição Amigável
            </p>
            <p className="text-sm text-white/90">
              Os amigos virtuais simulam progresso baseado no seu desempenho. Use isso como motivação para superar seus próprios limites!
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
