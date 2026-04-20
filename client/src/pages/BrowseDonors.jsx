import DonorSearch from "../components/features/donor/DonorSearch";
import { Search } from "lucide-react";
import Badge from "../components/common/Badge";

export default function BrowseDonors() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-slate-100 text-slate-600 rounded-3xl">
          <Search size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <Badge>Database</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Browse Donors</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Verified, real-time database of blood donors registered on the BloodChain network.</p>
        </div>
      </div>
      <DonorSearch />
    </div>
  );
}
