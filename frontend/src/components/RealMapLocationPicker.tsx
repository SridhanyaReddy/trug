'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  Navigation,
  Compass,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface RealMapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    address: string;
    locality: string;
    lat: number;
    lng: number;
  }) => void;
  initialLat?: number;
  initialLng?: number;
  initialLocality?: string;
}

export default function RealMapLocationPicker({
  isOpen,
  onClose,
  onSelectLocation,
  initialLat = 17.4319,
  initialLng = 78.4073,
  initialLocality = 'Jubilee Hills, Hyderabad',
}: RealMapLocationPickerProps) {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<{
    display: string;
    locality: string;
    road?: string;
    suburb?: string;
    city?: string;
  }>({
    display: initialLocality,
    locality: initialLocality,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    setStatusMessage('Fetching live address from map...');
    try {
      const res = await fetch(`/api/geo/geocode?action=reverse&lat=${latitude}&lon=${longitude}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAddressDetails({
            display: data.display || `${data.locality || 'Current Area'}`,
            locality: data.locality || 'Hyderabad',
            road: data.road,
            suburb: data.suburb,
            city: data.city,
          });
          setStatusMessage(null);
          return;
        }
      }
    } catch {
      setStatusMessage('Address lookup complete.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const updateCoordinates = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    geocodeTimeoutRef.current = setTimeout(() => {
      reverseGeocode(newLat, newLng);
    }, 500);
  };

  const handleDetectGps = () => {
    setIsDetecting(true);
    setStatusMessage('Locating your position...');

    const fallbackToIp = async () => {
      try {
        setStatusMessage('Browser GPS blocked. Detecting city via network...');
        const res = await fetch('/api/geo/ip');
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            updateCoordinates(data.latitude, data.longitude);
            setIsDetecting(false);
            setStatusMessage(`Located near ${data.locality}. Pan or search to set doorstep.`);
            return;
          }
        }
      } catch {}
      setIsDetecting(false);
      setStatusMessage('Please search or pan the map to set your delivery doorstep.');
    };

    if (!navigator.geolocation) {
      fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude;
        const currentLng = pos.coords.longitude;
        setLat(currentLat);
        setLng(currentLng);
        setIsDetecting(false);
        reverseGeocode(currentLat, currentLng);
      },
      () => {
        fallbackToIp();
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    setStatusMessage(`Searching "${searchQuery.trim()}" on Google Maps...`);

    try {
      const res = await fetch(
        `/api/geo/geocode?action=search&q=${encodeURIComponent(searchQuery.trim())}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.results && json.results.length > 0) {
          const item = json.results[0];
          updateCoordinates(item.lat, item.lng);
          setStatusMessage(null);
          return;
        }
      }
      setAddressDetails({
        display: searchQuery.trim(),
        locality: searchQuery.trim(),
      });
      setStatusMessage(`Selected "${searchQuery.trim()}". You can confirm or pan the pin.`);
    } catch {
      setAddressDetails({
        display: searchQuery.trim(),
        locality: searchQuery.trim(),
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const panMap = (dLat: number, dLng: number) => {
    updateCoordinates(lat + dLat, lng + dLng);
  };

  useEffect(() => {
    if (isOpen) {
      reverseGeocode(lat, lng);
    }
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Real Google Maps Embed URL - standard interactive maps preview with road network & pins
  const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#F1E6DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#D97A5B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-[#302B28] leading-tight">
                  Google Maps Delivery Pin
                </h3>
                <span className="text-[10px] bg-[#D97A5B] text-white font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-[#6B5145] font-semibold">
                Pinpoint your exact delivery address and doorstep
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6B5145] hover:text-[#302B28] rounded-full hover:bg-[#FAF5F0] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Search Bar & GPS Auto Detect Bar */}
        <div className="p-4 bg-[#FAF5F0] border-b border-[#F1E6DC] flex flex-col sm:flex-row gap-2.5">
          <form onSubmit={handleSearchLocation} className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apartment, road, landmark, or area..."
              className="w-full pl-9 pr-20 py-2.5 bg-white text-xs font-semibold text-[#302B28] placeholder-[#6B5145]/70 rounded-2xl border border-[#F1E6DC] focus:outline-hidden focus:border-[#D97A5B] shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              disabled={isGeocoding}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#302B28] hover:bg-black text-white text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Search
            </button>
          </form>

          <button
            onClick={handleDetectGps}
            disabled={isDetecting}
            className="flex items-center justify-center gap-2 bg-[#D97A5B] hover:bg-[#c2694d] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            <span>{isDetecting ? 'Locating...' : 'Detect GPS'}</span>
          </button>
        </div>

        {/* Interactive Real Map Area */}
        <div className="relative w-full h-72 sm:h-84 bg-[#E5E3DF] overflow-hidden">
          {/* Real Google Maps Iframe */}
          <iframe
            key={googleMapsUrl}
            title="Google Maps Delivery Pin"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={googleMapsUrl}
            className="w-full h-full border-0 filter saturate-105"
          />

          {/* Central Delivery Pin Marker Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 -translate-y-4">
            <div className="flex flex-col items-center animate-bounce duration-700">
              <div className="bg-[#302B28] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-white/30 tracking-wider">
                Order Delivery Doorstep
              </div>
              <div className="w-8 h-8 rounded-full bg-[#D97A5B] border-2 border-white shadow-xl flex items-center justify-center text-white mt-1">
                <MapPin className="w-5 h-5 fill-white stroke-[#D97A5B]" />
              </div>
              <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
            </div>
          </div>

          {/* Map Pan Adjusters Overlay */}
          <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-2xl border border-[#F1E6DC] shadow-md">
            <div className="text-[9px] font-extrabold uppercase text-[#6B5145] text-center px-1">
              Adjust Pin
            </div>
            <div className="grid grid-cols-3 gap-1 w-24">
              <div />
              <button
                type="button"
                onClick={() => panMap(0.001, 0)}
                className="p-1.5 bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Pan North"
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                onClick={() => panMap(0, -0.001)}
                className="p-1.5 bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Pan West"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleDetectGps}
                className="p-1.5 bg-[#D97A5B] text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Reset to GPS"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => panMap(0, 0.001)}
                className="p-1.5 bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Pan East"
              >
                ▶
              </button>
              <div />
              <button
                type="button"
                onClick={() => panMap(-0.001, 0)}
                className="p-1.5 bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
                title="Pan South"
              >
                ▼
              </button>
              <div />
            </div>
          </div>

          {/* Coordinates indicator badge */}
          <div className="absolute left-3 bottom-3 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#F1E6DC] text-[10px] font-bold text-[#6B5145] shadow-xs flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-[#D97A5B]" />
            <span>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Selected Address Details & Confirmation */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#F1E6DC] space-y-3.5">
          {statusMessage && (
            <div className="flex items-center gap-2 p-2 bg-[#FAF5F0] rounded-xl border border-[#F1E6DC] text-[11px] font-semibold text-[#D97A5B]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-start gap-3 bg-[#FAF5F0] p-3 rounded-2xl border border-[#F1E6DC]">
            <div className="w-8 h-8 rounded-xl bg-[#D97A5B] text-white flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97A5B]">
                Selected Delivery Area
              </div>
              <div className="text-sm font-extrabold text-[#302B28] truncate mt-0.5">
                {addressDetails.locality}
              </div>
              <div className="text-xs text-[#6B5145] font-medium line-clamp-2 mt-0.5">
                {addressDetails.display}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-[#F1E6DC] bg-white hover:bg-[#FAF5F0] text-xs font-bold text-[#6B5145] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSelectLocation({
                  address: addressDetails.display,
                  locality: addressDetails.locality,
                  lat,
                  lng,
                });
                onClose();
              }}
              className="flex-2 py-3 px-6 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Deliver Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
