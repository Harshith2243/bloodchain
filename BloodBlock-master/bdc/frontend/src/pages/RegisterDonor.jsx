import DonorForm from "../components/DonorForm";

export default function RegisterDonor() {
  return (
    <div className="py-10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black text-gray-900">Join the Cause</h1>
        <p className="text-gray-600">Your single donation can save up to three lives.</p>
      </div>
      <DonorForm />
    </div>
  );
}
