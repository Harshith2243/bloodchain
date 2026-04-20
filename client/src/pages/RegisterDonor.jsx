import DonorForm from "../components/features/donor/DonorForm";
import { UserPlus } from "lucide-react";
import Badge from "../components/common/Badge";

export default function RegisterDonor() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-primary-100/50 text-primary-600 rounded-3xl">
          <UserPlus size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <Badge variant="primary">Be a Hero</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Join the Cause</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Your single donation can save up to three lives. Start by filling out your details below.</p>
        </div>
      </div>
      <DonorForm />
    </div>
  );
}
