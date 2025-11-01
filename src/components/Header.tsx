import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { enabled, toggleNotifications } = useNotifications();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border card-shadow">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 gradient-energetic rounded-full flex items-center justify-center glow-primary">
            <span className="text-xl font-bold text-white">FL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">FitLife Lite</h1>
            <p className="text-xs text-muted-foreground">Sua jornada fitness</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotifications}
            className="relative"
          >
            <Bell className={`h-5 w-5 ${enabled ? 'text-primary' : ''}`} />
            {enabled && (
              <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-success" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
