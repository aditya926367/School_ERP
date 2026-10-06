import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="ram" element={<Dashboard />} />
        <Route path="/" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App