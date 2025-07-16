import { useEffect, useState } from "react";
import { ElectricCharger } from "../types/ElectricCharger";
import { getAllChargers } from "../services/api";
import ChargerInfoCard from "../components/ChargerInfoCard";
import "./HomePage.css";

const Home = () => {
  const [chargers, setChargers] = useState<ElectricCharger[]>([]);

  useEffect(() => {
    getAllChargers()
      .then(setChargers)
      .catch(console.error);
  }, []);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <header className="header">
          <div className="header-content">
            <div className="header-main">
              <h1>🔌 Electric Charger Overview</h1>
            </div>
          </div>
        </header>

        <div className="dashboard">
          <div className="charger-grid">
            {chargers.map((charger) => (
              <ChargerInfoCard key={charger.deviceId} charger={charger} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
