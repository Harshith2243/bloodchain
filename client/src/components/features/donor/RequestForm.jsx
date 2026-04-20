import React, { useState } from "react";
import MapView from "../map/MapView";
import { motion } from "framer-motion";
import { 
  Droplet, 
  MapPin, 
  Send, 
  AlertCircle,
  Clock,
  Info,
  Activity
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import Card from "../../common/Card";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { CONTRACT_ADDRESS, REQUEST_ABI, EXPECTED_CHAIN_ID, isCorrectNetwork, switchNetwork } from "../../../contracts/config";

export default function RequestForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bankAddr: user?.address || "",
    reqlocation: "",
    reqbloodGroup: "0", // Default to A+
    isUrgent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!window.ethereum) {
      toast.error("MetaMask is not installed!");
      setLoading(false);
      return;
    }

    // Network Check
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current Chain ID:", chainId, "Expecting:", EXPECTED_CHAIN_ID);
    
    if (!isCorrectNetwork(chainId)) {
      toast.error("Wrong network! Please switch to Ganache.");
      await switchNetwork();
      setLoading(false);
      return;
    }

    const { reqlocation, reqbloodGroup, isUrgent } = form;

    try {
      const web3 = new window.Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const requestContract = new web3.eth.Contract(REQUEST_ABI, CONTRACT_ADDRESS);

      toast.loading("Initiating transaction in MetaMask...", { id: "tx-loading" });

      await requestContract.methods.createRequest(
        reqlocation,
        parseInt(reqbloodGroup)
      ).send({ from: accounts[0] });

      toast.success(isUrgent ? "🚨 EMERGENCY REQUEST BROADCASTED!" : "Blood request broadcasted successfully!", { id: "tx-loading" });
      
      if (isUrgent) {
        setForm({ ...form, reqlocation: "", reqbloodGroup: "0", isUrgent: false });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error: " + (err.code === 4001 ? "Transaction rejected by user" : err.message), { id: "tx-loading" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Droplet className="text-primary-600" size={24} />
          Create Blood Request
        </h2>
        <p className="text-slate-500 text-sm">Broadcast an urgent request to all donors in your area.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className={`space-y-6 transition-all duration-500 border-2 ${form.isUrgent ? 'border-rose-500 shadow-rose-100 bg-rose-50/10' : 'border-slate-100'}`}>
          <div className={`${form.isUrgent ? 'bg-rose-100 border-rose-200' : 'bg-amber-50 border-amber-100'} border rounded-2xl p-4 flex gap-3 transition-colors duration-500`}>
            <div className={`mt-0.5 ${form.isUrgent ? 'text-rose-600' : 'text-amber-600'}`}>
              <AlertCircle size={18} className={form.isUrgent ? 'animate-pulse' : ''} />
            </div>
            <div>
              <p className={`text-sm font-bold ${form.isUrgent ? 'text-rose-900' : 'text-amber-900'}`}>
                {form.isUrgent ? 'EMERGENCY PROTOCOL ACTIVE' : 'Standard Protocol'}
              </p>
              <p className={`text-xs ${form.isUrgent ? 'text-rose-700' : 'text-amber-700'} mt-1 leading-relaxed`}>
                {form.isUrgent 
                  ? 'Urgent requests are highlighted in red and prioritized at the top of all donor feeds. Life-critical only.'
                  : 'Registered requests are broadcasted immediately. Only hospitals or authorized personnel should use this system.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.isUrgent ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'}`}>
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Urgent Emergency?</p>
                  <p className="text-[10px] text-slate-500">Enable for critical life-saving needs</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isUrgent" 
                  className="sr-only peer" 
                  checked={form.isUrgent}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <Input 
              label="Hospital/Bank Wallet Address" 
              name="bankAddr" 
              placeholder="0x..." 
              value={form.bankAddr}
              onChange={handleChange}
              required
              id="bank-address"
              disabled={!!user?.address}
              className={user?.address ? "bg-slate-50 cursor-not-allowed opacity-80" : ""}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Required Location" 
                name="reqlocation" 
                placeholder="City Name" 
                value={form.reqlocation}
                onChange={handleChange}
                required
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1 leading-none mb-1">Blood Group Needed</label>
                <select 
                  name="reqbloodGroup" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold"
                  onChange={handleChange}
                  value={form.reqbloodGroup}
                >
                  {bloodGroups.map((group, i) => (
                    <option key={i} value={i}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Request Features</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="success" className="p-0.5 px-0.5"><Info size={12} /></Badge>
                Verified donors within 10km notified
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="success" className="p-0.5 px-0.5"><Info size={12} /></Badge>
                Blockchain-backed trust audit
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className={`w-full py-4 text-lg transition-all duration-300 shadow-lg ${form.isUrgent ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : ''}`} 
              isLoading={loading}
              disabled={loading}
            >
              <Send size={20} className="mr-2" /> {form.isUrgent ? 'Broadcast Urgent Alert' : 'Broadcast Request'}
            </Button>
          </div>
        </Card>
      </form>
    <MapView />
    </div>
  
);
}
