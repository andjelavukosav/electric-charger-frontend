import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/HomePage";
import LiveDashboard from "./pages/LiveDashboard";
import "./App.css";
import ChargerStatisticsPage from './pages/ChargerStatisticsPage'; // Nova komponenta koju ćete kreirati

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <Router>
      <div className="layout">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? 200 : 60,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<LiveDashboard />} />
            <Route path="/charger-statistics/:deviceId" element={<ChargerStatisticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
