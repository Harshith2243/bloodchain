import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import RegisterDonor from "./pages/RegisterDonor";
import RequestBlood from "./pages/RequestBlood";
import BrowseDonors from "./pages/BrowseDonors";
import Requests from "./pages/Requests";
import Records from "./pages/Records";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<RegisterDonor />} />
                    <Route path="/request" element={<RequestBlood />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/donors" element={<BrowseDonors />} />
                    <Route path="/records" element={<Records />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
