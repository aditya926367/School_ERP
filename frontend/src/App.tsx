import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/forgot-password";
import MainHeader from "./layouts/mainHeader"
import SimpleHeader from "./layouts/simpleHeader";

function App() {
  return (
    <BrowserRouter>
      <Routes>


        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/admindashboard"
            element={<AdminDashboard />}
          />
        </Route>


        <Route path="login" element={<Login />} />
         <Route path="mainHeader" element={<MainHeader/>} />
         <Route path="simpleHeader" element={<SimpleHeader/>}/>
        <Route path="/auth/register" element={<Register />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;