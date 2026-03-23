import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-red-600 text-white p-4 flex justify-between items-center shadow-lg"
    >
      <Link to="/" className="text-2xl font-bold tracking-tighter">BloodChain</Link>
      <div className="space-x-6 font-medium flex items-center">
        <Link to="/" className="hover:text-red-100 transition">Home</Link>
        <Link to="/register" className="hover:text-red-100 transition">Donate</Link>
        <Link to="/request" className="hover:text-red-100 transition">Request</Link>
        <Link to="/donors" className="px-4 py-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition shadow-md">Find Donor</Link>
      </div>
    </motion.div>
  );
}
