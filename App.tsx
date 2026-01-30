
import React, { useState } from 'react';
import UserApp from './frontend-user/App';
import DriverApp from './frontend-driver/App';
import AdminApp from './frontend-admin/App';
import { User, BusFront, ShieldCheck } from 'lucide-react';

const Main: React.FC = () => {
  const [appType, setAppType] = useState<'user' | 'driver' | 'admin' | null>(null);

  if (!appType) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-5xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Track My Bus</h1>
        <p className="text-slate-400 mb-12 max-w-xs font-bold uppercase tracking-[0.2em] text-[10px]">Unified Transit Intelligence</p>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => setAppType('user')}
            className="w-full bg-white border-2 border-slate-200 p-8 rounded-3xl flex items-center gap-6 hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <User size={32} />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-slate-900">Passenger App</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Maps & Tracking</div>
            </div>
          </button>

          <button 
            onClick={() => setAppType('driver')}
            className="w-full bg-white border-2 border-slate-200 p-8 rounded-3xl flex items-center gap-6 hover:border-orange-500 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
              <BusFront size={32} />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-slate-900">Captain Console</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPS Broadcast</div>
            </div>
          </button>

          <div className="pt-8 border-t border-slate-200 mt-4 w-full">
            <button 
              onClick={() => setAppType('admin')}
              className="w-full bg-slate-900 border-2 border-slate-900 p-6 rounded-3xl flex items-center gap-6 hover:bg-indigo-600 hover:border-indigo-600 transition-all group shadow-xl"
            >
              <div className="p-3 bg-white/10 text-white rounded-xl">
                <ShieldCheck size={28} />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Command Center</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Administration</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <button 
        onClick={() => setAppType(null)}
        className="fixed top-6 left-6 z-[100] bg-white/90 backdrop-blur shadow-xl px-5 py-2.5 rounded-full text-[10px] font-black uppercase border border-slate-200 hover:bg-white transition-colors flex items-center gap-2"
      >
        ← Switch View
      </button>
      {appType === 'user' && <UserApp />}
      {appType === 'driver' && <DriverApp />}
      {appType === 'admin' && <AdminApp />}
    </div>
  );
};

export default Main;
