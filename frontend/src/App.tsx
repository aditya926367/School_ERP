import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgot-password";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="ram" element={<Dashboard />} />
         <Route path="/" element={<Login />} />
  <Route path="/auth/register" element={<Register />} />
  <Route path="forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App