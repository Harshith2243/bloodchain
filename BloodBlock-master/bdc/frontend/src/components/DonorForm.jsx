import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";

export default function DonorForm() {
  const [form, setForm] = useState({
    donorno: "",
    donorName: "",
    age: "",
    location: "",
    mobno: "",
    bloodGroup: "0", // Default to AP (A+)
    gender: "0",     // Default to Male
    mCondition1: "false",
    mCondition2: "false",
    mCondition3: "false",
    mCondition4: "false",
    mCondition5: "false"
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/setDonor", {
        ...form,
        donorno: form.donorno.toLowerCase()
      });
      if (response.data.includes("already known") || response.data.includes("underpriced")) {
        alert("⏱️ Processing: This donor is already being registered on the blockchain. Please wait a moment and check 'Find Donor'. ");
      } else {
        alert("✅ Success: " + response.data);
      }
    } catch (err) {
      alert("❌ Error: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-red-600 text-center">Register Donor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Donor Wallet Address</label>
          <input name="donorno" placeholder="0x..." className="input" onChange={handleChange} required/>
        </div>

        <input name="donorName" placeholder="Full Name" className="input" onChange={handleChange} required/>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Age</label>
            <input name="age" type="number" placeholder="min 18" className="input" onChange={handleChange} required/>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gender</label>
            <select name="gender" className="input" onChange={handleChange}>
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Other</option>
            </select>
          </div>
        </div>

        <input name="location" placeholder="Location City" className="input" onChange={handleChange} required/>
        <input name="mobno" placeholder="Mobile Number" className="input" onChange={handleChange} required/>
        
        <div className="flex items-center space-x-4">
          <label className="text-gray-600 font-medium">Blood Group:</label>
          <select name="bloodGroup" className="input flex-1" onChange={handleChange}>
            <option value="0">A+</option>
            <option value="1">A-</option>
            <option value="2">B+</option>
            <option value="3">B-</option>
            <option value="4">O+</option>
            <option value="5">O-</option>
            <option value="6">AB+</option>
            <option value="7">AB-</option>
          </select>
        </div>

        <div className="bg-red-50 p-4 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-red-700 mb-2">Medical History (Check if Yes):</p>
          {[1,2,3,4,5].map(num => (
            <label key={num} className="flex items-center space-x-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                onChange={(e) => setForm({...form, [`mCondition${num}`]: e.target.checked ? "true" : "false"})}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span>Condition {num} (e.g., Diabetes, Hypertension)</span>
            </label>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`bg-red-600 font-bold text-white w-full py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Processing Blockchain..." : "Register Now"}
        </motion.button>
      </form>
    </motion.div>
  );
}
