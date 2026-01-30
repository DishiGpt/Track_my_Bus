
import React from 'react';
import { Users, MoreHorizontal, UserCheck, ShieldAlert } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  routeNumber: string | null;
  status: string;
}

interface RosterProps {
  drivers: Driver[];
  minimal?: boolean;
  onAssign?: (id: string) => void;
}

const RosterPage: React.FC<RosterProps> = ({ drivers, minimal = false, onAssign }) => {
  return (
    <div className={`${minimal ? '' : 'bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm'}`}>
      {!minimal && (
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Users className="text-indigo-600" size={32} /> Roster Registry
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 ml-1">Personnel Management Console</p>
          </div>
          <button className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors"><MoreHorizontal /></button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="py-5 px-4">Operator Name</th>
              <th className="py-5 px-4">Employee ID</th>
              <th className="py-5 px-4">Duty Sector</th>
              <th className="py-5 px-4">Relay Status</th>
              {onAssign && <th className="py-5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {drivers.map(driver => (
              <tr key={driver.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <UserCheck size={18} />
                    </div>
                    <span className="font-black text-slate-800">{driver.name}</span>
                  </div>
                </td>
                <td className="py-6 px-4 text-slate-400 font-mono text-xs">{driver.id}</td>
                <td className="py-6 px-4">
                  {driver.routeNumber ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        Route {driver.routeNumber}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-300 italic text-[10px] font-bold uppercase flex items-center gap-1">
                      <ShieldAlert size={12} /> Unassigned
                    </span>
                  )}
                </td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${driver.status === 'Assigned' ? 'bg-amber-400' : driver.status === 'On Duty' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-200'}`} />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{driver.status}</span>
                  </div>
                </td>
                {onAssign && (
                  <td className="py-6 px-4 text-right">
                    <button 
                      onClick={() => onAssign(driver.id)} 
                      className="bg-slate-900 text-white text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Deploy
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RosterPage;
