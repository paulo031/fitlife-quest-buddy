export interface WeekProgress {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  completed: boolean;
  progress: number;
  points: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  weeklyProgress: number;
  totalPoints: number;
  streak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: number;
  progress: number;
}

export interface Workout {
  id: string;
  title: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  completed: boolean;
  day: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

export interface Walk {
  id: string;
  date: string;
  duration: number; // em segundos
  distance: number; // em km
  calories: number;
  avgSpeed: number; // km/h
  route: [number, number][]; // coordenadas [lat, lng]
}

export interface WalkGoal {
  type: 'distance' | 'time';
  dailyTarget: number; // km ou minutos
  weeklyTarget: number;
  dailyProgress: number;
  weeklyProgress: number;
  lastUpdated: string;
}
