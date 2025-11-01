import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WalkMapProps {
  route: [number, number][];
  isActive: boolean;
}

export default function WalkMap({ route, isActive }: WalkMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inicializar mapa
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: route[0],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      // Adicionar camada do mapa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Atualizar rota
    if (route.length > 0) {
      // Remover polyline anterior
      if (polylineRef.current) {
        mapRef.current.removeLayer(polylineRef.current);
      }

      // Criar nova polyline
      polylineRef.current = L.polyline(route, {
        color: isActive ? '#F5167E' : '#2D9CDB',
        weight: 4,
        opacity: 0.8,
      }).addTo(mapRef.current);

      // Adicionar marcador na posição atual
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      const lastPoint = route[route.length - 1];
      markerRef.current = L.marker(lastPoint, {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 16px; 
            height: 16px; 
            background: ${isActive ? '#F5167E' : '#2D9CDB'}; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${isActive ? 'animation: pulse 2s infinite;' : ''}
          "></div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.3); opacity: 0.7; }
            }
          </style>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(mapRef.current);

      // Ajustar visualização
      if (route.length > 1) {
        mapRef.current.fitBounds(polylineRef.current.getBounds(), {
          padding: [30, 30],
        });
      } else {
        mapRef.current.setView(lastPoint, 15);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [route, isActive]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-64 rounded-xl overflow-hidden border-2 border-border"
      style={{ background: '#e5e5e5' }}
    />
  );
}
