import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  UserPlus, 
  Droplet, 
  Search, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const SidebarItem = ({ icon: Icon, label, to, active, onClick, color }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${active 
          ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
        ${color || ''}
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
    </motion.div>
  </Link>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", to: "/" },
    ...(user?.role === 'donor' 
      ? [{ icon: UserPlus, label: "Donate", to: "/register" }]
      : [{ icon: Droplet, label: "Request", to: "/request" }]
    ),
    { icon: Search, label: "Find Donor", to: "/donors" },
  ];

  const secondaryItems = [
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: HelpCircle, label: "Help Center", to: "/help" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-100 
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-8 px-2 lg:hidden">
            <span className="text-xl font-bold text-primary-600">BloodChain</span>
            <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
              Main Menu
            </div>
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={toggleSidebar}
              />
            ))}

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-8">
              Support
            </div>
            {secondaryItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={toggleSidebar}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-sm font-semibold text-slate-900">Need Help?</div>
              <p className="text-xs text-slate-500 mt-1">Our support team is here for you 24/7.</p>
              <button className="mt-3 w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Contact Support
              </button>
            </div>
            
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-200 font-bold text-sm"
            >
              <LogOut size={20} />
              <span>Logout System</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
