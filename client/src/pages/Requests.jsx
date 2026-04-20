import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Clock, Droplets, ChevronRight } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/requests");
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Requests</h2>
          <p className="text-slate-500 font-medium">Real-time emergency blood needs across the network</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-bold">All Needs</div>
           <div className="px-4 py-2 text-slate-400 rounded-xl text-xs font-bold hover:text-slate-600 cursor-pointer transition-colors">Urgent Only</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-[2rem]" />)
        ) : requests.length > 0 ? (
          requests.map((req, idx) => (
            <Card key={idx} className={`relative overflow-hidden group hover:border-primary-200 transition-all ${req.isUrgent ? 'border-rose-100 bg-rose-50/10' : ''}`}>
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${
                  req.isUrgent ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-900 text-white shadow-slate-100'
                }`}>
                  {req.bloodGroup}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 truncate uppercase tracking-tight">{req.location}</h3>
                    {req.isUrgent && <Badge variant="danger" className="text-[10px] animate-pulse">Emergency</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" /> {new Date(req.createdAt * 1000).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> Node: {req.location}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                     <Button size="sm" className="rounded-lg h-8 px-4 text-[10px] font-black uppercase">Accept Request</Button>
                     <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-[10px] font-black uppercase border-slate-200">Details</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Droplets className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold">No active requests found in this region</p>
          </div>
        )}
      </div>
    </div>
  );
}
