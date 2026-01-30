
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search, X, MapPin, ChevronRight, Users, Navigation, AlertCircle } from 'lucide-react';
import { socket } from '../services/mockSocket';
import { BusLocation, BusRoute } from '../types';
import { UDAIPUR_ROUTES, MAP_CENTER, MAP_ZOOM } from '../constants';

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

const UserMap: React.FC = () => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  
  // Explicit Logging for Debugging
  useEffect(() => {
    const obscuredKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : "NOT_FOUND";
    console.log(`[Google Maps] Initializing with Key: ${obscuredKey}`);
  }, [apiKey]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES
  });

  const [activeBuses, setActiveBuses] = useState<Record<string, BusLocation>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Geolocation States
  const [userPos, setUserPos] = useState<{ lat: number; lng: number }>(MAP_CENTER);
  const [geoError, setGeoError] = useState<string | null>(null);

  const getLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoError(null);
      },
      (error) => {
        let msg = "Location access denied.";
        if (error.code === 1) msg = "Please enable location permissions in your browser settings to see nearby buses.";
        else if (error.code === 2) msg = "Position unavailable. Checking network...";
        else if (error.code === 3) msg = "Location request timed out.";
        
        setGeoError(msg);
        console.warn(`Geolocation Error: ${msg}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
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

  if (loadError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-black text-slate-900 mb-2">Maps Failed to Load</h2>
        <p className="text-slate-500 text-sm max-w-xs">Check your API key or project restrictions in Google Cloud Console.</p>
        <code className="mt-4 p-2 bg-slate-200 rounded text-[10px]">{loadError.message}</code>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-slate-100 font-sans overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userPos}
          zoom={MAP_ZOOM}
          options={mapOptions}
        >
          {/* Active Buses */}
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

          {/* User Blue Dot */}
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
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Satellite Data...</span>
          </div>
        </div>
      )}

      {/* Geolocation Warning Toast */}
      {geoError && (
        <div className="absolute top-6 left-6 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Navigation size={18} />
              </div>
              <p className="text-[11px] font-bold text-slate-700 leading-tight pr-4">{geoError}</p>
            </div>
            <button 
              onClick={getLiveLocation}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 hover:bg-indigo-700 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Search */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden pointer-events-auto">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Find a destination..."
              className="flex-1 text-lg font-medium outline-none text-slate-800"
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

          {showResults && searchQuery && (
            <div className="max-h-60 overflow-y-auto border-t border-slate-50 custom-scrollbar">
              {filteredRoutes.map(route => (
                <button
                  key={route.routeNumber}
                  onClick={() => { setSelectedRoute(route); setShowResults(false); }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: route.color }} />
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-lg">Route {route.routeNumber}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-tight">{route.destination}</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300" size={20} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide-up Route Sheet */}
      {selectedRoute && (
        <div className="absolute inset-x-0 bottom-0 z-30 transition-transform duration-300">
          <div className="bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] p-8 max-w-lg mx-auto border-t border-slate-100">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setSelectedRoute(null)} />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black text-white mb-2 uppercase tracking-widest" style={{ backgroundColor: selectedRoute.color }}>
                  Route {selectedRoute.routeNumber}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedRoute.origin} <span className="text-slate-300 mx-1">→</span> {selectedRoute.destination}
                </h2>
              </div>
              {activeBuses[selectedRoute.routeNumber]?.isFull && (
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider border border-red-100">
                  <Users size={14} /> Full
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {selectedRoute.stops.map((stop, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${idx === 0 ? 'bg-indigo-600 border-indigo-100' : 'bg-white border-slate-200'}`} />
                    {idx !== selectedRoute.stops.length - 1 && (
                      <div className="w-0.5 h-10 bg-slate-100 absolute top-4" />
                    )}
                  </div>
                  <span className={`text-base ${idx === 0 ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>{stop}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedRoute(null)}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Back to Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMap;
