import React from "react";
import { ShieldCheck, History, Search, FileText } from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

export default function Records() {
  const mockLogs = [
    { id: 1, type: "Contract", action: "setDonor", address: "0x7856...730E", status: "Confirmed", time: "5 mins ago" },
    { id: 2, type: "Contract", action: "createRequest", address: "0x2Dd4...6d62", status: "Confirmed", time: "12 mins ago" },
    { id: 3, type: "System", action: "Node Sync", address: "Local Node", status: "Success", time: "1 hour ago" },
    { id: 4, type: "Auth", action: "Login", address: "0x7856...730E", status: "Success", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Trail</h2>
        <p className="text-slate-500 font-medium">Verified blockchain transaction records and system logs</p>
      </div>

      <Card className="p-0 overflow-hidden border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-2">
              <History size={18} className="text-slate-600" />
              <span className="font-bold text-slate-700">Recent Activity</span>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                placeholder="Search tx hash..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all w-64"
              />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Address</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                       <span className="text-xs font-bold text-slate-700">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={log.type === 'Contract' ? 'primary' : 'secondary'} className="text-[10px]">
                       {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-500 group-hover:text-primary-600 transition-colors">{log.address}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                    {log.time}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all">
                       <FileText size={14} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none p-6 shadow-xl shadow-primary-200/50">
           <ShieldCheck size={28} className="mb-4 text-primary-200" />
           <h4 className="font-bold text-lg">Blockchain Integrity</h4>
           <p className="text-xs text-primary-100 mt-2 leading-relaxed opacity-80">All records are immutable and verified by decentralized nodes on the BloodChain network.</p>
        </Card>
        {/* Placeholder for more security stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
           {[
             { label: "Total Transactions", value: "8,284", icon: FileText },
             { label: "Active Nodes", value: "154", icon: ShieldCheck }
           ].map((stat, i) => (
             <Card key={i} className="flex flex-col justify-center items-center p-6 text-center">
                <stat.icon className="text-slate-300 mb-3" size={24} />
                <h5 className="text-2xl font-black text-slate-900">{stat.value}</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
