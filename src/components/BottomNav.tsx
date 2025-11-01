import { Home, Trophy, Award, MapPin, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: MapPin, label: 'Caminhada', path: '/walk' },
  { icon: Trophy, label: 'Desafio', path: '/challenge' },
  { icon: Award, label: 'Conquistas', path: '/achievements' },
  { icon: ShoppingBag, label: 'Loja', path: '/shop' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 card-shadow">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              <motion.div
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'glow-primary' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 gradient-primary rounded-b-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
