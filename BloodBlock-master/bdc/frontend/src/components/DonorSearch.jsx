import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function DonorSearch() {
  const [address, setAddress] = useState("");
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Blood Groups mapping (Solidity uint8)
  const bGrps = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["Male", "Female", "Other"];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDonor(null);
    try {
      // Backend expects /getSample?search=address
      const response = await axios.get(`http://localhost:3000/getSample?search=${address.toLowerCase()}`);
      
      // The backend renders an EJS view but we want the JSON for our React app
      // HOWEVER, looking at the backend code, it calls .then((txn) => res.render("getSample", {result: txn}))
      // I should update the backend to send JSON if requested, OR just handle the response.
      // Wait, I'll check if I can just make the backend send JSON.
      
      if (response.data && response.data.result) {
        setDonor(response.data.result);
      } else {
        // If the backend returns EJS HTML, we need to fix the backend first.
        // I'll fix the backend route to return JSON for our React frontend.
        setDonor(response.data); 
      }
    } catch (err) {
      setError("Donor not found or invalid address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Search for Donors</h2>
      
      <form onSubmit={handleSearch} className="flex space-x-2 mb-10">
        <input 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Donor Wallet Address (0x...)"
          className="input flex-1 border-2 border-red-100 focus:border-red-500"
          required
        />
        <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <AnimatePresence>
        {donor && donor._place && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-red-50"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Registered Donor</p>
                <h3 className="text-2xl font-bold text-gray-800">{address.slice(0,6)}...{address.slice(-4)}</h3>
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold ${donor._active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {donor._active ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoItem label="Age" value={donor._age} />
                <InfoItem label="Location" value={donor._place} />
                <InfoItem label="Gender" value={genders[donor._donGen]} />
              </div>
              <div className="space-y-4">
                <InfoItem label="Blood Group" value={bGrps[donor._grp]} />
                <InfoItem label="Medical Condition" value={donor._medCond ? "Positive" : "None"} />
                <InfoItem label="Donation Token" value={donor.token + " BDC"} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-gray-700">{value}</p>
    </div>
  );
}
