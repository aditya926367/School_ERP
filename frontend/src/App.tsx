import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;