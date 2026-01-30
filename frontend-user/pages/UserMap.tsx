
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search, X, MapPin, ChevronRight, Users, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { socket } from '../../services/mockSocket';
import { BusLocation, BusRoute } from '../../types';
import { UDAIPUR_ROUTES, MAP_CENTER, MAP_ZOOM } from '../../constants';

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

const UserMap: React.FC = () => {
  // Use Vite syntax as requested
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES
  });

  const [activeBuses, setActiveBuses] = useState<Record<string, BusLocation>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const [userPos, setUserPos] = useState<{ lat: number; lng: number }>(MAP_CENTER);
  const [geoStatus, setGeoStatus] = useState<'pending' | 'allowed' | 'denied'>('pending');

  const getLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoStatus('allowed');
      },
      (error) => {
        console.warn("Geolocation Error:", error.message);
        setGeoStatus('denied');
        // Fallback to Udaipur Center
        setUserPos(MAP_CENTER);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    getLiveLocation();

    const handleLocationChange = (data: BusLocation) => {
      setActiveBuses(prev => ({ ...prev, [data.routeNumber]: data }));
    };
    socket.on('bus-location-changed', handleLocationChange);
    return () => socket.off('bus-location-changed', handleLocationChange);
  }, [getLiveLocation]);

  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return UDAIPUR_ROUTES.filter(r => 
      r.stops.some(s => s.toLowerCase().includes(q)) || 
      r.routeNumber.includes(q)
    );
  }, [searchQuery]);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
    ]
  };

  if (!apiKey) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-red-50 p-10 text-center">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-4">API Key Missing</h2>
        <p className="text-slate-600 max-w-sm mb-8">
          The application cannot load maps. Please check your <code>.env</code> file for <code>VITE_GOOGLE_MAPS_API_KEY</code>.
        </p>
        <div className="p-4 bg-white border border-red-200 rounded-xl font-mono text-xs text-red-800">
          Expected Key Variable: VITE_GOOGLE_MAPS_API_KEY
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-black text-slate-900 mb-2">Map Load Error</h2>
        <p className="text-slate-500 text-sm mb-4">{loadError.message}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-slate-100 font-sans overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userPos}
          zoom={MAP_ZOOM}
          options={mapOptions}
        >
          {Object.values(activeBuses).map((bus: BusLocation) => (
            <Marker
              key={bus.routeNumber}
              position={{ lat: bus.lat, lng: bus.lng }}
              onClick={() => setSelectedRoute(UDAIPUR_ROUTES.find(r => r.routeNumber === bus.routeNumber) || null)}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                scale: 1.5,
                fillColor: UDAIPUR_ROUTES.find(r => r.routeNumber === bus.routeNumber)?.color || '#2563eb',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                rotation: bus.heading || 0
              }}
            />
          ))}

          <Marker 
            position={userPos} 
            icon={{
              path: (window as any).google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 4,
              strokeColor: 'rgba(59, 130, 246, 0.3)'
            }}
          />
        </GoogleMap>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Initializing Track My Bus...</span>
          </div>
        </div>
      )}

      {/* Rebranded Search Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-50 bg-slate-900 text-white flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Track My Bus | Udaipur</span>
                {geoStatus === 'denied' && (
                  <button onClick={getLiveLocation} className="text-[8px] bg-red-500 px-2 py-0.5 rounded text-white font-bold uppercase">GPS Off</button>
                )}
             </div>
             <div className="p-4 flex items-center gap-3">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Find a bus station or route..."
                className="flex-1 text-lg font-bold outline-none text-slate-800 placeholder-slate-300"
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 p-2">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {showResults && searchQuery && filteredRoutes.length > 0 && (
            <div className="mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredRoutes.map(route => (
                <button
                  key={route.routeNumber}
                  onClick={() => { setSelectedRoute(route); setShowResults(false); }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ backgroundColor: route.color }}>{route.routeNumber}</div>
                    <div>
                      <div className="font-bold text-slate-800">To {route.destination}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{route.origin} → {route.destination}</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300" size={20} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Route Info Drawer */}
      {selectedRoute && (
        <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center p-6">
          <div className="bg-white rounded-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] p-8 w-full max-w-lg border-t border-slate-100">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setSelectedRoute(null)} />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black text-white mb-2 uppercase tracking-widest" style={{ backgroundColor: selectedRoute.color }}>
                  Route {selectedRoute.routeNumber}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedRoute.destination}
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1">Status: Tracking Live</p>
              </div>
              <div className="flex flex-col items-end">
                 <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider">
                    <Navigation size={14} /> Active
                 </div>
              </div>
            </div>

            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar border-l-2 border-slate-100 ml-2">
              {selectedRoute.stops.map((stop, idx) => (
                <div key={idx} className="flex gap-4 items-center pl-4 relative">
                  <div className={`absolute -left-[11px] w-5 h-5 rounded-full border-4 border-white bg-slate-100 ${idx === 0 ? 'bg-blue-600' : ''}`} />
                  <span className={`text-sm ${idx === 0 ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>{stop}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedRoute(null)}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMap;
