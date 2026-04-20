import React from 'react';
import { Hospital, MapPin, Phone, Activity, Clock, ChevronRight } from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

export default function HospitalCard({ hospital }) {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'High': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <Card className="hover:border-primary-100 transition-all group overflow-hidden" padding={false}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            <Hospital size={24} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
              {hospital.distance} away
            </Badge>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getAvailabilityColor(hospital.availability)}`}>
              {hospital.availability} STOCK
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug">
            {hospital.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin size={12} /> {hospital.location}
          </p>
        </div>

        <div className="mt-5 space-y-3 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Phone size={12} /> Contact
            </span>
            <span className="font-bold text-slate-700">{hospital.contact}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock size={12} /> Emergency
            </span>
            <span className="font-bold text-emerald-600 uppercase tracking-wider text-[10px]">24/7 Open</span>
          </div>
        </div>

        <button className="mt-5 w-full py-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all flex items-center justify-center gap-2 group/btn">
          Request Assistance <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </Card>
  );
}
