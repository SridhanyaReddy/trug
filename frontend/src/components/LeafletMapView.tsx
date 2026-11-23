'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface LeafletMapViewProps {
  lat: number;
  lng: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

export default function LeafletMapView({ lat, lng, onCoordinatesChange }: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet on client side only
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix missing leaflet default marker icons in Next.js bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Custom TRUG Branded Delivery Pin
      const trugPinIcon = L.divIcon({
        className: 'custom-trug-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: #302B28; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 2px;">
              Delivery Doorstep
            </div>
            <div style="width: 32px; height: 32px; background: #D97A5B; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="#D97A5B" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="#D97A5B"></circle>
              </svg>
            </div>
            <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px); margin-top: 2px;"></div>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 16,
          zoomControl: true,
        });

        // Add Google / OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Add draggable marker
        const marker = L.marker([lat, lng], {
          icon: trugPinIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', () => {
          const position = marker.getLatLng();
          onCoordinatesChange(position.lat, position.lng);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } else {
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full z-10" />;
}
