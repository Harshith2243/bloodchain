import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8"
      >
        <span className="text-5xl">🩸</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight"
      >
        The Future of <span className="text-red-600">Blood Donation</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-xl text-gray-600 max-w-2xl"
      >
        A decentralized, transparent, and secure platform connecting blood donors with patients using Blockchain technology.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <Link to="/register" className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200">
          Become a Donor
        </Link>
        <Link to="/request" className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all">
          Request Blood
        </Link>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        <FeatureCard 
          emoji="🛡️" 
          title="Secure" 
          desc="Immutable records on the blockchain ensure your donation history is safe."
        />
        <FeatureCard 
          emoji="⚡" 
          title="Fast" 
          desc="Real-time matching between nearby donors and urgent requests."
        />
        <FeatureCard 
          emoji="🤝" 
          title="Direct" 
          desc="Direct connection between hospitals and donors without middlemen."
        />
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100"
    >
      <div className="text-3xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
