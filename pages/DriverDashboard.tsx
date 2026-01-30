
import React, { useState, useEffect, useRef } from 'react';
import { Bus, Navigation, Power, AlertCircle, Users, Activity } from 'lucide-react';
import { socket } from '../services/mockSocket';
import { UDAIPUR_ROUTES } from '../constants';
import { BusRoute } from '../types';

const DriverDashboard: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const watchId = useRef<number | null>(null);

  const toggleTrip = () => {
    if (!selectedRoute) return;
    if (isLive) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      setIsLive(false);
    } else {
      setIsLive(true);
      startTracking();
    }
  };

  const startTracking = () => {
    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const update = {
            routeNumber: selectedRoute?.routeNumber || "0",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading || 0,
            isFull: isFull,
            timestamp: Date.now(),
          };
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          socket.emit('driver-location-update', update);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 3000 }
      );
    }
  };

  // Sync "isFull" state immediately if live
  useEffect(() => {
    if (isLive && coords) {
      socket.emit('driver-location-update', {
        routeNumber: selectedRoute?.routeNumber,
        ...coords,
        isFull: isFull,
        timestamp: Date.now()
      });
    }
  }, [isFull]);

  return (
    <div className="h-full w-full bg-[#0a0f1e] text-white flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-500 uppercase">UdaipurLink</h1>
          <p className="text-slate-500 text-sm font-bold">चालक मोड (Driver Mode)</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 border ${isLive ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-slate-700 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
          <span className="text-xs font-black uppercase">{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Route Selector */}
      {!isLive && (
        <div className="space-y-4 mb-8">
          <label className="text-slate-400 font-black text-sm uppercase">मार्ग चुनें (Select Route)</label>
          <div className="grid grid-cols-2 gap-3">
            {UDAIPUR_ROUTES.map(route => (
              <button
                key={route.routeNumber}
                onClick={() => setSelectedRoute(route)}
                className={`p-6 rounded-3xl border-4 transition-all text-left ${
                  selectedRoute?.routeNumber === route.routeNumber 
                  ? 'bg-blue-600 border-white scale-[1.02]' 
                  : 'bg-slate-800/50 border-transparent'
                }`}
              >
                <div className="text-3xl font-black mb-1">{route.routeNumber}</div>
                <div className="text-[10px] font-bold opacity-70 truncate">{route.destination}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active State View */}
      {isLive && selectedRoute && (
        <div className="bg-slate-800/50 rounded-[40px] p-8 mb-8 border border-slate-700/50 text-center">
          <div className="text-blue-400 font-black text-sm uppercase mb-2">सक्रिय मार्ग (Active Route)</div>
          <div className="text-5xl font-black mb-4">{selectedRoute.routeNumber}</div>
          <div className="text-xl text-slate-300 font-bold">{selectedRoute.origin} से {selectedRoute.destination}</div>
        </div>
      )}

      {/* Big Action Controls */}
      <div className="mt-auto space-y-4">
        {isLive && (
          <button
            onClick={() => setIsFull(!isFull)}
            className={`w-full py-8 rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
              isFull ? 'bg-red-600' : 'bg-slate-800'
            }`}
          >
            <Users size={32} />
            <span className="text-2xl font-black uppercase">बस भरी है? (Bus Full?)</span>
            <span className="text-sm opacity-60 font-bold">{isFull ? 'हाँ, भारी है' : 'नहीं, खाली है'}</span>
          </button>
        )}

        <button
          onClick={toggleTrip}
          disabled={!selectedRoute}
          className={`w-full py-12 rounded-[40px] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl disabled:opacity-20 ${
            isLive ? 'bg-white text-black' : 'bg-green-600 text-white'
          }`}
        >
          {isLive ? <Power size={48} /> : <Navigation size={48} />}
          <span className="text-3xl font-black uppercase">
            {isLive ? 'ट्रिप समाप्त करें' : 'ट्रिप शुरू करें'}
          </span>
          <span className="text-xs opacity-60 font-bold">
            {isLive ? 'END TRIP' : 'START TRIP'}
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex justify-between items-center px-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Activity size={16} />
          <span className="text-[10px] font-bold">GPS: {coords ? 'OK' : 'SEARCHING...'}</span>
        </div>
        <div className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">v2.0 Udaipur Link</div>
      </div>
    </div>
  );
};

export default DriverDashboard;
