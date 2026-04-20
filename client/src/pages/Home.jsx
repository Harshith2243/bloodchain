import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Droplet, 
  Activity, 
  ChevronRight, 
  Plus, 
  Search,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Handshake,
  MapPin,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DonorCard from "../components/features/donor/DonorCard";
import HospitalCard from "../components/features/hospital/HospitalCard";
import MapView from "../components/features/map/MapView";
import ActivityFeed from "../components/features/activity/ActivityFeed";

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <Card className="flex items-center gap-4 relative overflow-hidden group">
    <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {trend && (
        <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
          <ArrowUpRight size={12} /> {trend}
        </p>
      )}
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
      <Icon size={80} />
    </div>
  </Card>
);

const QuickAction = ({ icon: Icon, title, desc, to, variant = "primary" }) => (
  <Link to={to} className="block group">
    <Card className="h-full border-slate-100 hover:border-primary-100 hover:bg-primary-50/30 transition-all">
      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
        variant === "primary" ? "bg-primary-600 text-white" : "bg-white border border-slate-200 text-slate-600"
      }`}>
        <Icon size={20} />
      </div>
      <h4 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{title}</h4>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center text-xs font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        Get Started <ChevronRight size={14} />
      </div>
    </Card>
  </Link>
);

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, hospRes, reqRes] = await Promise.all([
          axios.get("http://localhost:3000/api/match-donors?bloodGroup=OP&location=Scranton&expandRadius=true"),
          axios.get("http://localhost:3000/api/hospitals"),
          axios.get("http://localhost:3000/api/requests")
        ]);
        setMatches(matchRes.data.matches.slice(0, 3));
        setHospitals(hospRes.data.hospitals);
        setRequests(reqRes.data.requests);
        
        // Mock initial activity feed
        setActivities([
          { id: '1', type: 'registration', title: 'New Donor Registered', description: 'Jim Halpert (A+) joined Scranton node', address: '0x5bDe39cC747400c572c5435A963bE569C44Eb896', time: '2m' },
          { id: '2', type: 'request', title: 'Urgent Request Broadcast', description: 'Scranton Medical Center needs A-', priority: 'high', address: '0x839674B97142a0e91D0028670003DD43af289dD7', time: '12m' },
          { id: '3', type: 'match', title: 'Match Success', description: 'Compatible donor found for O+ in Downtown', address: '0x1A2B3C4D5E6F...', time: '45m' }
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: "Total Donors", 
      value: "1,284", 
      trend: "+12% this month", 
      color: "bg-blue-600" 
    },
    { 
      icon: AlertTriangle, 
      label: "Emergency Cases", 
      value: (requests?.filter?.(r => r.isUrgent)?.length || 0).toString(), 
      trend: "High Priority", 
      color: "bg-rose-600" 
    },
    { 
      icon: Handshake, 
      label: "Matches Completed", 
      value: "154", 
      trend: "+24 today", 
      color: "bg-emerald-600" 
    },
    { 
      icon: Activity, 
      label: "System Health", 
      value: "99.9%", 
      trend: "Nodes Synced", 
      color: "bg-indigo-600" 
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-10 py-16 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="primary" className="bg-primary-600/20 text-primary-400 border border-primary-600/30 font-bold px-3 py-1">
              v2.5 AI-MATCHING SYSTEM
            </Badge>
            <Badge variant="warning" className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-3 py-1">
              BETA
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            Intelligent Blood <br />
            <span className="text-primary-500">Donation Chain</span>
          </h1>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
            A decentralized approach to life-saving. Matching donors and hospitals in real-time using blockchain trust.
          </p>
          <div className="mt-10 flex flex-wrap gap-5">
            <Link to="/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 h-14 px-8 text-base shadow-xl shadow-primary-900/20">
                <Plus size={20} className="mr-2" /> Become a Donor
              </Button>
            </Link>
            <Link to="/request">
              <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800 h-14 px-8 text-base">
                Create Request
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute right-[-5%] top-[10%] w-[45%] h-[80%] opacity-20 hidden lg:block">
           <div className="relative w-full h-full">
              <Activity className="text-primary-500 absolute top-0 right-0 w-64 h-64 blur-2xl animate-pulse" />
              <Droplet className="text-rose-500 absolute bottom-0 left-0 w-48 h-48 blur-3xl opacity-50" />
           </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Intelligent Map View */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
                  <MapPin size={24} className="text-primary-600" />
                  Live Network Radar
                </h2>
                <p className="text-sm text-slate-500 font-medium">Tracking verified donors and hospitals in real-time</p>
              </div>
            </div>
            <MapView donors={matches} hospitals={hospitals} />
          </section>

          {/* Smart Matches Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Zap className="text-amber-500 fill-amber-500" size={24} />
                  Smart Donor Matches
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Top-ranked matches based on compatibility and proximity</p>
              </div>
              <Link to="/donors" className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">Explore all</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                [1,2].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />)
              ) : (
                matches?.map?.((donor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <DonorCard donor={donor} highlighted={i === 0} />
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Rapid Response Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <QuickAction icon={Plus} title="Register" desc="Join the network" to="/register" />
              <QuickAction icon={Droplet} title="Broadcast" desc="Alert for needs" to="/request" variant="secondary" />
              <QuickAction icon={Search} title="Search" desc="Find donors" to="/donors" variant="secondary" />
              <QuickAction icon={Activity} title="System" desc="Audit trail" to="/records" variant="secondary" />
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Live Request Feed */}
          <Card className="p-0 overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Emergency Priority</h3>
              </div>
              <Link to="/requests" className="text-[10px] font-black text-primary-600 uppercase">View All</Link>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="p-5 animate-pulse h-20 bg-slate-50" />)
              ) : (requests?.length || 0) > 0 ? (
                requests.slice(0, 5).map((req, i) => (
                  <div key={i} className={`p-4 hover:bg-slate-50 transition-colors ${req.isUrgent ? 'bg-rose-50/20' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${req.isUrgent ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {req.bloodGroup}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{req.location}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Broadcasted {new Date(req.createdAt * 1000).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-xs">No active requests</div>
              )}
            </div>
          </Card>

          {/* Activity Feed */}
          <div className="h-[500px]">
            <ActivityFeed activities={activities} />
          </div>

          {/* Social Proof / Security */}
          <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-transparent p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <ShieldCheck className="text-indigo-400" size={20} />
                Trust Layer
              </h3>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">Secured with AES-256 and Web3 authentication protocol.</p>
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] mb-2 uppercase font-black tracking-widest text-indigo-300">
                  <span>Network Status</span>
                  <span>Synced</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[100%] h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
