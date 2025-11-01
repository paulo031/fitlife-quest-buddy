import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, MapPin, Clock, Zap, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Walk() {
  const [isWalking, setIsWalking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0); // em metros
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calcular distância entre duas coordenadas (fórmula Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
  };

  // Iniciar caminhada
  const startWalking = () => {
    if (!isClient || !navigator.geolocation) {
      toast.error('Geolocalização não suportada neste navegador');
      return;
    }

    // Solicitar permissão
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasPermission(true);
        setLastPosition(position);
        setIsWalking(true);
        setDuration(0);
        setDistance(0);
        toast.success('Caminhada iniciada! Boa sorte! 🚶');

        // Iniciar cronômetro
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);

        // Monitorar posição
        watchIdRef.current = navigator.geolocation.watchPosition(
          (newPosition) => {
            if (lastPosition) {
              const dist = calculateDistance(
                lastPosition.coords.latitude,
                lastPosition.coords.longitude,
                newPosition.coords.latitude,
                newPosition.coords.longitude
              );
              
              // Adicionar à distância total (somente se movimento significativo > 5m)
              if (dist > 5) {
                setDistance((prev) => prev + dist);
                setLastPosition(newPosition);
              }
            }
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            toast.error('Erro ao rastrear localização');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      },
      (error) => {
        console.error('Erro ao solicitar permissão:', error);
        toast.error('Permissão de localização negada');
      }
    );
  };

  // Parar caminhada
  const stopWalking = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);

    setIsWalking(false);
    
    const distanceKm = (distance / 1000).toFixed(2);
    const durationMin = Math.floor(duration / 60);
    const durationSec = duration % 60;
    
    toast.success(
      `Caminhada concluída! ${distanceKm}km em ${durationMin}m ${durationSec}s 🎉`
    );
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const distanceKm = (distance / 1000).toFixed(2);
  const avgSpeed = duration > 0 ? ((distance / 1000) / (duration / 3600)).toFixed(1) : '0.0';
  const calories = Math.round((distance / 1000) * 65); // Estimativa: ~65 cal/km

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-success rounded-2xl p-6 text-white card-shadow glow-success relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Caminhada</h1>
                <p className="text-white/90 text-sm">
                  {isWalking ? 'Em andamento...' : 'Pronto para começar?'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status da Localização */}
        {!hasPermission && !isWalking && (
          <Card className="p-4 bg-yellow/10 border-yellow">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-yellow mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Permissão de Localização</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clique em "Iniciar" para permitir o rastreamento GPS
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Métricas em Tempo Real */}
        <Card className="p-6">
          <AnimatePresence mode="wait">
            {isWalking ? (
              <motion.div
                key="walking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    🚶
                  </motion.div>
                  <p className="text-sm text-muted-foreground">Caminhando agora...</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-xl">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Tempo</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-success/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Distância</p>
                    <p className="text-2xl font-bold text-foreground">
                      {distanceKm} <span className="text-sm">km</span>
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple/10 rounded-xl">
                    <Zap className="h-6 w-6 text-purple mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Velocidade Média</p>
                    <p className="text-xl font-bold text-foreground">
                      {avgSpeed} <span className="text-sm">km/h</span>
                    </p>
                  </div>

                  <div className="text-center p-4 bg-yellow/10 rounded-xl">
                    <Zap className="h-6 w-6 text-yellow mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                    <p className="text-xl font-bold text-foreground">{calories}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Clique em "Iniciar Caminhada" para começar o rastreamento
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Botões de Controle */}
        <div className="flex gap-3">
          {!isWalking ? (
            <Button
              onClick={startWalking}
              className="flex-1 gradient-success text-white glow-success h-14 text-lg"
            >
              <Play className="h-6 w-6 mr-2" />
              Iniciar Caminhada
            </Button>
          ) : (
            <Button
              onClick={stopWalking}
              variant="destructive"
              className="flex-1 h-14 text-lg"
            >
              <Square className="h-6 w-6 mr-2" />
              Parar Caminhada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}