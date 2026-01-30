
import React, { useState, useEffect, useRef } from 'react';
/* Added BusFront to fix the 'Cannot find name BusFront' error on line 69 */
import { Power, Navigation, Activity, LogIn, Truck, ShieldAlert, CheckCircle, BusFront } from 'lucide-react';
import { socket } from '../services/mockSocket';
import { UDAIPUR_ROUTES } from '../shared/constants';
import { BusRoute } from '../shared/types';

const DriverApp: React.FC = () => {
  const [driverId, setDriverId] = useState(localStorage.getItem('driverId') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assignedRoute, setAssignedRoute] = useState<BusRoute | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const watchId = useRef<number | null>(null);

  const vehicleId = "RJ-27-PA-1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverId.trim()) return;
    
    setLoading(true);
    // Simulate lookup logic
    setTimeout(() => {
      const assignedRouteNumber = localStorage.getItem(`duty_${driverId.trim()}`) || "1";
      const route = UDAIPUR_ROUTES.find(r => r.routeNumber === assignedRouteNumber);
      setAssignedRoute(route || UDAIPUR_ROUTES[0]);
      setIsLoggedIn(true);
      localStorage.setItem('driverId', driverId.trim());
      setLoading(false);
    }, 800);
  };

  const startTrip = () => {
    if (!assignedRoute) return;
    setIsLive(true);
    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit('driver-location-update', {
            driverId,
            routeNumber: assignedRoute.routeNumber,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading || 0,
            isFull: false,
            timestamp: Date.now(),
          });
        },
        (err) => console.error("GPS Relay Error:", err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const endTrip = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    setIsLive(false);
    setIsLoggedIn(false);
    localStorage.removeItem('driverId');
  };

  if (!isLoggedIn) {
    return (
      <div className="h-full w-full bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <header className="mb-10">
            <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-orange-200">
              <BusFront size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track My Bus</h1>
            <p className="text-orange-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Captain Console</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Employee ID</label>
              <input 
                className="w-full bg-white border border-slate-200 h-14 px-6 rounded-2xl text-xl font-bold outline-none focus:border-orange-500 transition-all text-center"
                placeholder="EMP101"
                value={driverId}
                onChange={e => setDriverId(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !driverId.trim()}
              className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Activity className="animate-spin" /> : <LogIn size={20} />}
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col p-6">
      {/* Rebranded Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Captain Console</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Employee: {driverId}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${isLive ? 'border-green-500 text-green-600 bg-green-50' : 'border-slate-200 text-slate-400 bg-white'}`}>
           <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
           {isLive ? 'Transmitting' : 'Idle'}
        </div>
      </div>

      {/* Professional Vehicle Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
        <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
          <Truck size={24} />
        </div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Vehicle</div>
          <div className="text-xl font-black text-slate-900 leading-none mt-1">{vehicleId}</div>
        </div>
      </div>

      {!isLive ? (
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="bg-orange-600 rounded-[32px] p-8 text-white shadow-2xl shadow-orange-100 text-center">
            <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mb-2">Today's Mission</p>
            <h2 className="text-5xl font-black mb-2">Route {assignedRoute?.routeNumber}</h2>
            <p className="text-lg font-bold opacity-90 uppercase italic">{assignedRoute?.destination}</p>
          </div>

          <button 
            onClick={startTrip}
            className="w-full h-14 rounded-2xl bg-slate-900 text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-xl font-black uppercase tracking-widest"
          >
            <Navigation size={24} /> Start Trip
          </button>
          
          <button onClick={() => setIsLoggedIn(false)} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest py-4">
            Logout Session
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-12">
           <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-green-600">
                <Activity className="animate-pulse" size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900">Broadcasting...</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Route {assignedRoute?.routeNumber} is now Live</p>
           </div>

           <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                 <CheckCircle className="text-blue-600" size={20} />
                 <span className="text-xs font-bold text-blue-900">Satellite lock confirmed. Tracking active.</span>
              </div>
              
              <button 
                onClick={endTrip}
                className="w-full h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-red-200 text-xl font-black uppercase tracking-widest"
              >
                <Power size={24} /> End Trip
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DriverApp;
