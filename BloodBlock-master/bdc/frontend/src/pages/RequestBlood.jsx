import RequestForm from "../components/RequestForm";

export default function RequestBlood() {
  return (
    <div className="py-10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black text-gray-900">Need Assistance?</h1>
        <p className="text-gray-600">Broadcast your request to find matched donors instantly.</p>
      </div>
      <RequestForm />
    </div>
  );
}
