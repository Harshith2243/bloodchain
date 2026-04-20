import React from 'react';
import { 
  User, 
  MapPin, 
  Droplets, 
  ShieldCheck, 
  MessageCircle, 
  Navigation, 
  HeartPulse,
  Award,
  Zap,
  Phone
} from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

export default function DonorCard({ donor, highlighted = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Recently Donated': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getMatchBadge = (type) => {
    switch (type) {
      case 'exact': return <Badge variant="primary" className="bg-primary-600/10 border-primary-600/20 text-primary-600">EXACT MATCH</Badge>;
      case 'compatible': return <Badge variant="warning" className="bg-amber-500/10 border-amber-500/20 text-amber-600">COMPATIBLE</Badge>;
      case 'nearby': return <Badge variant="secondary" className="bg-slate-500/10 border-slate-500/20 text-slate-600">NEARBY</Badge>;
      default: return null;
    }
  };

  return (
    <Card 
      className={`group hover:shadow-2xl transition-all duration-500 border-2 overflow-hidden ${
        highlighted ? 'border-primary-100 bg-white' : 'border-transparent hover:border-slate-100 bg-white'
      }`}
      padding={false}
    >
      {/* Top Banner for Critical Needs */}
      {donor.isRare && (
        <div className="bg-rose-600 text-[10px] font-black text-white text-center py-1 uppercase tracking-widest animate-pulse">
          RARE BLOOD GROUP PRIORITY
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              highlighted ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'
            }`}>
              {donor.healthScore > 80 ? <Award size={28} /> : <User size={28} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-slate-900 group-hover:text-primary-700 transition-colors uppercase tracking-tight text-lg">
                  {donor.name}
                </h4>
                {donor.verified && <ShieldCheck size={16} className="text-emerald-500" />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <MapPin size={14} className="text-primary-500" /> {donor.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-black shadow-lg">
              <span className="text-[10px] leading-none opacity-60">BG</span>
              <span className="text-sm leading-none mt-1">{donor.bloodGroup}</span>
            </div>
            {getMatchBadge(donor.matchType)}
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <HeartPulse size={10} /> Health Score
              </p>
              <span className="text-xs font-black text-slate-900">{donor.healthScore || 85}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${donor.healthScore > 80 ? 'bg-emerald-500' : 'bg-primary-600'}`}
                style={{ width: `${donor.healthScore || 85}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} /> Availability
            </p>
            <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border-2 inline-flex items-center gap-1.5 ${getStatusColor(donor.availability)}`}>
               <span className={`w-1.5 h-1.5 rounded-full ${donor.availability === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
               {donor.availability?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex-1 min-w-[100px] h-11 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold border-slate-200">
            <Phone size={14} className="mr-2" /> Contact
          </Button>
          <Button variant="outline" className="flex-1 min-w-[100px] h-11 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold border-slate-200">
            <Navigation size={14} className="mr-2" /> Navigate
          </Button>
          <Button 
            className="w-full h-12 mt-2 rounded-xl bg-slate-900 hover:bg-primary-600 text-white shadow-xl shadow-slate-200 font-black text-sm transition-all"
            disabled={donor.availability !== 'Available'}
          >
            <MessageCircle size={16} className="mr-2" /> 
            {donor.availability === 'Available' ? 'ACCEPT MATCH REQ' : 'LOCK OUT'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
