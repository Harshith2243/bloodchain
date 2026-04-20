import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Droplet, 
  Handshake, 
  ShieldCheck, 
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';
import Card from '../../common/Card';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'registration': return <div className="p-2 bg-blue-500 rounded-lg text-white"><UserPlus size={16} /></div>;
    case 'request': return <div className="p-2 bg-primary-600 rounded-lg text-white"><Droplet size={16} /></div>;
    case 'match': return <div className="p-2 bg-emerald-500 rounded-lg text-white"><Handshake size={16} /></div>;
    case 'verification': return <div className="p-2 bg-indigo-500 rounded-lg text-white"><ShieldCheck size={16} /></div>;
    default: return <div className="p-2 bg-slate-500 rounded-lg text-white"><Zap size={16} /></div>;
  }
};

export default function ActivityFeed({ activities = [] }) {
  return (
    <Card className="p-0 overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Live Network Activity</h3>
        </div>
        <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase">Real-time</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
        <AnimatePresence initial={false}>
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <motion.div
                key={activity.id || i}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 group hover:bg-slate-50 transition-all cursor-default ${activity.priority === 'high' ? 'bg-primary-50/30' : ''}`}
              >
                <div className="flex gap-4">
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate tracking-tight">
                        {activity.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
                        <Clock size={10} /> {activity.time || 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {activity.description}
                    </p>
                    
                    {activity.address && (
                      <div className="mt-3 flex items-center gap-2">
                        <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
                        </code>
                        <ChevronRight size={12} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full opacity-50">
              <Zap size={32} className="text-slate-300 mb-4 animate-pulse" />
              <p className="text-sm font-bold text-slate-400">Waiting for network signals...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100">
        <button className="text-[10px] font-black text-primary-600 uppercase hover:underline">
          View Full Chain Logs
        </button>
      </div>
    </Card>
  );
}
