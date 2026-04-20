import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  Droplets, 
  Calendar, 
  ShieldAlert,
  Save,
  Search,
  CheckCircle2,
  Shield
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import Card from "../../common/Card";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { CONTRACT_ADDRESS, DONOR_REGISTER_ABI, EXPECTED_CHAIN_ID, isCorrectNetwork, switchNetwork } from "../../../contracts/config";

export default function DonorForm() {
  const { user, switchAccount } = useAuth();
  const [form, setForm] = useState({
    donorno: user?.address || "",
    donorName: "",
    age: "",
    location: "",
    mobno: "",
    bloodGroup: "0",
    gender: "0",
    mCondition1: false,
    mCondition2: false,
    mCondition3: false,
    mCondition4: false,
    mCondition5: false
  });

  // Keep donorno in sync with active wallet
  useEffect(() => {
    if (user?.address) {
      setForm(prev => ({ ...prev, donorno: user.address }));
    }
  }, [user?.address]);

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

    const { donorno, donorName, age, location, mobno, bloodGroup, gender } = form;
    
    // Validation
    if (parseInt(age) < 18 || parseInt(age) > 65) {
      toast.error("Age must be between 18 and 65 to register as a donor.");
      setLoading(false);
      return;
    }

    if (!donorName || donorName.trim().length === 0) {
      toast.error("Please enter your full name.");
      setLoading(false);
      return;
    }

    // Calculate medical condition based on original logic
    const med = [form.mCondition1, form.mCondition2, form.mCondition3, form.mCondition4, form.mCondition5];
    const medCounter = med.filter(c => c === true).length;
    const mCondition = medCounter >= 3;

    try {
      const web3 = new window.Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const donorRegister = new web3.eth.Contract(DONOR_REGISTER_ABI, CONTRACT_ADDRESS);

      toast.loading("Initiating transaction in MetaMask...", { id: "tx-loading" });

      await donorRegister.methods.setDonor(
        donorno.toLowerCase(),
        donorName,
        parseInt(age),
        location,
        mobno,
        mCondition,
        parseInt(gender),
        parseInt(bloodGroup)
      ).send({ from: accounts[0] });

      toast.success("Donor registered successfully on blockchain!", { id: "tx-loading" });
    } catch (err) {
      console.error(err);
      toast.error("Error: " + (err.code === 4001 ? "Transaction rejected by user" : err.message), { id: "tx-loading" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleConditionChange = (num, checked) => {
    setForm({ ...form, [`mCondition${num}`]: checked });
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="text-primary-600" size={24} />
          Donor Registration
        </h2>
        <p className="text-slate-500 text-sm">Join our network of life-savers. Your data is secured by blockchain.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-8">
          {/* Section 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Badge variant="primary">1</Badge>
              <h3 className="font-bold text-slate-800">Identity Details</h3>
            </div>
            
            <div className="space-y-2">
              <Input 
                label="Wallet Address" 
                name="donorno" 
                placeholder="0x..." 
                value={form.donorno}
                onChange={handleChange}
                required
                id="wallet-address"
                disabled={!!user?.address}
                className={user?.address ? "bg-slate-50 cursor-not-allowed opacity-80" : ""}
              />
              {user?.address && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={switchAccount}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider flex items-center gap-1 px-1"
                  >
                    <Shield size={10} />
                    Switch to another wallet
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                name="donorName" 
                placeholder="John Doe" 
                value={form.donorName}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Gender</label>
                <select 
                  name="gender" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  onChange={handleChange}
                  value={form.gender}
                >
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                  <option value="2">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Age" 
                name="age" 
                type="number" 
                placeholder="25" 
                value={form.age}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Blood Group</label>
                <select 
                  name="bloodGroup" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold"
                  onChange={handleChange}
                  value={form.bloodGroup}
                >
                  {bloodGroups.map((group, i) => (
                    <option key={i} value={i}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Badge variant="primary">2</Badge>
              <h3 className="font-bold text-slate-800">Contact & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Mobile Number" 
                name="mobno" 
                placeholder="+1 234 567 890" 
                value={form.mobno}
                onChange={handleChange}
                required
              />
              <Input 
                label="Location / City" 
                name="location" 
                placeholder="New York, NY" 
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Section 3: Health */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Badge variant="primary">3</Badge>
              <h3 className="font-bold text-slate-800 text-red-700">Medical History</h3>
            </div>
            
            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
              <p className="text-xs font-medium text-red-600 mb-4 flex items-center gap-1">
                <ShieldAlert size={14} /> Please check all that apply to you
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "No chronic diseases",
                  "No recent tattoos",
                  "Not on medication",
                  "No history of surgery (last 6 months)",
                  "Weight above 50kg"
                ].map((condition, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-red-200 transition-colors group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-red-600 checked:border-red-600 transition-all cursor-pointer"
                        onChange={(e) => handleConditionChange(idx + 1, e.target.checked)}
                      />
                      <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-4 text-lg" 
              isLoading={loading}
              disabled={loading}
            >
              <Save size={20} className="mr-2" /> Complete Registration
            </Button>
            <p className="text-center text-[10px] text-slate-400 mt-4 px-8 leading-relaxed">
              By clicking "Complete Registration", you agree to share your blood group and contact information with registered hospitals on the BloodChain network.
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
}
