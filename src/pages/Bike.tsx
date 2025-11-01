import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Bike as BikeIcon, MapPin, Clock, Zap, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import ClientMap from '@/components/ClientMap';

// Coordenadas de exemplo para centralizar o mapa se não houver localização
const DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333]; // São Paulo

export default function Bike() {
  const [isRiding, setIsRiding] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [duration, setDuration] = useState(0); // em segundos
  const [distance, setDistance] = useState(0); // em metros
  const [route, setRoute] = useState<[number, number][]>([]); // [lat, lng]
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0); // Tempo de início em milissegundos

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

  // Função para atualizar o cronômetro
  const updateTimer = () => {
    if (startTimeRef.current > 0) {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(elapsedSeconds);
    }
  };

  // Iniciar pedalada
  const startRiding = () => {
    if (!isClient || !navigator.geolocation) {
      toast.error('Geolocalização não suportada neste navegador');
      return;
    }

    // Solicitar permissão
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasPermission(true);
        setLastPosition(position);
        setIsRiding(true);
        setDuration(0);
        setDistance(0);
        setRoute([[position.coords.latitude, position.coords.longitude]]);
        startTimeRef.current = Date.now(); // Define o tempo de início
        toast.success('Pedalada iniciada! Boa sorte! 🚴');

        // Iniciar cronômetro (atualiza a cada segundo)
        timerIntervalRef.current = setInterval(updateTimer, 1000);

        // Monitorar posição
        watchIdRef.current = navigator.geolocation.watchPosition(
          (newPosition) => {
            const newCoords: [number, number] = [newPosition.coords.latitude, newPosition.coords.longitude];

            setRoute((prevRoute) => {
              // Se for a primeira coordenada ou se a posição mudou significativamente
              if (prevRoute.length === 0) {
                setLastPosition(newPosition);
                return [newCoords];
              }

              const lastCoords = prevRoute[prevRoute.length - 1];
              const dist = calculateDistance(
                lastCoords[0],
                lastCoords[1],
                newCoords[0],
                newCoords[1]
              );
              
              // Adicionar à distância total (somente se movimento significativo > 5m)
              if (dist > 5) {
                setDistance((prev) => prev + dist);
                setLastPosition(newPosition);
                return [...prevRoute, newCoords];
              }
              
              // Se o movimento não for significativo, apenas atualiza a última posição para referência futura
              setLastPosition(newPosition);
              return prevRoute;
            });
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            toast.error('Erro ao rastrear localização');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // Aumentei o timeout para 10s
            maximumAge: 0,
            distanceFilter: 5, // Filtra atualizações de posição se a mudança for menor que 5 metros
          }
        );
      },
      (error) => {
        console.error('Erro ao solicitar permissão:', error);
        toast.error('Permissão de localização negada');
      }
    );
  };

  // Parar pedalada
  const stopRiding = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    startTimeRef.current = 0;

    setIsRiding(false);
    
    const distanceKm = (distance / 1000).toFixed(2);
    const durationMin = Math.floor(duration / 60);
    const durationSec = duration % 60;
    
    toast.success(
      `Pedalada concluída! ${distanceKm}km em ${durationMin}m ${durationSec}s 🎉`
    );
    // Aqui você salvaria a rota e as métricas
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const distanceKm = (distance / 1000).toFixed(2);
  const avgSpeed = duration > 0 ? ((distance / 1000) / (duration / 3600)).toFixed(1) : '0.0';
  const calories = Math.round((distance / 1000) * 50); // Estimativa: ~50 cal/km

  const mapCenter: [number, number] = useMemo(() => {
    if (lastPosition) {
      return [lastPosition.coords.latitude, lastPosition.coords.longitude];
    }
    return DEFAULT_CENTER;
  }, [lastPosition]);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-energetic rounded-2xl p-6 text-white card-shadow glow-pink relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <BikeIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pedalada</h1>
                <p className="text-white/90 text-sm">
                  {isRiding ? 'Em andamento...' : 'Pronto para pedalar?'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mapa */}
        <Card className="p-0 overflow-hidden">
          <ClientMap 
            route={route} 
            center={mapCenter} 
            zoom={route.length > 0 ? 15 : 10} 
          />
        </Card>

        {/* Status da Localização */}
        {!hasPermission && !isRiding && (
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
            {isRiding ? (
              <motion.div
                key="riding"
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
                    🚴
                  </motion.div>
                  <p className="text-sm text-muted-foreground">Pedalando agora...</p>
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
                <BikeIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Clique em "Iniciar Pedalada" para começar o rastreamento
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Botões de Controle */}
        <div className="flex gap-3">
          {!isRiding ? (
            <Button
              onClick={startRiding}
              className="flex-1 gradient-energetic text-white glow-pink h-14 text-lg"
            >
              <Play className="h-6 w-6 mr-2" />
              Iniciar Pedalada
            </Button>
          ) : (
            <Button
              onClick={stopRiding}
              variant="destructive"
              className="flex-1 h-14 text-lg"
            >
              <Square className="h-6 w-6 mr-2" />
              Parar Pedalada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}