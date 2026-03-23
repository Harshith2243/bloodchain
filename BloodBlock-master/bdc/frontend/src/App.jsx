import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterDonor from "./pages/RegisterDonor";
import RequestBlood from "./pages/RequestBlood";
import BrowseDonors from "./pages/BrowseDonors";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterDonor />} />
            <Route path="/request" element={<RequestBlood />} />
            <Route path="/donors" element={<BrowseDonors />} />
          </Routes>
        </main>
        
        <footer className="py-10 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2026 BloodChain System. Built with React & Blockchain.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
