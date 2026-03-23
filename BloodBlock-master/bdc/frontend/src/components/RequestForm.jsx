import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";

export default function RequestForm() {
  const [form, setForm] = useState({
    bankAddr: "",
    reqlocation: "",
    reqbloodGroup: "0" // Default to AP (A+)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/setRequest", {
        ...form,
        bankAddr: form.bankAddr.toLowerCase()
      });
      alert(response.data);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-red-600 text-center">Request Blood</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1 font-bold uppercase text-xs">Hospital Wallet Address</label>
          <input name="bankAddr" placeholder="0x..." className="input" onChange={handleChange} required/>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1">Required Location</label>
          <input name="reqlocation" placeholder="City Name" className="input" onChange={handleChange} required/>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1">Blood Group Needed</label>
          <select name="reqbloodGroup" className="input" onChange={handleChange}>
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

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-red-600 font-bold text-white w-full py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          Broadcast Request
        </motion.button>
      </form>
    </motion.div>
  );
}
