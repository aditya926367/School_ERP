import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/login"
import ForgotPassword from "./pages/forgot-password"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="ram" element={<Dashboard />} />
        <Route path="/" element={<Login/>}/>
         <Route path="forgotPassword" element={<ForgotPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App