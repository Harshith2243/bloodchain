import RequestForm from "../components/features/donor/RequestForm";
import { Droplet } from "lucide-react";
import Badge from "../components/common/Badge";

export default function RequestBlood() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-primary-100/50 text-primary-600 rounded-3xl">
          <Droplet size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <Badge variant="danger">Emergency Request</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Need Assistance?</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Broadcast your request to find matched donors instantly. Your request will be securely handled via Blockchain.</p>
        </div>
      </div>
      <RequestForm />
    </div>
  );
}
