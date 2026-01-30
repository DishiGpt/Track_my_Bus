
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, MapPin } from 'lucide-react';

export interface Stop {
  name: string;
  status: 'passed' | 'current' | 'upcoming';
  time: string;
}

interface RideTimelineProps {
  stops: Stop[];
  routeName: string;
  destination: string;
}

const RideTimeline: React.FC<RideTimelineProps> = ({ stops, routeName, destination }) => {
  return (
    <div className="bg-white h-full flex flex-col font-sans">
      {/* Header Info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-1">
          <div>
            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
              Route {routeName}
            </span>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Towards {destination}</h2>
          </div>
          <div className="text-right">
            <div className="text-green-600 font-black text-lg">10 mins</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Arrival</div>
          </div>
        </div>
      </div>

      {/* Timeline Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {stops.map((stop, index) => {
          const isLast = index === stops.length - 1;
          const isPassed = stop.status === 'passed';
          const isCurrent = stop.status === 'current';

          return (
            <motion.div 
              key={stop.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 relative"
            >
              {/* Vertical Line Connector */}
              {!isLast && (
                <div 
                  className={`absolute left-[11px] top-6 w-0.5 h-full ${
                    isPassed ? 'bg-gray-200' : 'bg-slate-100'
                  }`} 
                />
              )}

              {/* Icon/Dot */}
              <div className="relative z-10 py-1">
                {isPassed ? (
                  <div className="bg-white">
                    <CheckCircle2 size={24} className="text-gray-300" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-25" />
                    <div className="relative bg-white">
                      <MapPin size={24} className="text-blue-600 fill-blue-50" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white py-1">
                    <Circle size={18} className="text-gray-300 ml-0.5" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className={`pb-8 flex-1 ${isPassed ? 'opacity-40' : ''}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg ${isCurrent ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                    {stop.name}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {stop.time}
                  </span>
                </div>
                {isCurrent && (
                  <p className="text-blue-600 text-xs font-black mt-1 uppercase tracking-widest">
                    Bus is arriving here
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RideTimeline;
