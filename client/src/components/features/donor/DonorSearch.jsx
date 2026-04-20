import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  User, 
  MapPin, 
  Droplets, 
  Dna, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../../common/Card";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import Spinner from "../../common/Spinner";
import { useAuth } from "../../../context/AuthContext";

export default function DonorSearch() {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || "");
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(false);

  const bGrps = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["Male", "Female", "Other"];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDonor(null);
    
    if (!address.startsWith('0x')) {
      toast.error("Please enter a valid wallet address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/donor/${address.toLowerCase()}`);
      
      if (response.data && response.data.place) {
        setDonor(response.data);
        toast.success("Donor record found!");
      } else {
        toast.error("Donor not found or record is empty.");
      }
    } catch (err) {
      toast.error("Donor not found or invalid address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
          <Search className="text-primary-600" size={24} />
          Find Verified Donor
        </h2>
        <p className="text-slate-500 text-sm">Search the blockchain for registered donors by their wallet address.</p>
      </div>

      <Card className="p-4 border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Wallet Address (0x...)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-500 transition-all outline-none text-sm"
              required
            />
          </div>
          <Button 
            type="submit" 
            isLoading={loading} 
            disabled={loading}
            className="px-8 whitespace-nowrap"
          >
            Search Donor
          </Button>
        </form>
      </Card>

      <AnimatePresence mode="wait">
        {donor && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="p-0 overflow-hidden border-slate-200/60 shadow-xl">
              <div className="bg-primary-600 px-6 py-8 text-white relative">
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                      <User size={32} className="text-white" />
                    </div>
                    <div>
                      <Badge variant="primary" className="bg-white/20 text-white border-white/30 mb-1">Verified Donor</Badge>
                      <h3 className="text-xl font-bold tracking-tight">
                        {address.slice(0, 8)}...{address.slice(-6)}
                      </h3>
                      <div className="flex items-center gap-2 text-primary-100 text-xs mt-1">
                        <MapPin size={12} /> {donor.place}
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border-2 ${
                    donor.isActive !== false ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100' : 'bg-slate-500/20 border-slate-400 text-slate-100'
                  }`}>
                    {donor.isActive !== false ? 'ACTIVE STATUS' : 'INACTIVE'}
                  </div>
                </div>
                {/* Abstract graphic */}
                <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/10 to-transparent skew-x-12 translate-x-12"></div>
                <Droplets size={120} className="absolute -bottom-10 -right-5 opacity-10 text-white" />
              </div>

              <div className="p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem icon={Dna} label="Blood Group" value={donor.bloodGroup} primary />
                <div className="md:col-span-2 grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <InfoItem icon={Calendar} label="Age" value={`${donor.age} Years`} />
                  <InfoItem icon={User} label="Gender" value={donor.gender} />
                  <InfoItem icon={ShieldCheck} label="Health Status" value={donor.medicalCondition ? "Premium Health" : "Verified"} />
                  <InfoItem icon={TrendingUp} label="Donation Token" value={`${donor.tokenBalance || 0} BDC`} />
                </div>
              </div>

              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock size={14} /> Registered on BloodChain Network
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="bg-white text-xs">
                    <ExternalLink size={14} className="mr-1.5" /> Blockchain ID
                  </Button>
                  <Button size="sm" className="text-xs">
                    Contact Donor <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!donor && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 flex flex-col items-center text-center space-y-4 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl"
        >
          <div className="p-4 bg-slate-50 rounded-full">
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="font-bold text-slate-500">No Record Displayed</p>
            <p className="text-sm max-w-xs mx-auto">Enter a donor's wallet address above to view their verified information.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, primary = false }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${primary ? 'bg-primary-50 text-primary-600' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={`font-bold ${primary ? 'text-2xl text-slate-900' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );
}
