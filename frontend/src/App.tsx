import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/forgot-password";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />

        <Route
          path="/auth/register"
          element={<Register />}
        />

        

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

        <Route path="ram" element={<Dashboard />} />
         <Route path="/" element={<Login />} />
  <Route path="/auth/register" element={<Register />} />
  <Route path="forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;